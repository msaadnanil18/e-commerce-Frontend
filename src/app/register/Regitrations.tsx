'use client';
import { ServiceErrorManager } from '@/helpers/service';
import {
  MakeAdminAndSuperAdmin,
  TokenVerificationService,
} from '@/services/auth';
import React, { FC, useEffect, useState, useMemo } from 'react';
import {
  XStack,
  YStack,
  Text,
  Button,
  Spinner,
  Card,
  H2,
  Paragraph,
  H6,
} from 'tamagui';
import { setUser } from '@/states/slices/authSlice';
import { useAuth as cognitoUseAuth } from 'react-oidc-context';
import { MdMail, MdCheckCircle, MdWarning } from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

const Regitrations: FC<{ token?: string | null }> = ({ token }) => {
  const auth = cognitoUseAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const verifyToken = async () => {
    if (!token) return;

    setIsVerifying(true);

    ServiceErrorManager(
      TokenVerificationService({
        data: {
          payload: { token: token },
        },
      }),
      {}
    )
      .then(([_, response]) => {
        setIsVerified(response.isVerified);
        setMessage(response.message);
      })
      .finally(() => setIsVerifying(false));
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);

    const user = await auth.signinPopup({
      extraQueryParams: {
        prompt: 'select_account',
      },
    });

    const [err, data] = await ServiceErrorManager(
      MakeAdminAndSuperAdmin({
        data: {
          payload: {
            access_token: user.access_token,
            token: token,
          },
        },
      }),
      {}
    );
    dispatch(setUser(data.user));

    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionToken', data.sessionToken);
    }
    router.push('/');
  };

  useEffect(() => {
    verifyToken();
  }, []);

  if (!token) {
    return (
      <Card
        elevate
        size='$4'
        bordered
        animation='bouncy'
        scale={0.9}
        hoverStyle={{ scale: 1 }}
        pressStyle={{ scale: 0.9 }}
        width={400}
        height={250}
        margin='auto'
        marginTop={100}
      >
        <Card.Header padded>
          <H2>Token Error</H2>
        </Card.Header>
        <Card.Footer padded>
          <XStack alignItems='center' space='$2'>
            <MdWarning size={24} color='#f43f5e' />
            <Text color='$red10' fontSize='$5'>
              Token not found
            </Text>
          </XStack>
          <Paragraph marginTop='$2'>
            Please check the link and try again.
          </Paragraph>
        </Card.Footer>
      </Card>
    );
  }

  return (
    <YStack
      width='100%'
      height='100vh'
      alignItems='center'
      justifyContent='center'
      padding='$4'
      space='$4'
      backgroundColor='$background'
    >
      <Card
        //  elevate
        size='$4'
        //  bordered
        animation='bouncy'
        scale={0.9}
        hoverStyle={{ scale: 1 }}
        pressStyle={{ scale: 0.9 }}
        width={400}
        padding='$4'
      >
        <YStack space='$4' alignItems='center'>
          <H6>Account Verification</H6>

          {isVerifying ? (
            <XStack
              space='$2'
              alignItems='center'
              justifyContent='center'
              padding='$4'
            >
              <Spinner size='large' color='$blue10' />
              <Text fontSize='$5'>Verifying token...</Text>
            </XStack>
          ) : isVerified ? (
            <YStack space='$4' alignItems='center'>
              <XStack space='$2' alignItems='center'>
                <MdCheckCircle size={24} color='#10b981' />
                <Text color='$green10' fontSize='$5'>
                  Token verified successfully!
                </Text>
              </XStack>

              <Paragraph textAlign='center'>{message}</Paragraph>

              <Button
                size='$4'
                onPress={handleGoogleLogin}
                disabled={isLoggingIn}
                width='80%'
              >
                {isLoggingIn ? (
                  <XStack space='$2' alignItems='center'>
                    <Spinner size='small' color='white' />
                    <Text color='white'>Logging in...</Text>
                  </XStack>
                ) : (
                  <XStack space='$2' alignItems='center'>
                    <FaGoogle className='text-xl' />
                    <Text>Continue with Google</Text>
                    {/* <Image
                      source={{
                        uri: 'https://developers.google.com/identity/images/g-logo.png',
                      }}
                      width={20}
                      height={20}
                      resizeMode='contain'
                    />
                    <Text color='white'>Continue with Google</Text>
                    <MdLogin size={20} color='white' /> */}
                  </XStack>
                )}
              </Button>
            </YStack>
          ) : (
            <YStack space='$4' alignItems='center'>
              <XStack space='$2' alignItems='center'>
                <MdWarning size={24} color='#f43f5e' />
                <Text color='$red10' fontSize='$5'>
                  Verification failed
                </Text>
              </XStack>

              <Paragraph textAlign='center'>{message}</Paragraph>

              <Button
                size='$4'
                // theme="blue"
                onPress={verifyToken}
                width='80%'
              >
                <XStack space='$2' alignItems='center'>
                  <Text color='white'>Try Again</Text>
                  <MdMail size={20} color='white' />
                </XStack>
              </Button>
            </YStack>
          )}
        </YStack>
      </Card>
    </YStack>
  );
};

export default Regitrations;
