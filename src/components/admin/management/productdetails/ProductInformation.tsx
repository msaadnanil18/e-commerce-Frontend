'use client';

import { IProduct } from '@/types/products';
import React, { FC, useState } from 'react';
import { XStack, YStack, Card, Text, Separator, styled, Button } from 'tamagui';
import {
  FaBoxOpen,
  FaIndustry,
  FaBalanceScale,
  FaRulerCombined,
  FaClipboardList,
  FaStore,
  FaTag,
  FaTruck,
  FaMoneyBillWave,
  FaWeightHanging,
  FaExclamationTriangle,
  FaAlignLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaPercentage,
} from 'react-icons/fa';
import { HiReceiptTax } from 'react-icons/hi';
import { startCase } from 'lodash-es';

const StyledCard = styled(Card, {
  padding: '$4',
  borderRadius: '$4',
  backgroundColor: '$background',
  shadowColor: '$shadow',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  hoverStyle: { shadowOpacity: 0.2, transform: 'scale(1.02)' },
  flex: 1,
  minWidth: 300,
  margin: '$2',
});

const ProductExtraDetails: FC<{ product: IProduct | null }> = ({ product }) => {
  return (
    <XStack
      flexWrap='wrap'
      justifyContent='center'
      alignItems='flex-start'
      space='$4'
    >
      <StyledCard>
        <YStack space='$3'>
          <XStack alignItems='center'>
            <FaStore size={18} color='#007AFF' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Seller:
            </Text>
            <Text flex={1}>{product?.seller?.businessName || 'N/A'}</Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaTag size={18} color='#FF3B30' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Brand:
            </Text>
            <Text flex={1}>
              {product?.sellerSpecificDetails?.brand || 'N/A'}
            </Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaIndustry size={18} color='#AF52DE' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Manufacturer:
            </Text>
            <Text flex={1}>
              {product?.sellerSpecificDetails?.manufacturer || 'N/A'}
            </Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaBoxOpen size={18} color='#FF9500' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Packaging:
            </Text>
            <Text flex={1}>
              {product?.sellerSpecificDetails?.packaging || 'N/A'}
            </Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaTruck size={18} color='#34C759' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Service Terms:
            </Text>
            <Text flex={1}>
              {product?.sellerSpecificDetails?.serviceTerms || 'N/A'}
            </Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaMoneyBillWave size={18} color='#5856D6' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Payment Options:
            </Text>
            <Text flex={1}>
              {product?.sellerSpecificDetails?.paymentOptions?.immediatePayment
                ? 'Immediate Payment'
                : 'Deferred Payment'}
            </Text>
          </XStack>
        </YStack>
      </StyledCard>

      {/* <StyledCard>
        <YStack space='$3'>
          <XStack alignItems='center'>
            <FaBalanceScale size={18} color='#5856D6' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Min Quantity:
            </Text>
            <Text flex={1}>{product?.quantityRules?.min || 'N/A'}</Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaBalanceScale size={18} color='#5856D6' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Max Quantity:
            </Text>
            <Text flex={1}>{product?.quantityRules?.max || 'N/A'}</Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaRulerCombined size={18} color='#FF9500' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Step:
            </Text>
            <Text flex={1}>{product?.quantityRules?.step || 'N/A'}</Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaClipboardList size={18} color='#34C759' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Predefined Quantities:
            </Text>
            <Text flex={1}>
              {product?.quantityRules?.predefined?.join(', ') || 'N/A'}
            </Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <HiReceiptTax size={18} color='#34C759' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              HSN Code:
            </Text>
            <Text flex={1}>{product?.hsnCode || 'N/A'}</Text>
          </XStack>
        </YStack>
      </StyledCard> */}

      <StyledCard>
        <YStack space='$3'>
          <XStack alignItems='center'>
            <FaBalanceScale size={18} color='#5856D6' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Min Quantity:
            </Text>
            <Text flex={1}>{product?.quantityRules?.min || 'N/A'}</Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaBalanceScale size={18} color='#5856D6' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Max Quantity:
            </Text>
            <Text flex={1}>{product?.quantityRules?.max || 'N/A'}</Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaRulerCombined size={18} color='#FF9500' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Step:
            </Text>
            <Text flex={1}>{product?.quantityRules?.step || 'N/A'}</Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaClipboardList size={18} color='#34C759' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Predefined Quantities:
            </Text>
            <Text flex={1}>
              {product?.quantityRules?.predefined?.join(', ') || 'N/A'}
            </Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaPercentage size={18} color='#FF3B30' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Discount Tiers:
            </Text>
            <YStack flex={1}>
              {(product?.quantityRules?.discountTiers || [])?.length > 0 ? (
                product?.quantityRules.discountTiers.map((tier, index) => (
                  <Text key={index} fontSize={14} color='$gray10'>
                    Qty {tier.quantity}+:{' '}
                    {tier.discountType === 'percentage'
                      ? `${tier.value}%`
                      : `₹${tier.value}`}{' '}
                    off
                  </Text>
                ))
              ) : (
                <Text color='$gray10'>N/A</Text>
              )}
            </YStack>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <HiReceiptTax size={18} color='#34C759' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              HSN Code:
            </Text>
            <Text flex={1}>{product?.hsnCode || 'N/A'}</Text>
          </XStack>
        </YStack>
      </StyledCard>

      <StyledCard>
        <YStack space='$3'>
          <XStack alignItems='center'>
            <FaWeightHanging size={18} color='#FF2D55' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Weight:
            </Text>
            <Text flex={1}>
              {product?.physicalAttributes?.weight}{' '}
              {product?.physicalAttributes?.weightUnit}
            </Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaRulerCombined size={18} color='#FF9500' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Dimensions:
            </Text>
            <Text flex={1}>
              {product?.physicalAttributes?.dimensions?.length} x{' '}
              {product?.physicalAttributes?.dimensions?.width} x{' '}
              {product?.physicalAttributes?.dimensions?.height}{' '}
              {product?.physicalAttributes?.dimensions?.dimensionUnit}
            </Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <HiReceiptTax size={18} color='#5856D6' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Tax Type:
            </Text>
            <Text flex={1}>{startCase(product?.taxType) || 'N/A'}</Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            {product?.isApproved ? (
              <FaCheckCircle size={18} color='#34C759' />
            ) : (
              <FaTimesCircle size={18} color='#FF3B30' />
            )}
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Approved:
            </Text>
            <Text flex={1}>{product?.isApproved ? 'Yes' : 'No'}</Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaExclamationTriangle size={18} color='#FF3B30' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Updated Reason:
            </Text>
            <Text flex={1}>{product?.reason || 'N/A'}</Text>
          </XStack>
          <Separator />
          <XStack alignItems='center'>
            <FaAlignLeft size={18} color='#007AFF' />
            <Text fontWeight='bold' width={150} marginLeft='$2'>
              Description:
            </Text>
            <Text numberOfLines={20} flex={1}>
              {product?.description || 'N/A'}
            </Text>
          </XStack>
        </YStack>
      </StyledCard>
    </XStack>
  );
};

export default ProductExtraDetails;
