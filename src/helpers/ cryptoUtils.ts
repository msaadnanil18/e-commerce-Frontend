export async function encryptData(
  data: string,
  password: string
): Promise<string> {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM needs 12-byte IV

  const key = await getKeyFromPassword(password, iv);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    enc.encode(data)
  );

  const encryptedArray = new Uint8Array(encrypted);
  const result = new Uint8Array(iv.length + encryptedArray.length);
  result.set(iv);
  result.set(encryptedArray, iv.length);

  return btoa(String.fromCharCode(...result));
}

export async function decryptData(
  encryptedData: string,
  password: string
): Promise<string> {
  try {
    // Validate and clean the base64 string
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new Error('Encrypted data must be a non-empty string');
    }

    // Remove any whitespace and validate base64 format
    const cleanedData = encryptedData.trim();

    // Check if it's valid base64 (basic check)
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanedData)) {
      throw new Error('Invalid base64 format');
    }

    // Attempt to decode base64
    let binaryString: string;
    try {
      binaryString = atob(cleanedData);
    } catch (e) {
      throw new Error(`Base64 decoding failed: ${e}`);
    }

    // Convert to Uint8Array
    const data = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      data[i] = binaryString.charCodeAt(i) & 0xff;
    }

    // Validate minimum length (12 bytes IV + at least some encrypted data)
    if (data.length < 13) {
      throw new Error('Encrypted data is too short');
    }

    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);

    const key = await getKeyFromPassword(password, iv);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    // Log the actual error for debugging
    console.error('Decryption error details:', {
      error: error,
      encryptedDataLength: encryptedData?.length,
      encryptedDataSample: encryptedData?.substring(0, 50) + '...',
    });

    if (error instanceof Error) {
      throw error; // Re-throw with original message
    }
    throw new Error(`Decryption failed: ${error}`);
  }
}

async function getKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}
