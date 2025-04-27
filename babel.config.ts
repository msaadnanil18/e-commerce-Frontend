import type { TransformOptions } from '@babel/core';

const config: TransformOptions = {
  presets: ['next/babel'],
  plugins: ['babel-plugin-transform-inline-environment-variables'],
};

export default config;
