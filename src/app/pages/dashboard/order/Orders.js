import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import Invoice2PDF from './Invoice2PDF';
import Invoice3PDF from './Invoice3PDF';
import { useReactToPrint } from 'react-to-print';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [orders, setOrders] = useState({
    Pending: [],
    OnTheWay: [],
    Delivered: []
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [selectedPDFDesign, setSelectedPDFDesign] = useState('InvoicePDF'); // State for selected PDF design

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_${selectedOrder ? selectedOrder._id : 'Unknown'}`,
  });

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://better-server-blush.vercel.app/orders');
      const fetchedOrders = response.data;

      const sortByUpdatedTime = (a, b) => {
        const dateA = a.updated_time ? new Date(a.updated_time) : new Date(a.timestamp);
        const dateB = b.updated_time ? new Date(b.updated_time) : new Date(b.timestamp);
        return dateB - dateA;
      };

      const classifiedOrders = {
        Pending: fetchedOrders.filter(order => order.status === 'Pending').sort(sortByUpdatedTime),
        OnTheWay: fetchedOrders.filter(order => order.status === 'On the way').sort(sortByUpdatedTime),
        Delivered: fetchedOrders.filter(order => order.status === 'Delivered').sort(sortByUpdatedTime)
      };

      setOrders(classifiedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setNewStatus(order.status);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewStatus('');
  };

  const changeStatus = async () => {
    try {
      await axios.put(`https://better-server-blush.vercel.app/orders/${selectedOrder._id}`, {
        newStatus,
        updated_time: new Date().toISOString()
      });

      await fetchOrders();

      closeModal();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const renderOrders = () => {
    return orders[activeTab].map((order, index) => (
      <tr
        key={order._id}
        className="bg-white cursor-pointer"
        onClick={() => handleRowClick(order)}
      >
        <td className="border px-4 py-2">{index + 1}</td>
        <td className="border px-4 py-2">{order.timestamp}</td>
        <td className="border px-4 py-2">{order._id}</td>
        <td className="border px-4 py-2">{order.name}</td>
        <td className="border px-4 py-2">{order.phone_no}</td>
        <td className="border px-4 py-2">
          {order.products.map(product => (
            <div key={product.product_name}>
              <div>{product.product_name} - ৳ {product.price} x {product.quantity}</div>
            </div>
          ))}
        </td>
        <td className="border px-4 py-2">{order.total_price}</td>
        <td className="border px-4 py-2">{order.address}</td>
        <td className="border px-4 py-2">{order.status}</td>
      </tr>
    ));
  };

  const getTabHeaderColor = (tab) => {
    switch (tab) {
      case 'Pending':
        return 'bg-red-200';
      case 'OnTheWay':
        return 'bg-yellow-200';
      case 'Delivered':
        return 'bg-green-200';
      default:
        return '';
    }
  };

  const renderSelectedPDF = () => {
    switch (selectedPDFDesign) {
      case 'InvoicePDF':
        return <InvoicePDF order={selectedOrder} />;
      case 'Invoice2PDF':
        return <Invoice2PDF order={selectedOrder} />;
      case 'Invoice3PDF':
        return <Invoice3PDF order={selectedOrder} />;
      default:
        return <InvoicePDF order={selectedOrder} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-2xl p-6 border-10 border-black">
        <h1 className="text-4xl font-bold mb-4 text-center">Order Management</h1>
        <div className="flex border-b mb-4">
          <button
            className={`btn btn-outline ${activeTab === 'Pending' ? 'btn-active' : ''} mx-1`}
            onClick={() => setActiveTab('Pending')}
          >
            Pending
          </button>
          <button
            className={`btn btn-outline ${activeTab === 'OnTheWay' ? 'btn-active' : ''} mx-1`}
            onClick={() => setActiveTab('OnTheWay')}
          >
            On the Way
          </button>
          <button
            className={`btn btn-outline ${activeTab === 'Delivered' ? 'btn-active' : ''} mx-1`}
            onClick={() => setActiveTab('Delivered')}
          >
            Delivered
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className={getTabHeaderColor(activeTab)}>
              <tr>
                <th className="py-2 px-4 border">Row</th>
                <th className="py-2 px-4 border">Time & Date</th>
                <th className="py-2 px-4 border">Order ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Phone Number</th>
                <th className="py-2 px-4 border">Product Details</th>
                <th className="py-2 px-4 border">Total</th>
                <th className="py-2 px-4 border">Address</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {renderOrders()}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl w-full">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Time & Date:</strong> {selectedOrder.timestamp}</p>
                <p><strong>Name:</strong> {selectedOrder.name}</p>
                <p><strong>Phone Number:</strong> {selectedOrder.phone_no}</p>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
                <p><strong>status:</strong> {selectedOrder.status}</p>
                <p><strong>Total Price:</strong> {selectedOrder.total_price}</p>
                <p><strong>Products:</strong></p>
                {selectedOrder.products.map(product => (
                  <div key={product.product_name}>
                    <p>{product.product_name} - ৳ {product.price} x {product.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-end">
                {activeTab !== 'Delivered' && (
                  <>
                    <label className="block text-sm font-medium text-gray-700">Change Status:</label>
                    <select
                      className="btn btn-outline mb-2"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="Pending">Pending</option>
                      <option value="On the way">On the Way</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <button
                      className="btn btn-outline mb-2 bg-blue-500 text-white"
                      onClick={changeStatus}
                      disabled={!newStatus}
                    >
                      Update Status
                    </button>
                  </>
                )}
                <label className="block text-sm font-medium text-gray-700">Select PDF Design:</label>
                <select
                  className="btn btn-outline mb-2"
                  value={selectedPDFDesign}
                  onChange={(e) => setSelectedPDFDesign(e.target.value)}
                >
                  <option value="InvoicePDF">Invoice Design 1</option>
                  <option value="Invoice2PDF">Invoice Design 2</option>
                  <option value="Invoice3PDF">Invoice Design 3</option>
                </select>
                <PDFDownloadLink
                  document={renderSelectedPDF()}
                  fileName={`Invoice_${selectedOrder._id}.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <button className="btn btn-outline mb-2">Loading PDF...</button>
                    ) : (
                      <button className="btn btn-outline mb-2 bg-green-500 text-white">Download PDF</button>
                    )
                  }
                </PDFDownloadLink>
                <button
                  className="btn btn-outline bg-blue-500 text-white"
                  onClick={handlePrint}
                >
                  Print Invoice
                </button>
              </div>
            </div>
            <button
              className="btn btn-outline mt-4 bg-red-500 text-white"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div style={{ display: 'none' }}>
          <PDFViewer ref={componentRef}>
            {renderSelectedPDF()}
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

export default Orders;
