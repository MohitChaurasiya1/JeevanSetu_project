import React from 'react';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
