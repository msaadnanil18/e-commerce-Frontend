import Slider from 'react-slick';
import { Image, View } from 'tamagui';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FC } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useDarkMode } from '@/hook/useDarkMode';
import { IHomePageConfig } from '@/types/HomePageConfig';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';
import { useRouter } from 'next/navigation';

const NextArrow = () => {
  const isDark = useDarkMode();

  return <IoIosArrowForward color={isDark ? '#F5F3E7' : '#111111'} />;
};

const PrevArrow = () => {
  const isDark = useDarkMode();

  return <IoIosArrowBack color={isDark ? '#F5F3E7' : '#111111'} />;
};

const Carousel: FC<{ homeScreenData: IHomePageConfig | null }> = ({
  homeScreenData,
}) => {
  const router = useRouter();
  const settings = {
    className: 'center',
    centerMode: true,
    centerPadding: '60px',
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    cssEase: 'linear',
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  // const images = [
  //   'https://res.cloudinary.com/dmkkl6bcz/image/upload/v1736463025/9636c475-b674-4f6b-8325-57d2d2e09e55_npgwvm.webp',
  //   'https://res.cloudinary.com/dmkkl6bcz/image/upload/v1737504317/freshome/bathroom/WhatsApp_Image_2025-01-12_at_12.44.42_trj3zf.jpg',
  //   'https://res.cloudinary.com/dmkkl6bcz/image/upload/v1736529660/bc797688-714f-4e3d-8b79-5a3f00562647.png',
  //   'https://res.cloudinary.com/dmkkl6bcz/image/upload/v1736529701/114dbfe9-8bdd-4adc-a645-5c5a48a0e0e6.png',
  //   'https://res.cloudinary.com/dmkkl6bcz/image/upload/v1736527997/4daf74c4-adb9-4880-b711-30d589e27ec6.png',
  // ];

  return (
    <div className=' ml-6'>
      <Slider {...settings}>
        {homeScreenData?.bannerProducts.map((banner, index) => (
          <div
            key={index}
            onClick={() => {
              router.push(
                `/product-details/${banner.product._id}?name=${banner.product.name}&description=${banner.product.description}`
              );
            }}
          >
            <RenderDriveFile
              file={banner.bannerThumbnail || banner.product.thumbnail}
              className='w-full h-80'
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

const HeroSection: FC<{ homeScreenData: IHomePageConfig | null }> = ({
  homeScreenData,
}) => {
  return (
    <View
      flexDirection='row'
      justifyContent='space-between'
      alignItems='center'
      padding='$2'
      backgroundColor='$background'
    >
      <View flex={2} marginRight='$4'>
        <Carousel homeScreenData={homeScreenData} />
      </View>

      <View flex={1}>
        <View marginBottom='$4'>
          <Image
            src='/banner1.jpg'
            alt='Banner 1'
            width='100%'
            height={140}
            borderRadius='$4'
          />
        </View>
        <View>
          <Image
            src='/banner2.jpg'
            alt='Banner 2'
            width='100%'
            height={140}
            borderRadius='$4'
          />
        </View>
      </View>
    </View>
  );
};

export default HeroSection;
