'use client';
import React, { useState } from 'react';
import { XStack, YStack, Text, Card, Separator, ScrollView } from 'tamagui';
import {
  FaCheck,
  FaTimes,
  FaPlus,
  FaClock,
  FaExclamationTriangle,
  FaShieldAlt,
  FaBan,
} from 'react-icons/fa';
import { IProduct, IStatusLog } from '@/types/products';
import dayjs from 'dayjs';

const getStatusIcon = (status: IStatusLog['status']) => {
  switch (status) {
    case 'pending':
      return <FaClock size={16} color='var(--orange10)' />;
    case 'approved':
      return <FaCheck size={16} color='var(--green10)' />;
    case 'restricted':
      return <FaExclamationTriangle size={16} color='var(--yellow10)' />;
    case 'suspended':
      return <FaShieldAlt size={16} color='var(--blue10)' />;
    case 'rejected':
      return <FaBan size={16} color='var(--red10)' />;
    default:
      return null;
  }
};

const getStatusColor = (status: IStatusLog['status']) => {
  switch (status) {
    case 'pending':
      return '$orange10';
    case 'approved':
      return '$green10';
    case 'restricted':
      return '$yellow10';
    case 'suspended':
      return '$blue10';
    case 'rejected':
      return '$red10';
    default:
      return '$gray10';
  }
};

const StatusLog: React.FC<{ product: IProduct | null }> = ({ product }) => {
  return (
    <YStack space='$4' padding='$4' width='100%'>
      <ScrollView maxHeight={300}>
        <YStack space='$3'>
          {(product?.statusLogs || []).length === 0 ? (
            <Card padding='$4'>
              <Text textAlign='center' color='$gray10'>
                No status logs available
              </Text>
            </Card>
          ) : (
            (product?.statusLogs || []).map((log, index) => (
              <Card key={index} padding='$4'>
                <XStack justifyContent='space-between' alignItems='center'>
                  <XStack space='$2' alignItems='center'>
                    {getStatusIcon(log.status)}
                    <Text
                      fontSize='$4'
                      fontWeight='bold'
                      color={getStatusColor(log.status)}
                      textTransform='capitalize'
                    >
                      {log.status}
                    </Text>
                  </XStack>
                </XStack>

                <Separator marginVertical='$3' />

                <Text fontSize='$3' marginBottom='$2'>
                  {log.reason}
                </Text>

                <XStack justifyContent='space-between' marginTop='$2'>
                  <Text fontSize='$3' color='$gray10'>
                    Created:{' '}
                    {dayjs(log.createdAt).format('MMMM D, YYYY h:mm A')}
                  </Text>
                  <Text fontSize='$3' color='$gray10'>
                    Updated:{' '}
                    {dayjs(log.updatedAt).format('MMMM D, YYYY h:mm A')}
                  </Text>
                </XStack>
              </Card>
            ))
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default StatusLog;
