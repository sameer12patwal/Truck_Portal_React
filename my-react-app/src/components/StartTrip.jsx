import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useApi } from '../APIConfig/ApiContext';
import { Link, Route, Routes } from 'react-router-dom';
import 'datatables.net-dt/css/jquery.dataTables.css';
import DataTable from 'datatables.net-dt';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MultiSelectDropdown from './MultiSelectDropdown';
import viewImg from '../images/right.svg';
import { useNavigate } from 'react-router-dom';

const StartTrip = () => {

  const baseUrl = useApi();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
      fetchData();
  }, []); 

  const fetchData = async () => {
    try {

      const response = await axios.get(`${baseUrl}/api/VeichleTrip/Get_TripNotMoving_list`, {} );

      setTableData(response.data.data);
      // console.log(response.data.data)

    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    const table = new DataTable('#table', {
      scrollY: '65vh',
      destroy: true,
      // scrollX: true,
      ordering: false,
      paging: false,
      columnDefs: [
        { "width": "5%", "targets": 0 },
        { "width": "15%", "targets": 1 },
        { "width": "25%", "targets": 2 },
        { "width": "12.5%", "targets": 3 },
        { "width": "12.5%", "targets": 4 },
        { "width": "15%", "targets": 5 },
        { "width": "15%", "targets": 6 },

      ],
      createdRow: function (row, data, dataIndex) {
        const tdElements = row.getElementsByTagName('td');
        for (let i = 0; i < tdElements.length; i++) {
          tdElements[i].classList.add('DTMT-Head');
        }
      },
    });

    console.log(tableData)
    table.clear();
    if (!tableData || tableData.length === 0) {
      table.clear().draw();
    } else {
    tableData.forEach((task, index) => {

      // console.log(task.size+" "+(task.sizE_MEASUREMENT))

      const rowData = [
        `VST${index}`,
        task.lorY_NO,
        task.vehiclE_OWNER,
        // formatTimestampToDDMMYYYY(task.driveR_DOB),
        task.size,
        `${task.size} ${task.sizE_MEASUREMENT.trim()}`,
        `<div class="mainClassTd">
           <div class="circleTd ${task.trip_Status}"></div>
           <p class="${task.trip_Status}">${task.trip_Status}</p>
        </div>`,
        `<div class="mainClassTd">
           <img src="${viewImg}" class="view-details-link startTrip" data-v_ID="${encodeURIComponent(task.vId)}" data-loryRent = "${task.v_Rent}" data-Ftype="${task.fuel}" data-Vtype = "${task.size+" "+(task.sizE_MEASUREMENT)}" data-TripId= "${task.trip_ID}" />
           <p class="imgText m-0">Start Trip</p>
        </div>`,
      ];

      table.row.add(rowData);
    });

    function formatTimestampToDDMMYYYY(timestamp) {
      if (!timestamp) {
        return '';
      }
    
      const dateObject = new Date(timestamp);

      if (isNaN(dateObject.getTime())) {
        return '';
      }
    
      const day = String(dateObject.getDate()).padStart(2, '0');
      const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = dateObject.getFullYear();
    
      return `${day}/${month}/${year}`;
    }
    

    table.draw();

  }
    const addEventListeners = () => {
    document.querySelectorAll('.view-details-link').forEach((link) => {
      link.addEventListener('click', handleViewDetails);
    });
  }

  addEventListeners();

  table.on('draw.dt', addEventListeners);
   
  }, [tableData]);

  function handleViewDetails(event) {
    const V_ID = event.currentTarget.getAttribute('data-v_ID');
    const loryRent = event.currentTarget.getAttribute('data-loryRent');
    const vehicleType = event.currentTarget.getAttribute('data-Vtype');
    const fuelType = event.currentTarget.getAttribute('data-Ftype');
    const tripId = event.currentTarget.getAttribute('data-TripId');
    sessionStorage.setItem('vehicletype', vehicleType);
    sessionStorage.setItem('tripId', tripId)
    sessionStorage.setItem('fuelType', fuelType)
    // console.log(vehicleType)
    if(loryRent === 'null'){
      sessionStorage.setItem('lory_Rent', 0)
    }else{
      sessionStorage.setItem('lory_Rent', loryRent)
    }
    console.log(V_ID)
    navigate(`/Trip/StartTrip/Create_New_Trip/${V_ID}`);
    // console.log(groupId);
  } 

  

  return (
    <section className='dashboard-Mytask'>
      {/* {loading && (
          <div className="youtube-loader">
          <div className="loader-bar"></div>
        </div>
      )} */}
      <div className='dashboard-one'>
        <div className='left-dashboard-one'>
            <h5 className='dashHead m-0'>Start Trip</h5>
            <p className='paraMain m-0'>Managing All start trip here.</p>
        </div>
        <div className='right-dashboard-one'>
        </div>
      </div>

      <div className='dashboard-three'>

            <table id="table" >
                <thead className='DTMT-table-head'>
                    <tr>
                        <th className='DTMT-head'>S.No.</th>
                        <th className='DTMT-head'>Lorry Number</th>
                        <th className='DTMT-head'>Vehicle Owner</th>
                        <th className='DTMT-head'>Vehicle Size</th>
                        <th className='DTMT-head'>Fuel Type</th>
                        <th className='DTMT-head'>Moving Status</th>
                        <th className='DTMT-head'>Action</th>
                    </tr>
                </thead>
                <tbody>
                {/* Render table data here */}
                </tbody>
            </table>
        
      </div>

    </section>
  );
};

export default StartTrip;