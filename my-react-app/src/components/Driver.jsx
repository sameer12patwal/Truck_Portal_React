import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DTDriver from './DatatableDriver';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useApi } from '../APIConfig/ApiContext';
import { Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import truck from '../images/AllDriver.png';
import car from '../images/AllExpiring.png';
import puc from '../images/AllExpired.png';

import MultiSelectDropdown from './MultiSelectDropdown';

const Driver = () => {

  const baseUrl = useApi();

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);

  const [Modalloading, setModalLoading] = useState(false);

  const [refreshComponent, setRefreshComponent] = useState(false);

  const navigate = useNavigate();

  const handleShow = () => {
    // setShowModal(true);
    navigate(`/Driver/AddNewDriver`);
  }


  const [selectedTab, setSelectedTab] = useState(0);
  const [taskData, setTaskData] = useState([]);


  const [allDriver ,setallDriver] = useState(0);
  const [LicExpiring ,setLicExpiring] = useState(0);
  const [LicExpired ,setLicExpired] = useState(0);

  const handleTabSelect = (index) => {
    setSelectedTab(index);
  };

  useEffect(() => {
    const fetchTaskstatusData = async () => {
      try {
        // const ownerId = sessionStorage.getItem('userId');
        // const bearerToken = sessionStorage.getItem('token');

        const data = {
          "C_ID": 0
        }

        // console.log(data)

        const taskResponse = await axios.post(`${baseUrl}/api/Driver/Get_DriverDetails`, data );

        // console.log(taskResponse.data)
        // console.log(taskResponse.data.data.vehicleview)
        // console.log(taskResponse.data.data.documenttypecount[0])
        // console.log(taskResponse.data.data.vehicleview[0])
        setallDriver(taskResponse.data.drivercount[0].count);
        setLicExpiring(taskResponse.data.drivercount[1].count);
        setLicExpired(taskResponse.data.drivercount[2].count);

        

        setTaskData(taskResponse.data);

        setLoading(false);

      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);

      }
    };
    fetchTaskstatusData();
  },[baseUrl, refreshComponent])


  const getStatusCodeForTab = (index) => {
    switch (index) {
      case 0:
        return 0; 
      case 1:
        return 1;
      case 2:
        return 2;
      default:
        return 'Unknown';
    }
  };


  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedRadioButton, setSelectedRadioButton] = useState('members');
  const [groupData, setGroupData] = useState([]);
  const [groupDataSend , setgroupDataSend] = useState([]);



  return (
    <section className='dashboard-Mytask'>
      {loading && (
          <div className="youtube-loader">
          {/* YouTube-style top red line loader */}
          <div className="loader-bar"></div>
        </div>
      )}
      <div className='dashboard-one'>
        <div className='left-dashboard-one'>
            <h5 className='dashHead m-0'>Drivers dashboard</h5>
            <p className='paraMain m-0'>Managing All Details Here.</p>
        </div>
        <div className='right-dashboard-one'>
            <button type='button' className='btn btn-primary graphiBtn' onClick={handleShow}>+ New Driver</button>
        </div>
      </div>

      <div className='dashboard-three'>

        <Tabs selectedIndex={selectedTab} onSelect={handleTabSelect}>
        <div className='tabTop'>
          <TabList className='ul-list-mytask'>
            <Tab className={`li-list-mytask ${selectedTab === 0 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={truck} className='imgDash'></img>
                <div>
                    <h5 className='m-0 display-10'>{allDriver}</h5>
                  <span>All Drivers</span>
                </div>
              </div>
            </Tab>
            <Tab className={`li-list-mytask ${selectedTab === 1 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={car} className='imgDash'></img>
                <div>
                  <h5 className='m-0 display-10'>{LicExpiring}</h5>
                  <span>License Expiring</span>
                </div>
              </div>
            </Tab>
            <Tab className={`li-list-mytask ${selectedTab === 2 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={puc} className='imgDash'></img>
                <div>
                  <h5 className='m-0 display-10'>{LicExpired}</h5>
                  <span>License Expired</span>
                </div>
              </div>
            </Tab>
            
          </TabList>
            
        </div>

          <TabPanel>
            <DTDriver tabId={getStatusCodeForTab(0)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
          <TabPanel>
            <DTDriver tabId={getStatusCodeForTab(1)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
          <TabPanel>
            <DTDriver tabId={getStatusCodeForTab(2)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
        </Tabs>
      </div>

    </section>
  );
};

export default Driver;