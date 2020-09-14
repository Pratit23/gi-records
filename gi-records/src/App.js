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

const App = () => {

  return (
    <BrowserRouter>
      <div className="App">
        <div className="row">
          <div className="col s2 grey darken-4 mainSideNav">
            <Sidenav/>
          </div>
          <div className="col s10 mainScreen">
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
              <Route path='/SignIn' component={SignIn} />
              <Route path='/SignUp' component={SignUp} />
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
