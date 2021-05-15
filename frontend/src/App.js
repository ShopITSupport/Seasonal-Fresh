import axios from 'axios';
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/Home'
import ProductDetails from './components/product/ProductDetails'

import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import ProtectedRoute from './components/route/ProtectedRoute'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import NewPassword from './components/user/NewPassword'
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
import ListOrders from './components/order/ListOrders'

import { loadUser } from './actions/userActions'
import store from './store'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    store.dispatch(loadUser())
    
    async function getStripeApiKey() {

      const { data } = await axios.get('/api/v1/stripeapi');
      setStripeApiKey(data.stripeApiKey)

    }
    getStripeApiKey();
  }, [])

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact></Route>
          <Route path="/search/:keyword" component={Home}></Route>
          <Route path="/product/:id" component={ProductDetails} exact></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/register" component={Register}></Route>
          <Route path="/password/forgot" component={ForgotPassword} exact></Route>
          <Route path="/password/reset/:token" component={NewPassword} exact></Route>
          <Route path="/cart" component={Cart}></Route>
          <ProtectedRoute path="/me" component={Profile} exact></ProtectedRoute>
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact></ProtectedRoute>
          <ProtectedRoute path="/password/update" component={UpdatePassword} exact></ProtectedRoute>
          <ProtectedRoute path="/shipping" component={Shipping} ></ProtectedRoute>
          <ProtectedRoute path="/order/confirm" component={ConfirmOrder} ></ProtectedRoute>
          <ProtectedRoute path="/orders/me" component={ListOrders} exact></ProtectedRoute>
          {stripeApiKey && <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} ></ProtectedRoute>
            </Elements>
          }
          <ProtectedRoute path="/success" component={OrderSuccess} ></ProtectedRoute>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
