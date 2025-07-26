import SellerRegistration from '@/components/auth/SellerRegistration';
import Navbar from '@/components/navbar';
import { EcommarceName } from '@/helpers/utils';
import React, { FC } from 'react';

export async function generateMetadata() {
  return {
    title: `Register as a Seller | ${EcommarceName()}`,
    description:
      'Join our marketplace as a seller and start growing your business today. Register easily and access millions of potential customers through our trusted e-commerce platform.',
    keywords: [
      'Seller Registration',
      'Become a Seller',
      'E-commerce Seller Account',
      'Marketplace Registration',
      'Start Selling Online',
      'Vendor Signup',
    ],
    openGraph: {
      title: `Register as a Seller | ${EcommarceName()}`,
      description:
        'Join our trusted marketplace and grow your business by registering as a seller. Access tools, analytics, and millions of potential buyers.',
      url: '/seller/seller-registration',
      type: 'website',
    },
  };
}

const SellerRegistrationPage: FC = () => {
  return (
    <div>
      <Navbar showSearchInput={false} showRoleChange={false} />
      <SellerRegistration />
    </div>
  );
};

export default SellerRegistrationPage;
