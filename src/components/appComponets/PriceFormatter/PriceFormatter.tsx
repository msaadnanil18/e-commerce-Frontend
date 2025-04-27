'use client';
import React from 'react';

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'JPY'
  | 'CNY'
  | 'CAD'
  | 'AUD'
  | 'BRL'
  | 'RUB'
  | 'SGD'
  | 'ZAR';

interface PriceFormatterProps {
  value: number;
  currency?: CurrencyCode;
  locale?: string;
  className?: string;
  crossed?: boolean;
  crossedClassName?: string;
}

const PriceFormatter: React.FC<PriceFormatterProps> = ({
  value,
  currency = 'INR',
  locale,
  className = '',
  crossed = false,
  crossedClassName = '',
}) => {
  const getCurrencyLocale = (): string => {
    if (locale) return locale;

    const localeMap: Record<CurrencyCode, string> = {
      USD: 'en-US',
      EUR: 'de-DE',
      GBP: 'en-GB',
      INR: 'en-IN',
      JPY: 'ja-JP',
      CNY: 'zh-CN',
      CAD: 'en-CA',
      AUD: 'en-AU',
      BRL: 'pt-BR',
      RUB: 'ru-RU',
      SGD: 'en-SG',
      ZAR: 'en-ZA',
    };

    return localeMap[currency] || 'en-US';
  };

  const formatter = new Intl.NumberFormat(getCurrencyLocale(), {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const displayPrice = formatter.format(value);

  const defaultCrossedStyles = crossed
    ? {
        textDecoration: 'line-through',
        color: '#888',
        position: 'relative' as const,
      }
    : {};

  const crossStyles = crossed ? defaultCrossedStyles : {};

  const combinedClassName = `${className} ${
    crossed && crossedClassName ? crossedClassName : ''
  }`.trim();

  return (
    <span className={combinedClassName} style={crossStyles}>
      {displayPrice}
    </span>
  );
};

export default PriceFormatter;
