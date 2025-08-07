import { useDarkMode } from '@/hook/useDarkMode';
import React, { useState } from 'react';
import type { ReactNode } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: TooltipPosition;
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = 'bottom',
}) => {
  const isDark = useDarkMode();
  const [visible, setVisible] = useState(false);

  const positionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  const arrowPosition: Record<TooltipPosition, string> = {
    top: 'before:top-full before:left-1/2 before:-translate-x-1/2',
    bottom: 'before:bottom-full before:left-1/2 before:-translate-x-1/2',
    left: 'before:left-full before:top-1/2 before:-translate-y-1/2',
    right: 'before:right-full before:top-1/2 before:-translate-y-1/2',
  };

  const arrowDirection: Record<TooltipPosition, string> = {
    top: 'before:border-t-[rgba(0,0,0,0.7)]',
    bottom: 'before:border-b-[rgba(0,0,0,0.7)]',
    left: 'before:border-l-[rgba(0,0,0,0.7)]',
    right: 'before:border-r-[rgba(0,0,0,0.7)]',
  };

  const sharedArrowStyles =
    "before:content-[''] before:absolute before:border-4 before:border-transparent before:opacity-80";

  return (
    <div
      className='z-[50] relative flex items-center font-sans'
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`
            absolute
            ${positionClasses[position]}
            transition-opacity duration-200
            whitespace-nowrap
            ${
              isDark
                ? ' bg-white text-[rgba(0,0,0,0.7)]'
                : 'bg-[rgba(0,0,0,0.7)] text-white'
            }
             text-xs py-1 px-2 rounded-md shadow-md
            ${sharedArrowStyles}
            ${arrowPosition[position]}
            ${arrowDirection[position]}
          `}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
