'use client';

import React, { useEffect, Suspense } from 'react';
// import { ToastContainer } from 'react-toastify';



export default function Home() {
  useEffect(() => {
    // Any necessary side-effects
  }, []);

  return (
    <div>
      <div className="main-content  overflow-y-auto app">
        <Suspense fallback={<div><span className="loading loading-infinity loading-lg "></span></div>}>



        </Suspense>
      </div>
    </div>
  );
}
