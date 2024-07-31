import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sales = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch the sold items from the backend
    const fetchSoldItems = async () => {
      try {
        const response = await axios.get('http://localhost:500/solditems');
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sold items:", error);
      }
    };

    fetchSoldItems();
  }, []);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Sales</h1>
      <div className="overflow-x-auto w-full">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-center">Product ID</th>
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-4 py-2 text-center">Price</th>
              <th className="border px-4 py-2 text-center">Quantity</th>
              <th className="border px-4 py-2 text-center">Cost Per Unit</th>
              <th className="border px-4 py-2 text-center">Stored Price</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((item) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-center">{item.productId}</td>
                <td className="border px-4 py-2 text-center">{item.name}</td>
                <td className="border px-4 py-2 text-center">{item.price}</td>
                <td className="border px-4 py-2 text-center">{item.quantity}</td>
                <td className="border px-4 py-2 text-center">{item.costPerUnit}</td>
                <td className="border px-4 py-2 text-center">{item.storePrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
