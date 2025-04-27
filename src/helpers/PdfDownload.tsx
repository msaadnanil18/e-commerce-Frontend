import toast from 'react-hot-toast';

export const downloadPDF = (data: Record<string, any>) => {
  if (!data.pdfBase64) {
    toast.error('Missing pdfBase64 string');
    return;
  }
  const pdfBlob = base64ToBlob(data.pdfBase64, 'application/pdf');
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;

  let fileName = 'document.pdf';
  if (data.filename) {
    fileName = data.filename;
  }

  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

const base64ToBlob = (base64: any, mimeType: any) => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
};
