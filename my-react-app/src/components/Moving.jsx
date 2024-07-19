import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useApi } from '../APIConfig/ApiContext';
import { Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'datatables.net-dt/css/jquery.dataTables.css';
import DataTable from 'datatables.net-dt';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MultiSelectDropdown from './MultiSelectDropdown';
import viewImg from '../images/view.svg';
import right from '../images/right.svg';
import lockImg from '../images/lock.svg';
import greenlock from '../images/greenlock.svg';
import { useNavigate } from 'react-router-dom';

const Moving = () => {

  const baseUrl = useApi();

  const [tableData, setTableData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
      fetchData();
  }, []); 

  const fetchData = async () => {
    try {

      const response = await axios.get(`${baseUrl}/api/VeichleTrip/Get_TripMoving_list`, {} );

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
        { "width": "17.5%", "targets": 2 },
        { "width": "10%", "targets": 3 },
        { "width": "7.5%", "targets": 4 },
        { "width": "10%", "targets": 5 },
        { "width": "10%", "targets": 6 },
        // { "width": "7.5%", "targets": 5 },
        { "width": "10%", "targets": 7 },
        { "width": "10%", "targets": 8 },
        { "width": "5%", "targets": 9 },

      ],
      createdRow: function (row, data, dataIndex) {
        const tdElements = row.getElementsByTagName('td');
        for (let i = 0; i < tdElements.length; i++) {
          tdElements[i].classList.add('DTMT-Head');
        }
      },
    });

    // console.log(tableData)
    table.clear();
    if (!tableData || tableData.length === 0) {
      table.clear().draw();
    } else {
    tableData.forEach((task, index) => {

      const rowData = [
        `VMT${index}`,
        task.lorY_NO,
        task.vehiclE_OWNER,
        // formatTimestampToDDMMYYYY(task.driveR_DOB),
        `${task.size} ${task.sizE_MEASUREMENT.trim()}`,
        task.dC_RET_DATE ? task.dC_RET_DATE : '',
        task.exiT_DT ? task.exiT_DT : '',
        task.fuel,
        // `<img src="${viewImg}" class="view-details-link" data-v_ID="${encodeURIComponent(task.vId)}" />`,
        `<div class="mainClassTd">
           <div class="circleTd ${task.trip_Status}"></div>
           <p class="${task.trip_Status}">${task.trip_Status}</p>
        </div>`,
        `<div class="mainClassTd">
           <img src="${task.trip_Status === "Completed" ? lockImg : greenlock}" class="view-details-link ${task.trip_Status}" />
           <p class="imgText ${task.trip_Status} m-0">${task.trip_Status === "Completed" ? "Trip Locked" : "Trip Running"}</p>
        </div>`,
        `<div class="mainClassTd">
           <img src="${right}" class="view-details-link startTrip" data-status="${task.trip_Status}" data-v_ID="${encodeURIComponent(task.vId)}" data-loryRent = "${task.v_Rent}" data-Ftype = "${task.fuel}" data-Vtype = "${task.size+" "+(task.sizE_MEASUREMENT)}" data-TripId= "${task.trip_ID}" />
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
    const tripStatus = event.currentTarget.getAttribute('data-status');
    const V_ID = event.currentTarget.getAttribute('data-v_ID');
    const loryRent = event.currentTarget.getAttribute('data-loryRent');
    const vehicleType = event.currentTarget.getAttribute('data-Vtype');
    const fuelType = event.currentTarget.getAttribute('data-Ftype');
    const tripId = event.currentTarget.getAttribute('data-TripId');
    // console.log(tripStatus)
    if(tripStatus == 'Completed'){

      sessionStorage.setItem('vehicletype', vehicleType);
      sessionStorage.setItem('tripId', tripId)
      sessionStorage.setItem('fuelType', fuelType)
      // console.log(vehicleType)
      if(loryRent === 'null'){
        sessionStorage.setItem('lory_Rent', 0)
      }else{
        sessionStorage.setItem('lory_Rent', loryRent)
      }

      navigate(`/Trip/Completed/DetailedView/${tripId}/Moving`);

    }else{

      sessionStorage.setItem('vehicletype', vehicleType);
      sessionStorage.setItem('tripId', tripId)
      sessionStorage.setItem('fuelType', fuelType)
      // console.log(vehicleType)
      if(loryRent === 'null'){
        sessionStorage.setItem('lory_Rent', 0)
      }else{
        sessionStorage.setItem('lory_Rent', loryRent)
      }
      // console.log(V_ID)
      navigate(`/Trip/Moving/Drafted_Trip/${V_ID}`);

    }
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
            <h5 className='dashHead m-0'>Moving Trips</h5>
            <p className='paraMain m-0'>Managing all moving trips here.</p>
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
                        <th className='DTMT-head'>DC Return Date</th>
                        <th className='DTMT-head'>Exit Date</th>
                        <th className='DTMT-head'>Fuel Type</th>
                        {/* <th className='DTMT-head'>Drafts</th> */}
                        <th className='DTMT-head'>Moving Status</th>
                        <th className='DTMT-head'>Trip Status</th>
                        <th className='DTMT-head'>Drafts</th>
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

export default Moving;