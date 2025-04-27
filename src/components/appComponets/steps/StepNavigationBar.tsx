'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Step {
  key: string;
  title: string;
  description?: string;
  icon?: React.JSX.Element;
  content?: React.ReactNode;
}

interface StepNavigationBarProps {
  steps: Step[];
  currentStep: number;
  vertical?: boolean;
  showIcons?: boolean;
  completedIcon?: React.JSX.Element;
  circleSize?: string;
  circleTextSize?: string;
  stepHeight?: string;
  activeColor?: string;
  completedColor?: string;
  inactiveColor?: string;
  connectorColor?: string;
  progressBar?: boolean;
  progressBarIcon?: React.JSX.Element;
  onChangeKey?: (key: string) => void;
}

const StepNavigationBar: React.FC<StepNavigationBarProps> = ({
  steps,
  currentStep,
  vertical = false,
  showIcons = true,
  completedIcon,
  circleSize = 'w-10 h-10',
  circleTextSize = 'text-sm',
  stepHeight = 'h-20',
  activeColor = 'bg-blue-500 border-blue-500 text-white',
  completedColor = 'bg-green-500 border-green-500 text-white',
  inactiveColor = 'bg-gray-300 border-gray-300 text-gray-700',
  connectorColor = 'bg-gray-300',
  progressBar = false,
  progressBarIcon,
  onChangeKey,
}) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  React.useEffect(() => {
    if (onChangeKey && steps[currentStep]) {
      onChangeKey(steps[currentStep].key);
    }
  }, [currentStep, steps, onChangeKey]);

  return (
    <div className='w-full'>
      {progressBar && (
        <div className='w-full bg-gray-300 rounded-full h-2 mb-4 relative'>
          <div
            className='bg-green-500 h-2 rounded-full transition-all relative'
            style={{ width: `${progress}%` }}
          >
            <div className='absolute -right-2 -top-1 bg-green-500 rounded-full p-1'>
              {progressBarIcon}
            </div>
          </div>
        </div>
      )}

      <div className='flex w-full'>
        <div
          className={twMerge(
            vertical
              ? 'flex flex-col space-y-4 w-1/3'
              : 'flex flex-col sm:flex-row space-y-4 sm:space-y-0 w-1/3'
          )}
        >
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={twMerge(
                'flex items-center space-x-4',
                vertical ? 'w-full' : ''
              )}
            >
              <div
                className={twMerge(
                  'flex flex-col items-center sm:items-start text-center sm:text-left space-y-2',
                  stepHeight
                )}
              >
                <div className='flex items-center space-x-2'>
                  <div
                    className={twMerge(
                      'flex items-center justify-center rounded-full border-2 font-semibold transition-all',
                      circleSize,
                      circleTextSize,
                      index < currentStep
                        ? completedColor
                        : index === currentStep
                        ? activeColor
                        : inactiveColor
                    )}
                  >
                    {showIcons && index < currentStep
                      ? completedIcon || step.icon
                      : step.icon || index + 1}
                  </div>
                  <span className='font-semibold'>{step.title}</span>
                </div>
                {step.description && (
                  <p className='text-gray-500'>{step.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className='w-2/3 pl-8'>{steps[currentStep].content}</div>
      </div>
    </div>
  );
};

export default StepNavigationBar;
