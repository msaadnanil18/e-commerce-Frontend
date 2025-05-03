'use client';
// pages/callback.tsx
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const Callback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const verifier = localStorage.getItem('pkce_verifier');

    if (code) {
      const getTokens = async () => {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', '7e7lc524qo2l0htrgjog8kjvsb');
        params.append('code', code as string);
        params.append('redirect_uri', 'http://localhost:3000/callback');
        // params.append('code_verifier', verifier);

        const response = await fetch(
          `https://${'ap-south-1gx0krb1tf.auth.ap-south-1.amazoncognito.com'}/oauth2/token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          }
        );

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('id_token', data.id_token);

        router.push('/');
      };

      getTokens();
    }
  }, [searchParams]);

  //   useEffect(() => {
  //     const code = searchParams.get('code');

  //     if (code) {
  //       const fetchTokens = async () => {
  //         const response = await fetch('/api/exchange-token', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ code }),
  //         });

  //         const data = await response.json();
  //         // Save tokens in localStorage/cookie/state
  //         console.log(data);
  //       };

  //       fetchTokens();
  //     }
  //   }, [searchParams]);

  return <div>Logging you in...</div>;
};

export default Callback;
