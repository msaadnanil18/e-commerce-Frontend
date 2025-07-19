'use client';
import { Image } from 'tamagui';
import { useRouter } from 'next/navigation';

const Logo = () => {
  const router = useRouter();

  return (
    <div
      className='cursor-pointer rounded-lg w-[40px] h-[40px] all-center'
      onClick={() => router.push('/')}
    >
      <Image
        src={process.env.NEXT_PUBLIC_ECOMMERCE_LOGO}
        width='$7'
        height={40}
        maxWidth='150px'
        maxHeight='80px'
      />
    </div>
  );
};

export default Logo;
