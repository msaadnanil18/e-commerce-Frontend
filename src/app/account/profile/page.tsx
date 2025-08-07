import Profile from '@/components/customers/profile/indext';
import Navbar from '@/components/navbar';
import React from 'react';

const UserProfilePage = () => {
  return (
    <div className='page-container'>
      <div className='navbar'>
        <Navbar />
      </div>

      <Profile />
    </div>
  );
};

export default UserProfilePage;
