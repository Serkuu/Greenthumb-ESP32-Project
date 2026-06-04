import React from 'react';
import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
