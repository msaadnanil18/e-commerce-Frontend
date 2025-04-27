'use client';
import React from 'react';
import { YStack, Text, XStack } from 'tamagui';
import { FaCheckCircle } from 'react-icons/fa';

const RegistrationCompletion = () => {
  return (
    <YStack
      space='$4'
      width='100%'
      alignItems='center'
      justifyContent='center'
      height='100%'
    >
      <FaCheckCircle size={100} color='green' />
      <Text fontSize='$6' fontWeight='bold' color='$green10'>
        Registration Completed
      </Text>
      <Text textAlign='center' color='$gray10'>
        Your seller registration process is now complete. Our team will review
        your application and get back to you soon.
      </Text>
    </YStack>
  );
};

export default RegistrationCompletion;
