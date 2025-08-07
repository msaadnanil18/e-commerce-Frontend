import { FiEdit3 } from 'react-icons/fi';
import type { TooltipProps } from 'tamagui';
import {
  Button,
  Paragraph,
  Tooltip,
  TooltipGroup,
  XStack,
  YStack,
} from 'tamagui';

export function TooltipDemo() {
  return (
    <TooltipGroup delay={{ open: 3000, close: 100 }}>
      <YStack gap='$2' alignSelf='center'>
        <XStack gap='$2'>
          <Demo groupId='0' placement='top-end' Icon={FiEdit3} />
          <Demo groupId='1' placement='top' Icon={FiEdit3} />
          <Demo groupId='2' placement='top-start' Icon={FiEdit3} />
        </XStack>
        <XStack gap='$2'>
          <Demo groupId='3' placement='left' Icon={FiEdit3} />
          <YStack flex={1} />
          <Demo groupId='4' placement='right' Icon={FiEdit3} />
        </XStack>
        <XStack gap='$2'>
          <Demo groupId='5' placement='bottom-end' Icon={FiEdit3} />
          <Demo groupId='6' placement='bottom' Icon={FiEdit3} />
          <Demo groupId='7' placement='bottom-start' Icon={FiEdit3} />
        </XStack>
      </YStack>
    </TooltipGroup>
  );
}

function Demo({ Icon, ...props }: TooltipProps & { Icon?: any }) {
  return (
    <Tooltip {...props}>
      <Tooltip.Trigger>
        <Button icon={Icon} circular />
      </Tooltip.Trigger>
      <Tooltip.Content
        enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        scale={1}
        x={0}
        y={0}
        opacity={1}
        py='$2'
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Tooltip.Arrow />
        <Paragraph size='$2' lineHeight='$1'>
          Hello world
        </Paragraph>
      </Tooltip.Content>
    </Tooltip>
  );
}
