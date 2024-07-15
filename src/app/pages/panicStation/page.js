"use client";
import React, { useState } from 'react';
import PanicSidebar from './Sidebar';
import PanicOverview from './PanicOverview';
import Panicnavbar from './Panicnavbar';
import Sales from './Sales';
import Expenses from './Expenses';
import Income from './Income';
import BusinessReport from './BusinessReport';
import StockReport from './StockReport';
import Products from '../dashboard/Products/Products';
import ProductPanic from './ProductPanic';

export default function Dashboard() {
  const [displayComponent, setDisplayComponent] = useState('overview');

  const handleItemClick = (component) => {
    setDisplayComponent(component);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Panicnavbar />
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64"> {/* Adjusted height calculation */}
          <PanicSidebar onItemClick={handleItemClick} />
        </div>

        {/* Right Content */}
        <div className="flex-1 ml-64 mt-16 overflow-y-auto"> {/* Added mt-16 for spacing below the navbar */}
          <div className="mx-4 my-8">
            {displayComponent === 'overview' && <PanicOverview />}
            {displayComponent === 'product' && <ProductPanic />}
            {displayComponent === 'sales' && <Sales />}
            {displayComponent === 'expense' && <Expenses />}
            {displayComponent === 'income' && <Income />}
            {displayComponent === 'businessReport' && <BusinessReport />}
            {displayComponent === 'stockReport' && <StockReport />}
          </div>
        </div>
      </div>
    </div>
  );
}
