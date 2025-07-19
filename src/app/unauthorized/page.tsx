'use client';

import { YStack, Paragraph, AnimatePresence, H4, View } from 'tamagui';
import { FiLock } from 'react-icons/fi';

const Unauthorized = () => {
  return (
    <View flex={1} height='100vh'>
      <YStack
        flex={1}
        alignItems='center'
        justifyContent='center'
        paddingVertical='$8'
        paddingHorizontal='$4'
        space='$6'
        backgroundColor='$background'
      >
        <YStack
          width={100}
          height={100}
          backgroundColor='$backgroundHover'
          alignItems='center'
          justifyContent='center'
          enterStyle={{
            scale: 0.5,
            opacity: 0,
            y: -20,
          }}
        >
          <FiLock size={48} />
        </YStack>

        <YStack space='$4' alignItems='center'>
          <H4 textAlign='center' fontWeight='bold' color='$color'>
            Access Denied
          </H4>

          <Paragraph
            size='$5'
            textAlign='center'
            color='$colorHover'
            marginTop='$2'
          >
            You don't have permission to access this page. Please sign in with
            the appropriate credentials or contact your administrator.
          </Paragraph>
        </YStack>

        <AnimatePresence>
          {/* {true && (
          <Card
            enterStyle={{
              opacity: 0,
              y: 10,
              scale: 0.9,
            }}
            exitStyle={{
              opacity: 0,
              y: 10,
              scale: 0.9,
            }}
            bordered
            elevate
            size='$4'
            width='100%'
            maxWidth={550}
            paddingHorizontal='$4'
            paddingVertical='$4'
          >
            <YStack space='$2'>
              <H3 fontWeight='bold'>Common Issues:</H3>
              <Paragraph>• Your session may have expired</Paragraph>
              <Paragraph>• You might need different permissions</Paragraph>
              <Paragraph>• You need to complete account verification</Paragraph>

              <XStack marginTop='$2' space='$2' alignItems='center'>
                <FiAlertTriangle size={18} />
                <Paragraph size='$3' color='$orange10'>
                  If you believe this is a mistake, contact support at
                  support@example.com
                </Paragraph>
              </XStack>
            </YStack>
          </Card>
        )} */}
        </AnimatePresence>
      </YStack>
    </View>
  );
};

export default Unauthorized;
