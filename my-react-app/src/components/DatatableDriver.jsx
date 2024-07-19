import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'datatables.net-dt/css/jquery.dataTables.css';
import DataTable from 'datatables.net-dt';
import { Icon } from '@iconify/react';
import { useApi } from '../APIConfig/ApiContext';
import { Link, useNavigate } from 'react-router-dom';
import editImg from '../images/edit.svg';
import deleteImg from '../images/delete.svg';
import { Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MultiSelectDropdown from './MultiSelectDropdown';
import FilterDropdown from './filterDropdownTask';
import viewImg from '../images/view.svg';

const MydatatableDriver = ({tabId, refresh, setRefresh}) => {

  const baseUrl = useApi();

  const navigate = useNavigate();

  // console.log(tabId)

  // const [Modalloading, setModalLoading] = useState(false);

  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 250);
   
  }, [refresh, setRefresh]); 

  const fetchData = async () => {
    try {
      // const ownerId = sessionStorage.getItem('userId');
      // const bearerToken = sessionStorage.getItem('token');

      // console.log(tabId)
      const data = {
        "C_ID": tabId
      }

      // console.log(data)
      const response = await axios.post(`${baseUrl}/api/Driver/Get_DriverDetails`, data );

      setTableData(response.data.data);
      // console.log(response.data.data.vehicleview)
      // setOriginalData(filteredData);
      // console.log(filteredData);
      setRefresh(false);

    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  // console.log(tabId);

  useEffect(() => {
    const table = new DataTable('#table', {
      scrollY: '54vh',
      destroy: true,
      // scrollX: true,
      ordering: false,
      paging: false,
      columnDefs: [
        { "width": "25%", "targets": 0 },
        { "width": "10%", "targets": 1 },
        { "width": "10%", "targets": 2 },
        { "width": "10%", "targets": 3 },
        { "width": "10%", "targets": 4 },
        { "width": "15%", "targets": 5 },
        { "width": "10%", "targets": 6 },
        { "width": "10%", "targets": 7 },
      ],
      createdRow: function (row, data, dataIndex) {
        // Add the class to each <td> element in the row
        const tdElements = row.getElementsByTagName('td');
        for (let i = 0; i < tdElements.length; i++) {
          tdElements[i].classList.add('DTMT-Head');
        }
      },
    });

    table.clear();
    // console.log(tableData.loryno)
    if (!tableData || tableData.length === 0) {
      // Optionally, you can manually clear the table and draw it to ensure it shows the "No data" message
      table.clear().draw();
    } else {
    tableData.forEach((task) => {

      // console.log(task)

      const rowData = [
        `<p class="m-0 p-0 vehicleDatapara">${task.emp_Name}</p>`,
        `<p class="m-0 p-0 vehicleDatapara">${task.emP_ID}</p>`,
        `<p class="m-0 p-0 vehicleDatapara">${task.mobile}</p>`,
        `<p class="m-0 p-0 vehicleDatapara">${formatTimestampToDDMMYYYY(task.driveR_DOB)}</p>`,
        // task.driving_Licence,
        `<p class="m-0 p-0 vehicleDatapara">${formatTimestampToDDMMYYYY(task.date_Of_Joining)}</p>`,
        // formatTimestampToDDMMYYYY(task.roadtax),
        // '<p class="m-0">' + task.owner.firstName + ' ' + task.owner.lastName + '</p>',
        `<p class="m-0 p-0 vehicleDatapara">${task.driving_Licence}</p>`,
        `<p class="m-0 p-0 vehicleDatapara">${formatTimestampToDDMMYYYY(task.driving_Licence_exp_date)}</p>`,
        // '<a href="#" class="view-details-link" data-VId="' + task.vId + '">View</a>',
        `
            <img src="${viewImg}" class="view-details-link" data-d_ID="${encodeURIComponent(task.d_ID)}" />
       `,
        // isPending ? (
        //   `<div class="ActionsBtn">
        //     <img src="${editImg}" class="Image-Edit" data-taskid="${encodeURIComponent(task.taskId)}" />
        //     <img src="${deleteImg}" class="Image-Delete" data-taskid="${encodeURIComponent(task.taskId)}" />
        //   </div>`
        // ) : (
        //   `<div class="ActionsBtn">
        //     <img src="${editImg}" class="Img-Edit" />
        //     <img src="${deleteImg}" class="Img-Delete" />
        //   </div>`
        // ),
      ];

      table.row.add(rowData);
    });

    function formatTimestampToDDMMYYYY(timestamp) {
      // Check if timestamp is falsy or explicitly check for null or undefined
      if (!timestamp) {
        return '';
      }
    
      const dateObject = new Date(timestamp);
    
      // Additionally, check if the dateObject is "Invalid Date"
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
    document.querySelectorAll('.Image-Edit').forEach((links) => {
      links.addEventListener('click', handleModaltaskDetails);
    });

    document.querySelectorAll('.Image-Delete').forEach((linksD) => {
      linksD.addEventListener('click', DeleteTaskData);
    });
  }
  // Attach event listeners initially
  addEventListeners();

  // Re-attach event listeners after each DataTable draw
  table.on('draw.dt', addEventListeners);
   
  }, [tableData]);

  function handleViewDetails(event) {
    const D_ID = event.currentTarget.getAttribute('data-d_ID');
    // console.log(D_ID)
    navigate(`/Driver/ViewDriverDetails/${D_ID}`);
    // console.log(groupId);
  }  


  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [filterDropdownPosition, setFilterDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

  const showFilterDropdown = (columnName) => {
    const thElement = document.querySelector(`th.DTMT-head[data-column="${columnName}"]`);

    if (thElement) {
      const thRect = thElement.getBoundingClientRect();
      setFilterDropdownPosition({ top: thRect.bottom, left: thRect.left });
      setFilterDropdownVisible(true);
      setSelectedColumn(columnName);
    }
  };

  const [originalData, setOriginalData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('');

  // const uniqueTotalMembers = Array.from(new Set(originalData.map(group => group[selectedColumn])));

  const uniqueTotalMembers = () => {
    // Logic to determine which column data to show in the dropdown
    if (selectedColumn === 'taskType.taskTypeName') {
      return Array.from(new Set(originalData.map(task => task.taskType.taskTypeName)));
    } else if (selectedColumn === 'ageingDays') {
      return Array.from(new Set(originalData.map(task => task.ageingDays)));
    }
    else if (selectedColumn === 'sourceTypeName') {
      return Array.from(new Set(originalData.map(task => task.sourceType ? task.sourceType.sourceTypeName : ' no source ')));
    }
    else if (selectedColumn === 'taskName') {
      return Array.from(new Set(originalData.map(task => task.taskName)));
    }
    // Handle other columns as needed
    return [];
  };

  // const applyFilter = (filters) => {
  //   // If originalData is empty, initialize it with tableData
  //   if (originalData.length === 0) {
  //     setOriginalData([...tableData]);
  //   }
  
  //   // If there are no filters, show all data
  //   if (filters.length === 0) {
  //     setTableData([...originalData]);
  //     return;
  //   }
  
  //   // Dynamically filter based on numeric or string values
  //   const filteredData = originalData.filter(task => {
  //     if (selectedColumn === 'taskType.taskTypeName') {
  //       // Numeric filter for 'groupMembers.length'
  //       return filters.includes(task.taskType.taskTypeName);
  //     } else if (selectedColumn === 'ageingDays') {
  //       // String filter for 'groupName'
  //       return filters.includes(task.ageingDays);
  //     }
  //     else if (selectedColumn === 'sourceTypeName') {
  //       // String filter for 'groupName'
  //       return filters.includes(task.sourceType ? task.sourceType.sourceTypeName : ' no source ');
  //     }
  //     return false; // Handle other cases as needed
  //   });
  
  //   // Update the state with the filtered data
  //   setTableData(filteredData);
  // };

  const [previousFilters, setPreviousFilters] = useState([]);

  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }
  
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
  
    return true;
  }

  const applyFilter = (filters) => {
    // console.log(filters)
    if (originalData.length === 0) {
      setOriginalData([...tableData]);
    }
  
    if (filters.length === 0) {
      setTableData([...originalData]);
      return;
    }
  
    const isFilterFromInitialData = filters.every((filter) => {
      if (selectedColumn === 'taskType.taskTypeName') {
        return originalData.some((task) => filter === task.taskType.taskTypeName);
      } else if (selectedColumn === 'ageingDays') {
        return originalData.some((task) => filter === task.ageingDays);
      }
      else if (selectedColumn === 'sourceTypeName') {
        return originalData.some((task) => filter === (task.sourceType ? task.sourceType.sourceTypeName : ' no source '));
      }
      else if (selectedColumn === 'taskName') {
        return originalData.some((task) => filter === task.taskName);
      }
      return false;
    });
  
    const filteredData = isFilterFromInitialData
      ? originalData.filter((task) => {
          if (selectedColumn === 'taskType.taskTypeName') {
            return filters.includes(task.taskType.taskTypeName);
          } else if (selectedColumn === 'ageingDays') {
            return filters.includes(task.ageingDays);
          }
          else if (selectedColumn === 'sourceTypeName') {
            return filters.includes(task.sourceType ? task.sourceType.sourceTypeName : ' no source ');
          }
          else if (selectedColumn === 'taskName') {
            return filters.includes(task.taskName);
          }
          return false;
        })
      : tableData.filter((task) => {
          if (selectedColumn === 'taskType.taskTypeName') {
            return filters.includes(task.taskType.taskTypeName);
          } else if (selectedColumn === 'ageingDays') {
            return filters.includes(task.ageingDays);
          }
          else if (selectedColumn === 'sourceTypeName') {
            return filters.includes(task.sourceType ? task.sourceType.sourceTypeName : ' no source ');
          }
          else if (selectedColumn === 'taskName') {
            return filters.includes(task.taskName);
          }
          return false;
        });
  
        if (filteredData.length === 0) {
          // If no data with the current filters, load the previous filters
          if (!deepEqual(filters, previousFilters)) {
            // Check if the filters are not the same as the previous filters to avoid infinite loop
            applyFilter(previousFilters);
            // console.log(previousFilters);
          }
        } else {
          setTableData(filteredData);
        }
  };
  
  const closeFilterDropdown = () => {
    setFilterDropdownVisible(false);
  };

  const [activeFilters, setActiveFilters] = useState([]);

  // const handleApplyFilter = (filterValue) => {
  //   // Your filter logic here

  //   const updatedFilters = activeFilters.includes(filterValue)
  //   ? activeFilters.filter((filter) => filter !== filterValue)
  //   : [...activeFilters, filterValue];
    
  //   setActiveFilters(updatedFilters);

  //   // Apply the filters
  //   applyFilter(updatedFilters);
  //   closeFilterDropdown();
  // };

  const handleApplyFilter = (filterValue) => {
    const updatedFilters = activeFilters.includes(filterValue)
      ? activeFilters.filter((filter) => filter !== filterValue)
      : [...activeFilters, filterValue];
  
    setActiveFilters(updatedFilters);
  
    // Apply the filters
    applyFilter(updatedFilters);
  
    // Save the filters for future use
    setPreviousFilters(updatedFilters);
  
    // Check if the filter dropdown should be closed
    // if (!updatedFilters.includes(filterValue)) {
    //   closeDropdown();
    // }
  };

  // const handleAttachmentClick = (fileUrl) => {
  //   // Handle the click with the file URL
  //   console.log('File URL:', fileUrl);
  
  //   // Open the file URL in a new window or perform other actions
  //   window.open(fileUrl, '_blank');
  // };
  
  

  return (
    
    <div className='listview' id='swtichingView'>
      <table id="table" >
        <thead className='DTMT-table-head'>
            <tr>
                <th className='DTMT-head' data-column="taskName">
                  Employee Name
                  {/* <Icon icon="ion:filter-sharp" className='iconMembersfilter' onClick={() => showFilterDropdown('taskName')} /> */}
                </th>
                <th className='DTMT-head' data-column="taskType.taskTypeName">
                  Employee Id
                  {/* <Icon icon="ion:filter-sharp" className='iconMembersfilter' onClick={() => showFilterDropdown('taskType.taskTypeName')} /> */}
                </th>
                <th className='DTMT-head' data-column="sourceTypeName">
                  Mobile Number
                  {/* <Icon icon="ion:filter-sharp" className='iconMembersfilter' onClick={() => showFilterDropdown('sourceTypeName')} /> */}
                </th>
                <th className='DTMT-head'>Date of Birth</th>
                <th className='DTMT-head' data-column="ageingDays">
                  Joining Date
                  {/* <Icon icon="ion:filter-sharp" className='iconMembersfilter' onClick={() => showFilterDropdown('ageingDays')} /> */}
                </th>
                <th className='DTMT-head'>License Number</th>
                {/* <th className='DTMT-head'>Created By</th> */}
                <th className='DTMT-head'>License Validity</th>
                <th className='DTMT-head'>Action</th>
            </tr>
        </thead>
        <tbody>
           {/* Render table data here */}
        </tbody>
      </table>

      {filterDropdownVisible && (
        <FilterDropdown
          filterDropdownPosition={filterDropdownPosition}
          applyFilter={applyFilter}
          closeDropdown={closeFilterDropdown}
          // activeFilter={activeFilter}
          activeFilters={activeFilters}
          handleApplyFilter={handleApplyFilter}
          columnData={uniqueTotalMembers()}
        />
      )}

     
      
    </div>
  );
};

export default MydatatableDriver;