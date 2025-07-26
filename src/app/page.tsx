import dynamic from 'next/dynamic';
import Loading from '@/components/loading/Loading';
import { FC } from 'react';
import { HomePageConfigProvider } from '@/components/home/HomePageContext';
import { EcommarceName } from '@/helpers/utils';

export async function generateMetadata() {
  return {
    title: `Online Shopping Site for Fashion, Electronics, Home & More | ${EcommarceName()}`,
    description: `Shop online at ${EcommarceName()} for the latest in fashion, electronics, home essentials, and more. Discover top deals, fast delivery, and secure payments.`,
    keywords: [
      'Online Shopping',
      'Fashion',
      'Electronics',
      'Home Appliances',
      'E-commerce',
      'Buy Online',
      'Best Deals',
      'Online Store',
      'Shop Online',
    ],
    openGraph: {
      title: `Online Shopping Site for Fashion, Electronics, Home & More | ${EcommarceName()}`,
      description: `Explore the best products online at ${EcommarceName()} — Fashion, Electronics, Home & Living, and more. Shop now and enjoy fast delivery and great offers.`,
      url: '/',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Online Shopping Site for Fashion, Electronics, Home & More | ${EcommarceName()}`,
      description: `Shop the latest collections and trending products on ${EcommarceName()}. Discover unbeatable offers and reliable service.`,
    },
  };
}

const HomeScreen = dynamic(() => import('../components/home'), {
  loading: () => <Loading />,
});

const Home: FC = () => {
  return (
    <HomePageConfigProvider>
      <HomeScreen />
    </HomePageConfigProvider>
  );
};

export default Home;
