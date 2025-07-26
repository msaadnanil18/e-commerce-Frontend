'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Loader from '@/components/admin/organism/Loader';
import useAuth from '@/components/auth/useAuth';
import { FaGoogle, FaEnvelope, FaPhone, FaArrowLeft } from 'react-icons/fa';
import {
  Button,
  XStack,
  YStack,
  Input,
  Separator,
  Text,
  Card,
  View,
} from 'tamagui';
import Navbar from '@/components/navbar';

const AuthenticationUI = () => {
  const searchParams = useSearchParams();
  const { login, loading } = useAuth();
  const [authMethod, setAuthMethod] = useState('initial');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);

  const role = searchParams.get('redirect');

  if (loading) return <Loader />;

  const verifyOTP = async (T: any) => {};

  const handleLoginClick = (method: string) => {
    if (method === 'google') {
      if (
        role === '/seller/seller-registration' ||
        role == 'seller/seller-registration'
      ) {
        login('seller');
      } else {
        login('customer');
      }
    } else {
      setAuthMethod(method);
    }
  };

  const sendOTP = async (t: any) => {};
  const handleSendOTP = (r: any) => {
    if (authMethod === 'email' && email) {
      sendOTP({ email });
      setVerifying(true);
    } else if (authMethod === 'phone' && phone) {
      sendOTP({ phone });
      setVerifying(true);
    }
  };

  const handleOtpChange = (value: any, index: any) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      verifyOTP({
        code: otpString,
        ...(authMethod === 'email' ? { email } : { phone }),
      });
    }
  };

  const goBack = () => {
    if (verifying) {
      setVerifying(false);
    } else {
      setAuthMethod('initial');
    }
  };

  const renderInitialScreen = () => (
    <YStack space='lg' width='100%'>
      <Text
        textAlign='center'
        marginBottom='$3'
        fontWeight='bold'
        fontSize='$5'
      >
        Sign In
      </Text>

      <Button onPress={() => handleLoginClick('google')}>
        <FaGoogle className='text-xl' />
        <Text>Continue with Google</Text>
      </Button>

      <XStack alignItems='center' paddingVertical='md'>
        <Separator flex={1} />
        <Text paddingHorizontal='md' className='text-gray-400'>
          or
        </Text>
        <Separator flex={1} />
      </XStack>

      <YStack gap='$4' spaceDirection='vertical'>
        <Button onPress={() => handleLoginClick('email')}>
          <FaEnvelope className='text-xl' />
          <Text>Continue with Email</Text>
        </Button>

        <Button onPress={() => handleLoginClick('phone')}>
          <FaPhone className='text-xl' />
          <Text>Continue with Phone</Text>
        </Button>
      </YStack>
    </YStack>
  );

  const renderEmailInput = () => (
    <YStack space='lg' width='100%'>
      <Button
        icon={<FaArrowLeft />}
        onPress={goBack}
        chromeless
        alignSelf='flex-start'
      />

      <Text
        textAlign='center'
        marginBottom='$3'
        marginTop='$3'
        fontWeight='bold'
        fontSize='$5'
      >
        Sign in with Email
      </Text>

      <YStack space='md'>
        <Text marginBottom='$2'>Email Address</Text>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder='Enter your email'
          keyboardType='email-address'
          autoCapitalize='none'
        />
      </YStack>

      <Button marginTop='$3' onPress={handleSendOTP} disabled={!email}>
        Send Verification Code
      </Button>
    </YStack>
  );

  const renderPhoneInput = () => (
    <YStack space='lg' width='100%'>
      <Button
        icon={<FaArrowLeft />}
        onPress={goBack}
        chromeless
        alignSelf='flex-start'
      />

      <Text
        textAlign='center'
        marginBottom='$3'
        marginTop='$3'
        fontWeight='bold'
        fontSize='$5'
      >
        Sign in with Phone
      </Text>

      <YStack space='md'>
        <Text marginBottom='$2'>Phone Number</Text>
        <Input
          value={phone}
          onChangeText={setPhone}
          placeholder='Enter your phone number'
          keyboardType='phone-pad'
        />
      </YStack>

      <Button onPress={handleSendOTP} disabled={!phone} marginTop='$3'>
        Send Verification Code
      </Button>
    </YStack>
  );

  const renderOtpVerification = () => (
    <YStack space='lg' width='100%'>
      <Button
        icon={<FaArrowLeft />}
        onPress={goBack}
        chromeless
        alignSelf='flex-start'
      />

      <Text
        textAlign='center'
        marginBottom='$3'
        marginTop='$3'
        fontWeight='bold'
        fontSize='$5'
      >
        Verification Code
      </Text>
      <Text className='text-center text-gray-500 mb-6'>
        We've sent a code to {authMethod === 'email' ? email : phone}
      </Text>

      <XStack justifyContent='space-between' marginVertical='lg'>
        {otp.map((digit, index) => (
          <Input
            key={index}
            id={`otp-${index}`}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            maxLength={1}
            keyboardType='number-pad'
          />
        ))}
      </XStack>

      <Button
        onPress={handleVerifyOTP}
        disabled={otp.join('').length !== 6}
        marginTop='$3'
        marginBottom='$3'
      >
        Verify & Continue
      </Button>

      <Button variant='outlined' className='mt-2'>
        Resend Code
      </Button>
    </YStack>
  );

  return (
    <div>
      <Navbar showRoleChange={false} />
      <View
        flex={1}
        justifyContent='center'
        alignItems='center'
        paddingHorizontal='$4'
        minHeight='calc(100vh - 74px)'
      >
        <Card
          backgroundColor='$cardBackground'
          padding='$6'
          maxWidth={400}
          width='100%'
          borderRadius='$4'
          shadowColor='$shadowColor'
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          elevation={3}
        >
          {authMethod === 'initial' && renderInitialScreen()}
          {authMethod === 'email' && !verifying && renderEmailInput()}
          {authMethod === 'phone' && !verifying && renderPhoneInput()}
          {verifying && renderOtpVerification()}
        </Card>
      </View>
    </div>
  );
};

export default AuthenticationUI;
