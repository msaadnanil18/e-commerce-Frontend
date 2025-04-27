'use client';
import Link from 'next/link';
import React from 'react';
import { Image, Button, Card, XStack, Text } from 'tamagui';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/product-details/${product.id}`} passHref>
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
        <Image
          src={product.image}
          alt={product.name}
          width={180}
          height={140}
          borderRadius='$2'
          hoverStyle={{
            scale: 1.1,
            opacity: 0.9,
          }}
        />
        <Text fontSize='$3' fontWeight={500} marginTop='$2'>
          {product.name}
        </Text>
        <Text fontSize='$4' color='$primary' marginTop='$1'>
          ₹{product.price.toFixed(2)}
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
