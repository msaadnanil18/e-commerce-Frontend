'use client';
import { debounce } from 'lodash-es';
import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  FaAngleDown,
  FaAngleUp,
  FaCheck,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';
import {
  Select,
  Adapt,
  Sheet,
  YStack,
  Spinner,
  Input,
  XStack,
  Text,
  SelectProps,
  View,
  Button,
} from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

interface SelectOption {
  label: string;
  value: string;
}

interface AsyncSelectProps {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  width?: string | number;
  marginBottom?: string | number;
  options?: SelectOption[];
  loadOptions?: (searchQuery: string) => Promise<SelectOption[]>;
  isAsync?: boolean;
  label?: string;
  noOptionsMessage?: string;
  loadingMessage?: string;
  groupLabel?: string;
  size?: string;
  native?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  debounceMs?: number;
  selectProps?: SelectProps;
  loading?: boolean;
  menuChildren?: FC<any>;
  footerChildren?: FC<any>;
  allowCancel?: boolean;
}

const AsyncSelect: FC<AsyncSelectProps> = ({
  id,
  placeholder = 'Select an option',
  value,
  onChange,
  size,
  width = '100%',
  marginBottom = '$3',
  options: initialOptions = [],
  loadOptions,
  isAsync = false,
  label,
  noOptionsMessage = 'No options available',
  loadingMessage = 'Loading options...',
  groupLabel = 'Options',
  native = false,
  disabled = false,
  searchable = false,
  debounceMs = 300,
  selectProps,
  loading = false,
  menuChildren: MenuChildren,
  footerChildren: FooterChildren,
  allowCancel = false,
}) => {
  const [position, setPosition] = useState(0);
  const [selectedValue, setSelectedValue] = useState<string>(value || '');
  const [options, setOptions] = useState<SelectOption[]>(initialOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (isAsync && loadOptions) {
        setIsLoading(true);
        try {
          const results = await loadOptions(query);
          setOptions(results);
        } catch (error) {
          console.error('Error loading options:', error);
          setOptions([]);
        } finally {
          setIsLoading(false);
        }
      }
    }, debounceMs),
    [loadOptions, isAsync, debounceMs]
  );

  useEffect(() => {
    if (isAsync && loadOptions && !searchQuery) {
      setIsLoading(true);
      loadOptions('')
        .then((results) => {
          setOptions(results);
        })
        .catch((error) => {
          console.error('Error loading initial options:', error);
          setOptions([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAsync, loadOptions]);

  useEffect(() => {
    if (!isAsync) {
      setOptions(initialOptions);
    }
  }, [initialOptions, isAsync]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const getSelectedLabel = () => {
    const selected = options.find((opt) => opt.value === selectedValue);
    return selected ? selected.label : placeholder;
  };

  if (disabled) {
    return null;
  }

  const reload = async () => {
    if (isAsync && loadOptions) {
      setIsLoading(true);
      loadOptions('')
        .then((results) => {
          setOptions(results);
        })
        .catch((error) => {
          console.error('Error loading initial options:', error);
          setOptions([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <YStack marginBottom={marginBottom} width={width}>
      {label && (
        <Text marginBottom='$1' fontWeight='500'>
          {label}
        </Text>
      )}

      <Select
        id={id || 'async-select'}
        value={selectedValue}
        onValueChange={handleValueChange}
        disablePreventBodyScroll
        size={size}
        {...selectProps}
      >
        {allowCancel && selectedValue ? (
          <XStack flex={1} minWidth={200} maxWidth={400} position='relative'>
            <Select.Trigger
              width={width}
              iconAfter={loading ? <Spinner /> : <FaAngleDown />}
              disabled={disabled}
            >
              <Select.Value placeholder={placeholder}>
                {getSelectedLabel()}
              </Select.Value>
            </Select.Trigger>
            <XStack marginTop='$2' marginLeft='$1'>
              <Button
                size='$1'
                circular
                chromeless
                onPress={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSelectedValue('');
                  onChange('');
                  return false;
                }}
                zIndex={20}
                hitSlop={10}
              >
                <FaTimes size={14} />
              </Button>
            </XStack>
          </XStack>
        ) : (
          <Select.Trigger
            width={width}
            iconAfter={loading ? <Spinner /> : <FaAngleDown />}
            disabled={disabled}
          >
            <Select.Value placeholder={placeholder}>
              {getSelectedLabel()}
            </Select.Value>
          </Select.Trigger>
        )}

        <Adapt platform='touch'>
          <Sheet
            native={!!native}
            modal
            dismissOnSnapToBottom
            snapPoints={[50]}
            position={position}
            onPositionChange={setPosition}
            zIndex={100000}
          >
            <Sheet.Frame>
              {searchable && (
                <XStack padding='$2' alignItems='center'>
                  <Input
                    flex={1}
                    size='$3'
                    placeholder='Search...'
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    autoCapitalize='none'
                    //@ts-ignore
                    leftIconAfter={<FaSearch size={16} color='$gray10' />}
                  />
                </XStack>
              )}
              <Sheet.ScrollView scrollbarWidth='thin'>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
              backgroundColor='$color.shadowColor'
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems='center'
            justifyContent='center'
            position='relative'
            width='100%'
            height='$3'
          >
            <YStack zIndex={10}>
              <FaAngleUp size={16} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['$background', 'transparent']}
              borderRadius='$4'
            />
          </Select.ScrollUpButton>

          <Select.Viewport minWidth={200}>
            {searchable && !native && (
              <XStack
                padding='$2'
                borderBottomWidth={1}
                borderBottomColor='$borderColor'
              >
                <Input
                  flex={1}
                  size={'$3'}
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.nativeEvent.text)}
                  autoCapitalize='none'
                  //@ts-ignore
                  leftIconAfter={<FaSearch size={16} color='$gray10' />}
                />
              </XStack>
            )}

            {isLoading ? (
              <YStack padding='$4' alignItems='center' justifyContent='center'>
                <Spinner size='small' />
                <Text marginTop='$2'>{loadingMessage}</Text>
              </YStack>
            ) : options.length === 0 ? (
              <YStack padding='$4' alignItems='center' justifyContent='center'>
                <Text>{noOptionsMessage}</Text>
              </YStack>
            ) : (
              <Select.Group>
                <Select.Label>{groupLabel}</Select.Label>
                {options.map((option, index) => (
                  <Select.Item
                    index={index}
                    key={option.value}
                    value={option.value}
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator marginLeft='auto'>
                      <FaCheck size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
            )}

            {!isLoading && MenuChildren ? (
              <div className=' m-3 grid place-content-end'>
                <MenuChildren {...{ reload }} />
              </div>
            ) : null}
          </Select.Viewport>

          {FooterChildren && (
            <View
              position='absolute'
              bottom={0}
              right={0}
              padding='$3'
              marginLeft='$2'
              backgroundColor='$background'
              borderTopWidth={1}
              borderTopColor='$borderColor'
            >
              <FooterChildren {...{ reload }} />
            </View>
          )}

          <Select.ScrollDownButton
            alignItems='center'
            justifyContent='center'
            position='relative'
            width='100%'
            height='$3'
          >
            <YStack zIndex={10}>
              <FaAngleDown size={16} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['transparent', '$background']}
              borderRadius='$4'
            />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    </YStack>
  );
};

export default AsyncSelect;
