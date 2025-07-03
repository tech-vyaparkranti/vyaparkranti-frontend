import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: 'fa-home' },
    { to: '/users', label: 'Users', icon: 'fa-users' },
    { to: '/orders', label: 'Orders', icon: 'fa-shopping-cart' },
    { to: '/products', label: 'Products', icon: 'fa-box' },
    { to: '/analytics', label: 'Analytics', icon: 'fa-chart-bar' },
    { to: '/settings', label: 'Settings', icon: 'fa-cog' },
  ];

  return (
    <div className="bg-dark text-white position-fixed top-0 start-0 h-100 p-3" style={{ width: '250px', zIndex: 1050 }}>
      <h4 className="mb-3"><i className="fas fa-chart-line me-2"></i>Dashboard</h4>
      <nav className="nav flex-column">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'bg-primary' : ''}`
            }
          >
            <i className={`fas ${icon} me-2`}></i>{label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
