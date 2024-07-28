import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardOverview = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalDelivered, setTotalDelivered] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total products
        const productsResponse = await axios.get('https://better-server-blush.vercel.app/products');
        setTotalProducts(productsResponse.data.length);
  
        // Fetch total categories
        const categoriesResponse = await axios.get('https://better-server-blush.vercel.app/categories');
        setTotalCategories(categoriesResponse.data.length);
  
        // Fetch orders
        const ordersResponse = await axios.get('https://better-server-blush.vercel.app/orders');

        // Calculate total pending and delivered orders
        let pendingCount = 0;
        let deliveredCount = 0;

        ordersResponse.data.forEach(order => {
          if (order.status === 'Pending') {
            pendingCount++;
          } else if (order.status === 'Delivered') {
            deliveredCount++;
          }
        });

        setTotalPending(pendingCount);
        setTotalDelivered(deliveredCount);
  
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-3xl font-bold text-center">Employee Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <div className="card p-6 shadow-lg border border-gray-200 bg-white text-black rounded-lg">
          <h2 className="text-2xl font-bold">Total Products</h2>
          <p className="text-4xl">{totalProducts}</p>
        </div>
    
        <div className="card p-6 shadow-lg border border-gray-200 bg-white text-black rounded-lg">
          <h2 className="text-2xl font-bold">Total Categories</h2>
          <p className="text-4xl">{totalCategories}</p>
        </div>

        <div className="card p-6 shadow-lg border border-gray-200 bg-white text-black rounded-lg">
          <h2 className="text-2xl font-bold">Orders Pending</h2>
          <p className="text-4xl">{totalPending}</p>
        </div>

        <div className="card p-6 shadow-lg border border-gray-200 bg-white text-black rounded-lg">
          <h2 className="text-2xl font-bold">Orders Completed</h2>
          <p className="text-4xl">{totalDelivered}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
