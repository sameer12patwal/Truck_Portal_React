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
import tick from '../images/tick.svg';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';


const Completed = () => {

  const baseUrl = useApi();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
      fetchData();
  }, []); 

  const fetchData = async () => {
    try {

      const response = await axios.get(`${baseUrl}/api/VeichleTrip/Get_Tripcomplete_list`, {} );

      setTableData(response.data.data);
      setExportData(response.data.data);
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
        { "width": "12.5%", "targets": 1 },
        { "width": "25%", "targets": 2 },
        { "width": "10%", "targets": 3 },
        { "width": "10%", "targets": 4 },
        { "width": "10%", "targets": 5 },
        { "width": "10%", "targets": 6 },
        { "width": "10%", "targets": 7 },
        { "width": "7.5%", "targets": 8 },

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
        `VCT${index}`,
        task.lorY_NO,
        task.vehiclE_OWNER,
        task.dC_RET_DATE ? task.dC_RET_DATE : '',
        task.exiT_DT ? task.exiT_DT : '',
        // formatTimestampToDDMMYYYY(task.driveR_DOB),
        `${task.size} ${task.sizE_MEASUREMENT.trim()}`,
        task.fuel,
        `<div class="mainClassTd">
           <div class="circleTd ${task.trip_Status}">
              <img src="${tick}" class="ticktask" />
           </div>
           <p class="${task.trip_Status}">${task.trip_Status}</p>
        </div>`,
        `
           <img src="${viewImg}" class="view-details-link" data-TripId= "${task.trip_ID}" data-Vtype = "${task.size+" "+(task.sizE_MEASUREMENT)}"/>
        `
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
    const tripId = event.currentTarget.getAttribute('data-TripId');
    const vehicleType = event.currentTarget.getAttribute('data-Vtype');
    sessionStorage.setItem('vehicletype', vehicleType);
    navigate(`/Trip/Completed/DetailedView/${tripId}/Viewonly`);
  } 

  const handleExport = () => {
    exportData;
    
    // Define headers
    const headers = [
        "S.No.", "Lorry Number", "Vehicle Owner", "Vehicle Size", "Fuel Type",
        "Status"
    ];

    // Transform each task object into the desired row format
    const rowData = exportData.map((task, index) => [
        `VCT${index}`,
        task.lorY_NO,
        task.vehiclE_OWNER,
        `${task.size} ${task.sizE_MEASUREMENT.trim()}`,
        task.fuel,
        task.trip_Status,
    ]);

    // Combine headers with rowData
    const exportDataFormatted = [headers, ...rowData];
    
    const worksheet = XLSX.utils.aoa_to_sheet(exportDataFormatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `Export_All_Trips_Completed_${new Date().toISOString()}.xlsx`);
};

  return (
    <section className='dashboard-Mytask'>
      {/* {loading && (
          <div className="youtube-loader">
          <div className="loader-bar"></div>
        </div>
      )} */}
      <div className='dashboard-one'>
        <div className='left-dashboard-one'>
            <h5 className='dashHead m-0'>Completed Trips</h5>
            <p className='paraMain m-0'>Managing all completed trips here.</p>
        </div>
        <div className='right-dashboard-one'>
          <button type='button' className='btn btn-primary graphiBtn' onClick={handleExport}>Export Data</button>
        </div>
      </div>

      <div className='dashboard-three'>

            <table id="table" >
                <thead className='DTMT-table-head'>
                    <tr>
                        <th className='DTMT-head'>S.No.</th>
                        <th className='DTMT-head'>Lorry Number</th>
                        <th className='DTMT-head'>Vehicle Owner</th>
                        <th className='DTMT-head'>DT Return Date</th>
                        <th className='DTMT-head'>Exit Date</th>
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

export default Completed;