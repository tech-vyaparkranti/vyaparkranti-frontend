import React from 'react';

const recentOrders = [
  { id: '#12345', customer: 'John Doe', product: 'Laptop', amount: '$1,200', status: 'Completed' },
  { id: '#12346', customer: 'Jane Smith', product: 'Phone', amount: '$800', status: 'Pending' },
  { id: '#12347', customer: 'Bob Johnson', product: 'Tablet', amount: '$500', status: 'Cancelled' },
  { id: '#12348', customer: 'Alice Brown', product: 'Headphones', amount: '$150', status: 'Completed' },
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'Completed': return 'bg-success';
    case 'Pending': return 'bg-warning';
    case 'Cancelled': return 'bg-danger';
    default: return 'bg-secondary';
  }
};

const Users = () => {
  return (
    <div className="card shadow">
      <div className="card-header fw-bold text-primary">Recent Orders</div>
      <div className="card-body table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>{order.amount}</td>
                <td>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
