'use client';

import Link from 'next/link';
import React from 'react';
import { Button, Card, XStack, Text, View } from 'tamagui';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';
import { IProduct } from '@/types/products';
import PriceFormatter from '../appComponets/PriceFormatter/PriceFormatter';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { truncate } from 'lodash-es';
import { useRouter } from 'next/navigation';
const Name = ({
  product,
  router,
}: {
  product: IProduct;
  router: AppRouterInstance;
}) => (
  <Text
    onPress={() => router.push(`/product-details/${product._id}`)}
    hoverStyle={{
      color: '$linkColor',
      cursor: 'pointer',
    }}
  >
    {truncate(product.name, { length: 20 })}
  </Text>
);

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const router = useRouter();
  return (
    <Link href={`/product-details/${product._id}`} passHref>
      <Card
        bordered
        padding='$4'
        margin='$2'
        width={200}
        height={300}
        alignItems='center'
        className='cursor-pointer'
        backgroundColor='$cardBackground'
      >
        <RenderDriveFile
          file={product.thumbnail}
          style={{ width: 180, height: 140, borderRadius: '10px' }}
        />

        <Name product={product} router={router} />

        <Text fontSize='$4' color='$primary' marginTop='$1'>
          {product.variants?.[0].discount ? (
            <View>
              <PriceFormatter crossed value={product?.variants?.[0]?.price} />
              <PriceFormatter value={product?.variants?.[0]?.originalPrice} />
            </View>
          ) : (
            <PriceFormatter value={product?.variants?.[0]?.originalPrice} />
          )}
          {/* ₹{product.price.toFixed(2)} */}
        </Text>
        <Card.Footer>
          <XStack flex={1} />
          <Button
            size='$3'
            padding='$4'
            fontSize='$3'
            color='$text'
            marginTop='$2'
            onPress={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            ADD TO CART
          </Button>
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default ProductCard;
