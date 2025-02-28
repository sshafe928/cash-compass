import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import Dashboard from './pages/App';
import Forms from './pages/Forms';
import Budget from './pages/Budget';
import History from './pages/History';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/forms', element: <Forms /> },
  { path: '/history', element: <History /> },
  { path: '/budget', element: <Budget /> },
  { path: '/about', element: <About />},
  { path: '/login', element: <Login />},
  { path: '/signup', element: <Signup />},
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
);