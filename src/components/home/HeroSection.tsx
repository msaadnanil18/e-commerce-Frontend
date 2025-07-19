import Slider from 'react-slick';
import { Image, View, XStack } from 'tamagui';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FC } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useDarkMode } from '@/hook/useDarkMode';
import { IHomePageConfig } from '@/types/HomePageConfig';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';
import { useRouter } from 'next/navigation';
import { useScreen } from '@/hook/useScreen';

const NextArrow = ({ onClick }: { onClick?: () => void }) => {
  const isDark = useDarkMode();

  return (
    <View
      position='absolute'
      top='50%'
      right='10px'
      zIndex={2}
      backgroundColor={isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)'}
      //@ts-ignore
      borderRadius='50%'
      width={40}
      height={40}
      justifyContent='center'
      alignItems='center'
      cursor='pointer'
      onPress={onClick}
      hoverStyle={{
        backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
      }}
      style={{
        transform: 'translateY(-50%)',
        transition: 'all 0.2s ease',
      }}
    >
      <IoIosArrowForward size={20} color={isDark ? '#F5F3E7' : '#111111'} />
    </View>
  );
};

const PrevArrow = ({ onClick }: { onClick?: () => void }) => {
  const isDark = useDarkMode();

  return (
    <View
      position='absolute'
      top='50%'
      left='10px'
      zIndex={2}
      backgroundColor={isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)'}
      //@ts-ignore
      borderRadius='50%'
      width={40}
      height={40}
      justifyContent='center'
      alignItems='center'
      cursor='pointer'
      onPress={onClick}
      hoverStyle={{
        backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
      }}
      style={{
        transform: 'translateY(-50%)',
        transition: 'all 0.2s ease',
      }}
    >
      <IoIosArrowBack size={20} color={isDark ? '#F5F3E7' : '#111111'} />
    </View>
  );
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
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: '20px',
          arrows: false, // Hide arrows on mobile for better UX
        },
      },
    ],
  };

  return (
    <View position='relative'>
      <Slider {...settings}>
        {(homeScreenData?.bannerProducts || []).map((banner, index) => (
          <View
            key={index}
            onPress={() => {
              router.push(
                `/product-details/${banner.product._id}?name=${banner.product.name}&description=${banner.product.description}`
              );
            }}
            cursor='pointer'
          >
            <RenderDriveFile
              file={banner.bannerThumbnail || banner.product.thumbnail}
              style={{
                width: '100%',
                height: 320,
                borderRadius: 8,
                objectFit: 'cover',
              }}
            />
          </View>
        ))}
      </Slider>
    </View>
  );
};
// const NextArrow = () => {
//   const isDark = useDarkMode();
//   return <IoIosArrowForward color={isDark ? '#F5F3E7' : '#111111'} />;
// };

// const PrevArrow = () => {
//   const isDark = useDarkMode();
//   return <IoIosArrowBack color={isDark ? '#F5F3E7' : '#111111'} />;
// };

// const Carousel: FC<{ homeScreenData: IHomePageConfig | null }> = ({
//   homeScreenData,
// }) => {
//   const router = useRouter();
//   const settings = {
//     className: 'center',
//     centerMode: true,
//     centerPadding: '60px',
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     pauseOnHover: false,
//     cssEase: 'linear',
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: {
//           centerPadding: '20px',
//         },
//       },
//     ],
//   };

//   return (
//     <View>
//       <Slider {...settings}>
//         {(homeScreenData?.bannerProducts || []).map((banner, index) => (
//           <View
//             key={index}
//             onPress={() => {
//               router.push(
//                 `/product-details/${banner.product._id}?name=${banner.product.name}&description=${banner.product.description}`
//               );
//             }}
//             cursor='pointer'
//           >
//             <RenderDriveFile
//               file={banner.bannerThumbnail || banner.product.thumbnail}
//               style={{
//                 width: '100%',
//                 height: 320,
//                 borderRadius: 8,
//                 objectFit: 'cover',
//               }}
//             />
//           </View>
//         ))}
//       </Slider>
//     </View>
//   );
// };

const HeroSection: FC<{ homeScreenData: IHomePageConfig | null }> = ({
  homeScreenData,
}) => {
  return (
    <XStack space='$4' alignItems='flex-start'>
      <View flex={2}>
        <Carousel homeScreenData={homeScreenData} />
      </View>

      <View flex={1} space='$4'>
        <Image
          src='/banner1.jpg'
          alt='Banner 1'
          width='100%'
          height={140}
          borderRadius='$4'
        />
        <Image
          src='/banner2.jpg'
          alt='Banner 2'
          width='100%'
          height={140}
          borderRadius='$4'
        />
      </View>
    </XStack>
  );
};

export default HeroSection;
