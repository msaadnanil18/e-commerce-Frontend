'use client';

import React from 'react';
import './loading.css';

const Loading: React.FC = () => {
  // const mode = localStorage.getItem('fallBackLoddingMode');
  return (
    <div className={`grid place-content-center h-screen`}>
      <div className='loaders' />
    </div>
  );
};

export default Loading;
