'use client';

import React from 'react';
import './loading.css';

const Loading: React.FC = () => {
  const mode =
    typeof window !== 'undefined'
      ? (localStorage.getItem('theme') as 'LIGHT' | 'DARK')
      : 'LIGHT';

  return (
    <div
      style={mode === 'DARK' ? { backgroundColor: '#0d0c0c' } : {}}
      className={`grid place-content-center h-screen`}
    >
      <div className='loaders' />
    </div>
  );
};

export default Loading;
