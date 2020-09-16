import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard'
import ProjectDetails from './components/projects/ProjectDetails'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import CreateProject from './components/projects/CreateProject'
import ChartBoard from './components/dashboard/ChartBoard'
import ViewAllLand from './components/dashboard/ViewAllLand'
import AddLand from './components/dashboard/AddLand';
import SellLand from './components/dashboard/SellLand'
import PropertyDetails from './components/projects/PropertyDetails'
import BuyLand from './components/dashboard/BuyLand'
import SellDetail from './components/projects/SellDetail';
import Notifications from './components/dashboard/Notifications';
import Sidenav from './components/layout/Sidenav'
import { signIn } from './store/actions/authActions';

const App = () => {

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route path='/chartboard' component={ChartBoard} />
          <Route path='/ViewAllLand' component={ViewAllLand} />
          <Route path='/property/:id' component={PropertyDetails} />
          <Route path='/notifications' component={Notifications} />
          <Route path='/Database' component={AddLand} />
          <Route path='/sellLand' component={SellLand} />
          <Route path='/buyLand' component={BuyLand} />
          <Route path='/project/:id' component={ProjectDetails} />
          <Route path='/sellDetail/:id' component={SellDetail} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
