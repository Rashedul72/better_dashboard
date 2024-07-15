import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaChartLine, FaMoneyBillWave, FaUserFriends, FaPercentage } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components with Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Sales',
      data: [5000, 3000, 4000, 7000, 2000, 10000],
      fill: false,
      backgroundColor: 'rgba(66, 153, 225, 0.6)',
      borderColor: 'rgba(66, 153, 225, 1)',
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
};

const PanicOverview = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://better-server-blush.vercel.app/orders');
        const fetchedOrders = response.data;

        const total = fetchedOrders.reduce((sum, order) => sum + parseFloat(order.total_price || '0'), 0);
        setTotalSales(total);

        // Calculate total units sold for each product
        const productSales = {};
        fetchedOrders.forEach(order => {
          order.items.forEach(item => {
            if (productSales[item.name]) {
              productSales[item.name] += item.quantity;
            } else {
              productSales[item.name] = item.quantity;
            }
          });
        });

        // Sort products by total units sold and get top 5
        const sortedProducts = Object.keys(productSales)
          .map(product => ({
            name: product,
            totalSales: productSales[product],
          }))
          .sort((a, b) => b.totalSales - a.totalSales)
          .slice(0, 5);

        setTopProducts(sortedProducts);

      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="overview-container p-4 bg-base-200">
      <div className="overview-tabs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="overview-tab flex items-center p-4 bg-white rounded-lg shadow-md">
          <FaDollarSign className="overview-icon text-primary text-2xl mr-4" />
          <div className="overview-text">
            <h3 className="tab-title text-lg font-semibold">Total Sales</h3>
            <p className="tab-value text-2xl font-bold">৳{totalSales}</p>
          </div>
        </div>
        <div className="overview-tab flex items-center p-4 bg-white rounded-lg shadow-md">
          <FaChartLine className="overview-icon text-success text-2xl mr-4" />
          <div className="overview-text">
            <h3 className="tab-title text-lg font-semibold">Profit</h3>
            <p className="tab-value text-2xl font-bold">৳4,000</p>
          </div>
        </div>
        <div className="overview-tab flex items-center p-4 bg-white rounded-lg shadow-md">
          <FaMoneyBillWave className="overview-icon text-error text-2xl mr-4" />
          <div className="overview-text">
            <h3 className="tab-title text-lg font-semibold">Expenses</h3>
            <p className="tab-value text-2xl font-bold">৳6,000</p>
          </div>
        </div>
        <div className="overview-tab flex items-center p-4 bg-white rounded-lg shadow-md">
          <FaUserFriends className="overview-icon text-purple-500 text-2xl mr-4" />
          <div className="overview-text">
            <h3 className="tab-title text-lg font-semibold">Total Visitor</h3>
            <p className="tab-value text-2xl font-bold">8,000</p>
          </div>
        </div>
        <div className="overview-tab flex items-center p-4 bg-white rounded-lg shadow-md">
          <FaPercentage className="overview-icon text-warning text-2xl mr-4" />
          <div className="overview-text">
            <h3 className="tab-title text-lg font-semibold">Conversion</h3>
            <p className="tab-value text-2xl font-bold">5%</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between mt-4 gap-4">
        <div className="graph-container bg-white rounded-lg shadow-md p-4 w-full lg:w-3/5">
          <h3 className="tab-title text-lg font-semibold mb-2">Sales Statistics</h3>
          <div className="chart-container" style={{ width: '100%', height: '300px' }}>
            <Line data={data} options={options} />
          </div>
        </div>
        <div className="product-container bg-white rounded-lg shadow-md p-4 w-full lg:w-2/5">
          <h3 className="tab-title text-lg font-semibold mb-2 text-center">Most Selling Products Of The Month</h3>
          {topProducts.map((product, index) => (
            <div key={index} className="product-item flex justify-between py-2 border-b">
              <div className="product-name font-medium">{product.name}</div>
              <div className="product-sales">Total Sales: {product.totalSales}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PanicOverview;
