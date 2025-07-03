import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const Dashboard = () => {
  return (
     <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '250px' }}>
        <nav className="navbar navbar-light bg-white border-bottom px-3">
          <span className="navbar-brand mb-0 h1">Admin Panel</span>
        </nav>
        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
