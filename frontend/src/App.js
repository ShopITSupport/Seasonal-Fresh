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
          <ProtectedRoute path="/me" component={Profile} exact></ProtectedRoute>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
