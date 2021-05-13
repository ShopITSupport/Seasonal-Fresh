import { useEffect } from 'react'
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

import { loadUser } from './actions/userActions'
import store from './store'

function App() {

  useEffect(() => {
    store.dispatch(loadUser())
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
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
