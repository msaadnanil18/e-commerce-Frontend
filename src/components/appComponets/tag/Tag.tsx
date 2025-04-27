'use client';

import React from 'react';
import {
  XStack,
  Text,
  styled,
  GetProps,
  createStyledContext,
  TextProps,
  Stack,
} from 'tamagui';

export type TagColorScheme =
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'
  | 'purple'
  | 'gray'
  | 'orange'
  | 'teal';

const TagContext = createStyledContext<{
  colorScheme: TagColorScheme;
}>({
  colorScheme: 'blue',
});

const TagFrame = styled(XStack, {
  name: 'Tag',
  context: TagContext,
  borderRadius: '$4',
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$backgroundStrong',

  variants: {
    colorScheme: {
      blue: {
        backgroundColor: '$blue4',
      },
      green: {
        backgroundColor: '$green4',
      },
      red: {
        backgroundColor: '$red4',
      },
      yellow: {
        backgroundColor: '$yellow4',
      },
      purple: {
        backgroundColor: '$purple4',
      },
      gray: {
        backgroundColor: '$gray4',
      },
      orange: {
        backgroundColor: '$orange4',
      },
      teal: {
        backgroundColor: '$teal4',
      },
    },
    size: {
      small: {
        height: '$2',
        paddingHorizontal: '$1.5',
      },
      medium: {
        height: '$3',
        paddingHorizontal: '$2',
      },
      large: {
        height: '$4',
        paddingHorizontal: '$3',
      },
    },
  } as const,

  defaultVariants: {
    colorScheme: 'blue',
    size: 'medium',
  },
});

const TagText = styled(Text, {
  name: 'TagText',
  context: TagContext,
  fontSize: '$2',
  fontWeight: '500',

  variants: {
    colorScheme: {
      blue: {
        color: '$blue11',
      },
      green: {
        color: '$green11',
      },
      red: {
        color: '$red11',
      },
      yellow: {
        color: '$yellow11',
      },
      purple: {
        color: '$purple11',
      },
      gray: {
        color: '$gray11',
      },
      orange: {
        color: '$orange11',
      },
      teal: {
        color: '$teal11',
      },
    },
    size: {
      small: {
        fontSize: '$1',
      },
      medium: {
        fontSize: '$2',
      },
      large: {
        fontSize: '$3',
      },
    },
  } as const,
});

const IconContainer = styled(Stack, {
  name: 'TagIconContainer',
  context: TagContext,
  marginRight: '$1',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    size: {
      small: {
        width: '$1',
        height: '$1',
      },
      medium: {
        width: '$2',
        height: '$2',
      },
      large: {
        width: '$3',
        height: '$3',
      },
    },
    colorScheme: {
      blue: {
        color: '$blue11',
      },
      green: {
        color: '$green11',
      },
      red: {
        color: '$red11',
      },
      yellow: {
        color: '$yellow11',
      },
      purple: {
        color: '$purple11',
      },
      gray: {
        color: '$gray11',
      },
      orange: {
        color: '$orange11',
      },
      teal: {
        color: '$teal11',
      },
    },
  } as const,
});

type TagProps = GetProps<typeof TagFrame> & {
  children: React.ReactNode;
  textProps?: TextProps;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

export const Tag = ({
  children,
  textProps,
  icon,
  iconPosition = 'left',
  ...props
}: TagProps) => {
  return (
    <TagFrame {...props}>
      {icon && iconPosition === 'left' && (
        <IconContainer
          style={props.style}
          className={props.className}
          size={props.size}
          colorScheme={props.colorScheme}
        >
          {icon}
        </IconContainer>
      )}
      <TagText {...textProps}>{children}</TagText>
      {icon && iconPosition === 'right' && (
        <IconContainer
          size={props.size}
          colorScheme={props.colorScheme}
          marginRight='$0'
          marginLeft='$1'
        >
          {icon}
        </IconContainer>
      )}
    </TagFrame>
  );
};

export const TagGroup = styled(XStack, {
  name: 'TagGroup',
  flexWrap: 'wrap',
  gap: '$1',
});
