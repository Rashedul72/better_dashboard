import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCoupon = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [coupons, setCoupons] = useState([]);

  // Function to fetch coupons
  const fetchCoupons = async () => {
    try {
      const response = await axios.get('https://better-server-blush.vercel.app/coupons');
      setCoupons(response.data); // Assuming the API returns an array of coupons
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  useEffect(() => {
    fetchCoupons(); // Fetch coupons on component mount
  }, []); // Empty dependency array means this effect runs once after the initial render

  // Function to handle coupon deletion
  const handleDeleteCoupon = async (couponId) => {
    try {
      const response = await axios.delete(`https://better-server-blush.vercel.app/deletecoupon/${couponId}`);
      setMessage(response.data.message);
      fetchCoupons(); // Refresh coupons after deletion
    } catch (error) {
      setMessage('Error deleting coupon: ' + error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://better-server-blush.vercel.app/addcoupon', { code });
      setMessage(response.data.message);
      fetchCoupons(); // Refresh coupons after adding new coupon
      setCode(''); // Clear input after submission
    } catch (error) {
      setMessage('Error creating coupon: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Add Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Coupon Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
        >
          Add Coupon
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
      
      <div className="mt-8">
        <h2 className="text-xl mb-4">Existing Coupons</h2>
        <ul className="space-y-2">
          {coupons.map(coupon => (
            <li key={coupon._id} className="flex items-center justify-between bg-gray-100 rounded-md p-3">
              <span>{coupon.code}</span>
              <button
                onClick={() => handleDeleteCoupon(coupon._id)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddCoupon;
