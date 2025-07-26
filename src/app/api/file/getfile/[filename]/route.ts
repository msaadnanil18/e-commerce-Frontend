import { NextResponse } from 'next/server';
import { getSignedUrl as getcloudfrontsignedUrl } from '@aws-sdk/cloudfront-signer';

export const GET = async (
  request: Request,
  { params }: { params: { filename: string } }
) => {
  const url = `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${params.filename}`;

  const signedUrl = getcloudfrontsignedUrl({
    url,
    dateLessThan: new Date(Date.now() + 5 * 1000),
    //  dateLessThan: new Date(Date.now() + 1000),
    privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY!,
    keyPairId: process.env.AWS_CLOUDFRONT_KEYPAIR_ID!,
  });

  return NextResponse.json(null, {
    status: 302,
    headers: {
      Location: signedUrl,
    },
  });
};
