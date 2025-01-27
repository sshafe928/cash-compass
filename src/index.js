import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import Dashboard from './pages/Dashboard';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Dashboard/>},
  // Add more routes here
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
);