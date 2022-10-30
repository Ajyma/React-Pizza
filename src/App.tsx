import React from 'react';
import Loadable from 'react-loadable';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import './scss/app.scss';

const Cart = Loadable({
  loader: () => import(/* webpackChunkname: "Cart" */ './pages/Cart'),
  loading: () => <div>Идет загрузка корзины...</div>,
})
const NotFound = React.lazy(() => import(/* webpackChunkname: "NotFound" */ './pages/NotFound'));

function App() {
  return (
    <Routes>
      <Route path="" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/cart"
          element={
            <React.Suspense>
              <Cart />
            </React.Suspense>
          }
        />
        <Route 
          path="*" 
          element={
            <React.Suspense fallback={<div>Идет загрузка...</div>}>
              <NotFound />
            </React.Suspense>
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;
