import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Dashboard from './components/dashboard/Dashboard'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import ChartBoard from './components/dashboard/ChartBoard'
import ViewAllLand from './components/dashboard/ViewAllLand'
import AddLand from './components/dashboard/AddLand';
import PropertyDetails from './components/projects/PropertyDetails'
import BuyLand from './components/dashboard/BuyLand'
import SellDetail from './components/projects/SellDetail';
import Notifications from './components/dashboard/Notifications';
import { connect } from 'react-redux';
import PublicLand from './components/dashboard/PublicLand';
import AllTransactions from './components/dashboard/AllTransactions';

const App = (props) => {

  const { auth } = props

  localStorage.setItem('userDetails', JSON.stringify(auth.profile))

  return (
    <BrowserRouter>
    {
      auth.uid ?  <Redirect to='/signin' /> : null
    }
      <div className="App">
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route path='/chartboard' component={ChartBoard} />
          <Route path='/ViewAllLand' component={ViewAllLand} />
          <Route path='/property/:id' component={PropertyDetails} />
          <Route path='/notifications' component={Notifications} />
          <Route path='/Database' component={AddLand} />
          <Route path='/buyLand' component={BuyLand} />
          <Route path='/sellDetail/:id' component={SellDetail} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
          <Route path='/public' component={PublicLand} />
          <Route path='/transactions' component={AllTransactions} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
      property: state.coordinates.property,
      auth: state.firebase,
  }
}

export default connect(mapStateToProps, null)(App);
