import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 4000, orders: 2400 },
  { month: 'Feb', sales: 3000, orders: 1398 },
  { month: 'Mar', sales: 2000, orders: 9800 },
  { month: 'Apr', sales: 2780, orders: 3908 },
];

const Dashboard = () => {
  return (
    <>
      <div className="row mb-4 g-3">
        {[
          { title: 'Total Revenue', value: '$40,000', icon: 'dollar-sign', color: 'primary' },
          { title: 'Total Orders', value: '1,234', icon: 'shopping-cart', color: 'success' },
          { title: 'New Users', value: '156', icon: 'users', color: 'info' },
          { title: 'Conversion Rate', value: '18.5%', icon: 'percentage', color: 'warning' },
        ].map((item, i) => (
          <div key={i} className="col-sm-6 col-lg-3">
            <div className={`card border-start border-${item.color} border-5 shadow`}>
              <div className="card-body d-flex justify-content-between">
                <div>
                  <div className={`text-${item.color} text-uppercase fw-bold small`}>{item.title}</div>
                  <h5>{item.value}</h5>
                </div>
                <i className={`fas fa-${item.icon} fa-2x text-${item.color}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow">
        <div className="card-header fw-bold text-primary">Sales Overview</div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#0d6efd" />
              <Bar dataKey="orders" fill="#198754" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
