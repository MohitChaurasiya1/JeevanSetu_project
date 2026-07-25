import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
