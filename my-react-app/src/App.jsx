import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, HashRouter } from 'react-router-dom';
import Login from './components/login';
import Layout from './components/layout';
import Vehicle from './components/Vehicle';
import Driver from './components/Driver';
import RouteMaster from './components/Route';
import Costing from './components/Costing'
import Profile from './components/profile';
import ResetPass from './components/resetpassword'
import VehicleDetails from './components/VehicleDetails';
import DriverDetails from './components/DriverDetails';
import AddVehicle from './components/Addvehicle';
import AddDriver from './components/AddDriver';
import StartTrip from './components/StartTrip';
import Moving from './components/Moving.jsx';
import Completed from './components/Completed';
import Report from './components/Report';
import NewTrip from './components/TripDetails'
import DraftTrip from './components/DraftTripDetails'
import CompletedTripDetail from './components/CompletedTripDetail'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/reset-password/:emailid/:token" element={<ResetPass />} />

            <Route
          path="/*"
          element={
      
        <Layout>
          <Routes>
            <Route path="/Vehicle" element={<Vehicle />} />
            <Route path="/Driver" element={<Driver />} />
            <Route path="/Route" element={<RouteMaster />} />
            <Route path="/Costing" element={<Costing />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Vehicle/ViewDetails/:V_ID" element={<VehicleDetails />} />
            <Route path="/Vehicle/AddNewVehicle" element={<AddVehicle />} />
            <Route path="/Driver/ViewDriverDetails/:D_ID" element={<DriverDetails />} />
            <Route path="/Driver/AddNewDriver" element={<AddDriver />} />
            <Route path="/Trip/StartTrip" element={<StartTrip />} />
            <Route path="/Trip/StartTrip/Create_New_Trip/:V_ID" element={<NewTrip />} />
            <Route path="/Trip/Moving/Drafted_Trip/:V_ID" element={<DraftTrip />} />
            <Route path="/Trip/Moving" element={<Moving />} />
            <Route path="/Trip/Completed" element={<Completed />} />
            <Route path="/Trip/Report" element={<Report />} />
            <Route path="/Trip/Completed/DetailedView/:tripid/:tripstatus" element={<CompletedTripDetail />} />
          </Routes>
        </Layout>}
        />
        </Routes>
      </Router>
    </>
  );
}

export default App;

