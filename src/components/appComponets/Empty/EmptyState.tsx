import React from 'react';
import { YStack, Text, Button, Theme } from 'tamagui';

interface EmptyStateProps {
  icon?: React.ReactNode;

  title: string;

  description?: string;

  actionButton?: React.ReactNode;

  secondaryActionButton?: React.ReactNode;

  children?: React.ReactNode;

  themeColor?: string;

  image?: React.ReactNode;

  size?: 'sm' | 'md' | 'lg';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionButton,
  secondaryActionButton,
  children,
  themeColor = 'gray',
  image,
  size = 'md',
}) => {
  const getSpacing = () => {
    switch (size) {
      case 'sm':
        return { iconSize: '$6', gap: '$2' };
      case 'lg':
        return { iconSize: '$10', gap: '$6' };
      default:
        return { iconSize: '$8', gap: '$4' };
    }
  };

  const { iconSize, gap } = getSpacing();

  return (
    <Theme name={themeColor as any}>
      <YStack
        alignItems='center'
        justifyContent='center'
        space={gap}
        paddingVertical='$6'
        width='100%'
      >
        {image ? (
          <YStack>{image}</YStack>
        ) : icon ? (
          <YStack
            width={iconSize}
            height={iconSize}
            alignItems='center'
            justifyContent='center'
            opacity={0.7}
          >
            {icon}
          </YStack>
        ) : null}

        <YStack space='$1' alignItems='center' maxWidth={500}>
          <Text
            fontSize={size === 'sm' ? '$5' : size === 'lg' ? '$8' : '$6'}
            fontWeight='bold'
            textAlign='center'
          >
            {title}
          </Text>

          {description && (
            <Text
              fontSize={size === 'sm' ? '$2' : size === 'lg' ? '$4' : '$3'}
              color='$colorHover'
              textAlign='center'
              paddingHorizontal='$4'
            >
              {description}
            </Text>
          )}
        </YStack>

        {children}

        {(actionButton || secondaryActionButton) && (
          <YStack
            space='$2'
            marginTop={size === 'sm' ? '$2' : '$4'}
            alignItems='center'
          >
            {actionButton}
            {secondaryActionButton}
          </YStack>
        )}
      </YStack>
    </Theme>
  );
};

export const createEmptyStateVariant = (
  defaultProps: Partial<EmptyStateProps>
) => {
  return (props: EmptyStateProps) => (
    <EmptyState {...defaultProps} {...props} />
  );
};

export const NoResultsEmptyState = createEmptyStateVariant({
  title: 'No results found',
  description:
    "Try adjusting your search or filters to find what you're looking for.",
  themeColor: 'blue',
});

export const NoDataEmptyState = createEmptyStateVariant({
  title: 'No data available',
  description: 'There is no data to display at this time.',
  themeColor: 'gray',
});

export const ErrorEmptyState = createEmptyStateVariant({
  title: 'Something went wrong',
  description:
    'We encountered an error while loading this data. Please try again later.',
  themeColor: 'red',
});

export default EmptyState;
