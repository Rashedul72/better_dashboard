import React from 'react';
import { FaTachometerAlt, FaChartLine, FaMoneyBillWave, FaFileInvoiceDollar, FaClipboardList, FaBoxes, FaBoxOpen } from 'react-icons/fa';

const PanicSidebar = ({ onItemClick }) => {
  return (
    <div className="sidebar bg-base-200 h-full p-4">
      <h2 className="sidebar-heading text-primary text-2xl font-bold mb-4">Dashboard</h2>
      <ul className="sidebar-menu space-y-2">
        <li>
          <button className="sidebar-button w-full flex items-center p-2 rounded-lg hover:bg-primary hover:text-white" onClick={() => onItemClick('overview')}>
            <FaTachometerAlt className="sidebar-icon text-xl mr-3" />
            <span className="sidebar-text font-medium">Dashboard</span>
          </button>
        </li>
        <li>
          <button className="sidebar-button w-full flex items-center p-2 rounded-lg hover:bg-primary hover:text-white" onClick={() => onItemClick('product')}>
            <FaBoxOpen className="sidebar-icon text-xl mr-3" />
            <span className="sidebar-text font-medium">Products</span>
          </button>
        </li>
        <li className="sidebar-section mt-4">
          <h3 className="sidebar-section-heading text-primary text-lg font-semibold mb-2">Sales</h3>
          <ul className="sidebar-submenu space-y-2">
            <li>
              <button className="sidebar-button w-full flex items-center p-2 rounded-lg hover:bg-primary hover:text-white" onClick={() => onItemClick('sales')}>
                <FaChartLine className="sidebar-icon text-xl mr-3" />
                <span className="sidebar-text font-medium">Sales</span>
              </button>
            </li>
            <li>
              <button className="sidebar-button w-full flex items-center p-2 rounded-lg hover:bg-primary hover:text-white" onClick={() => onItemClick('expense')}>
                <FaMoneyBillWave className="sidebar-icon text-xl mr-3" />
                <span className="sidebar-text font-medium">Expense</span>
              </button>
            </li>
            <li>
              <button className="sidebar-button w-full flex items-center p-2 rounded-lg hover:bg-primary hover:text-white" onClick={() => onItemClick('income')}>
                <FaFileInvoiceDollar className="sidebar-icon text-xl mr-3" />
                <span className="sidebar-text font-medium">Income</span>
              </button>
            </li>
          </ul>
        </li>
        <li className="sidebar-section mt-4">
          <h3 className="sidebar-section-heading text-primary text-lg font-semibold mb-2">Reports</h3>
          <ul className="sidebar-submenu space-y-2">
            <li>
              <button className="sidebar-button w-full flex items-center p-2 rounded-lg hover:bg-primary hover:text-white" onClick={() => onItemClick('businessReport')}>
                <FaClipboardList className="sidebar-icon text-xl mr-3" />
                <span className="sidebar-text font-medium">Business Report</span>
              </button>
            </li>
            <li>
              <button className="sidebar-button w-full flex items-center p-2 rounded-lg hover:bg-primary hover:text-white" onClick={() => onItemClick('stockReport')}>
                <FaBoxes className="sidebar-icon text-xl mr-3" />
                <span className="sidebar-text font-medium">Stock Report</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default PanicSidebar;
