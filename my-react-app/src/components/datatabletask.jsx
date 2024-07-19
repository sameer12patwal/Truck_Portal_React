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
import * as XLSX from 'xlsx';

const MydataTable = ({tabId, refresh, setRefresh}) => {

  const baseUrl = useApi();

  const navigate = useNavigate();

  // console.log(tabId)

  // const [Modalloading, setModalLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);
  // const [showModal, setShowModal] = useState(false);
  // const [selectedTask, setSelectedTask] = useState(null);
  // const [selectedTaskType, setSelectedTaskType] = useState('');
  // const [selectedSourceType, setSelectedSourceType] = useState('');
  // const [selectedProjectType, setSelectedProjectType] = useState('');
  // const [selectedFrequencyType, setSelectedFrequencyType] = useState('');
  // const [selectedStartDateDT, setSelectedStartDateDT] = useState(null);
  // const [selectedEndDateDT, setSelectedEndDateDT] = useState(null);
  // const [profileImage, setProfileImage] = useState(null);
  // const datePickerRef = useRef(null);
  // const datePickerEndRef = useRef(null);

  // const [showDeletePopup, setShowDeletePopup] = useState(false);

  // useEffect(() => {
  //   if (selectedTask) {
  //     // Set the selectedType based on the data coming from selectedProject

  //     if(selectedTask.project === null){
  //       setSelectedProjectType('');
  //     }else{
  //       setSelectedProjectType(selectedTask.project.projectId);
  //     }
  //     setSelectedTaskType(selectedTask.taskType.taskTypeId);
  //     if(selectedTask.sourceType !== null){
  //       setSelectedSourceType(selectedTask.sourceType.sourceTypeId);
  //     }else{
  //       setSelectedSourceType('')
  //     }
      
  //     // setSelectedFrequencyType(selectedTask.frequency.frequencyId);
  //     // setSelectedStartDateDT(convertDateFormat(selectedTask.budgetedStartDate));
  //     // setSelectedEndDateDT(convertDateFormat(selectedTask.budgetedEndDate));
      
  //   }
  // }, [selectedTask]);

  // const handleDateChange = (date) => {
  //   // Handle the date change logic here
  //   setSelectedStartDateDT(date);
  // };

  // const handleEndDateChange = (date) => {
  //   // Handle the date change logic here
  //   setSelectedEndDateDT(date);
  // };

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
        "TVD_ID": tabId
      }

      // console.log(data)
      const response = await axios.post(`${baseUrl}/api/Vehicle`, data );

      setTableData(response.data.data.vehicleview);
      // console.log(response.data.data.vehicleview)
      setExportData(response.data.data.vehicleview);
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
      scrollY: '50vh',
      destroy: true,
      // scrollX: true,
      ordering: false,
      paging: false,
      columnDefs: [
        { "width": "7.5%", "targets": 0 },
        { "width": "10%", "targets": 1 },
        { "width": "22%", "targets": 2 },
        { "width": "8%", "targets": 3 },
        { "width": "8%", "targets": 4 },
        { "width": "8%", "targets": 5 },
        { "width": "8%", "targets": 6 },
        { "width": "8%", "targets": 7 },
        { "width": "8%", "targets": 8 },
        { "width": "7.5%", "targets": 9 },
        { "width": "5%", "targets": 10 },
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
        `<p class="m-0 p-0 vehicleDatapara">${task.loryno}</p>`,
        `<p class="m-0 p-0 vehicleDatapara">${task.vehicleowner}</p>`,
        `<p class="m-0 p-0 vehicleDatapara">${task.modelno}</p>`,
        `<p class="m-0 p-0 vehicleDatapara">${formatTimestampToDDMMYYYY(task.npAuth)}</p>`,
        `<p class="m-0 p-0 vehicleDatapara">${formatTimestampToDDMMYYYY(task.fitnessregn)}</p>`,
        // task.ageingDays,
        `<p class="m-0 p-0 vehicleDatapara">${formatTimestampToDDMMYYYY(task.pucc)}</p>`,
        `<p class="m-0 p-0 vehicleDatapara">${formatTimestampToDDMMYYYY(task.roadtax)}</p>`,
        // '<p class="m-0">' + task.owner.firstName + ' ' + task.owner.lastName + '</p>',
        `<p class="m-0 p-0 vehicleDatapara">${formatTimestampToDDMMYYYY(task.insurancevaladity)}</p>`,
        `<p class="m-0 p-0 vehicleDatapara">${formatTimestampToDDMMYYYY(task.permit)}</p>`,
        task.alert === 0 ? "<span class='noAlert'>No Alert</span>" : `<span class='newAlert'>${task.alert} New Alert</span>`,
        // '<a href="#" class="view-details-link" data-VId="' + task.vId + '">View</a>',
        `
            <img src="${viewImg}" class="view-details-link" data-VId="${encodeURIComponent(task.vId)}" />
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
    const V_ID = event.currentTarget.getAttribute('data-VId');
    // console.log(V_ID)
    navigate(`/Vehicle/ViewDetails/${V_ID}`);
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

  const handleExport = () => {
    if (!Array.isArray(exportData)) {
        console.error('exportData is not an array');
        alert('Export data is not available.');
        return;
      }
    
    //   console.log(exportData);
    
    // Define headers
    const headers = [
        'LORRY NO.','VEHICLE OWNER','MODEL NO.','NP AUTH VALIDITY','FITNESS REGISTRATION','PUCC VALIDITY','ROAD TAX','INSURANCE VALIDITY','PERMIT'];

    // Transform each task object into the desired row format
    const rowData = exportData.map(task => [
        task.loryno,
        task.vehicleowner,
        task.modelno,
        formatTimestampToDDMMYYYY(task.npAuth),
        formatTimestampToDDMMYYYY(task.fitnessregn),
        formatTimestampToDDMMYYYY(task.pucc),
        formatTimestampToDDMMYYYY(task.roadtax),
        formatTimestampToDDMMYYYY(task.insurancevaladity),
        formatTimestampToDDMMYYYY(task.permit), 
    ]);

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

    // Combine headers with rowData
    const exportDataFormatted = [headers, ...rowData];
    
    const worksheet = XLSX.utils.aoa_to_sheet(exportDataFormatted);
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({r: 0, c: C});
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
            fill: { fgColor: { rgb: "0000FF" } }, // Blue background
            font: { bold: true } // Bold font
        };
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `Export_VEHICLES_DATA_${new Date().toISOString()}.xlsx`);
};
  
  

  return (
    
    <div className='listview' id='swtichingView'>

      <div className='right-dashboard-one'>
          <button type='button' className='btn btn-primary graphiBtn' onClick={handleExport} style={{position:'absolute', top:'66px', right:'155px'}}>Export Data</button>
      </div>

      <table id="table" >
        <thead className='DTMT-table-head'>
            <tr>
                <th className='DTMT-head' data-column="taskName">
                  Lorry Number
                  {/* <Icon icon="ion:filter-sharp" className='iconMembersfilter' onClick={() => showFilterDropdown('taskName')} /> */}
                </th>
                <th className='DTMT-head' data-column="taskType.taskTypeName">
                  Vehicle Owner
                  {/* <Icon icon="ion:filter-sharp" className='iconMembersfilter' onClick={() => showFilterDropdown('taskType.taskTypeName')} /> */}
                </th>
                <th className='DTMT-head' data-column="sourceTypeName">
                  Model
                  {/* <Icon icon="ion:filter-sharp" className='iconMembersfilter' onClick={() => showFilterDropdown('sourceTypeName')} /> */}
                </th>
                <th className='DTMT-head'>NP Auth</th>
                <th className='DTMT-head'>Fitness Reg.</th>
                <th className='DTMT-head' data-column="ageingDays">
                  PUCC
                  {/* <Icon icon="ion:filter-sharp" className='iconMembersfilter' onClick={() => showFilterDropdown('ageingDays')} /> */}
                </th>
                <th className='DTMT-head'>Road Tax</th>
                {/* <th className='DTMT-head'>Created By</th> */}
                <th className='DTMT-head'>Insurance</th>
                <th className='DTMT-head'>Permit</th>
                <th className='DTMT-head'>Alert</th>
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

      {/* <div className='row d-flex'>
        {tableData.length > 0 ? (
          tableData.map((taskData) => (
            <div key={taskData.taskId} className='col-lg-3 col-6 col-sm-6 col-xs-6'>
              <div className='boxCardview mb-3'>
                <div className='d-flex align-items-center justify-content-between'>
                  <div className='d-flex gap-2 align-items-center'>
                    <h6 className='m-0 tileHeading' data-taskid={taskData.taskId} onClick={handleViewDetails} style={{cursor:'pointer'}}>{taskData.taskName}</h6>
                    <p className='Cardin-Text m-0'>{taskData.status.statusName}</p>
                  </div>
                  <Icon icon="pepicons-pop:dots-y" onClick={() => toggleActionDropdown(taskData.taskId)} style={{cursor:'pointer'}} />
                {isActionDropdownOpen && checkIndexVal === taskData.taskId && (
                  <div className='dropdown-Popup-Task'>
                    <ul className='dropdown-Popup-Task-ul'>
                      <li className='dropdown-Popup-Task-li' data-taskid={taskData.taskId} onClick={handleModaltaskDetails}>Edit</li>
                      <li className='dropdown-Popup-Task-li' data-taskid={taskData.taskId} onClick={DeleteTaskData}>Delete</li>
                    </ul>
                  </div>
                )}
                </div>
                {taskData.description === null ? (
                <p className='PTypeBlack mt-3'>No Data Found</p>
                ) : (
                <p className='PTypeBlack mt-3 taskShrinkCard  '>{taskData.description}</p>
                )}
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <p className='PTypeGrey m-0'>Creation Date</p>
                    <p className='PTypeBlack m-0'>{new Date(taskData.createdDate).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div> */}
                    {/* <p className='PTypeGrey m-0'>Created By</p>
                    <p className='PTypeBlack m-0'>{`${taskData.owner.firstName} ${taskData.owner.lastName}`}</p> */}
                  {/* </div>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="col-12 text-center mt-5">
              <p><strong>No data available in Grid</strong></p>
            </div>
        )}
      </div> */}

      {/* {showDeletePopup && (
        <div className='Erro_full'>
          <div className="error-popup delete">
              <Icon icon="material-symbols:error-outline" className='error-login' />
              <p className='projectDetailsp redp mt-3 mb-0'>Are you Sure ?</p>
              <p className='projectDetailsp'>You are Deleting the Selected Taskt </p>
              <div className='d-flex gap-1 justify-content-center'>
                <button className='btn btn-primary btn-sm' onClick={ConfirmedDeleteTask}>Ok</button>
                <button className='btn btn-secondary btn-sm' onClick={() => setShowDeletePopup(false)}>No</button>
              </div>
          </div>
        </div>
    )} */}

      {/* <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header>
          <div></div>
          <div className='text-center'>
            <h4 className='createTask-Head m-0'>Update Task</h4>
            <p className='m-0' style={{fontSize:'12px'}}>Add the required details for Updating new Tasks</p>
          </div>
          <button type="button" className='closeBtn' onClick={handleClose}>X</button>
        </Modal.Header>
        <Modal.Body>
        {selectedTask && (
             <form>
              <div className="form-group mb-2">
                <label className='pb-1 AllLableinProjects' for="AddTask" >Add Task <span style={{color:'red'}}>*</span></label>
                <input type="text" className={`form-control ${taskNameError ? 'is-invalid' : ''}`} id="" aria-describedby="emailHelp" placeholder="Add Task" value={selectedTask.taskName} onChange={(e) => setSelectedTask({ ...selectedTask, taskName: e.target.value })} />
                {taskNameError && <p className="error-message">{taskNameError}</p>}
              </div>
              <div className='d-flex gap-3 mb-2'>
                <div className="form-group w-100">
                  <label className='pb-1 AllLableinProjects' for="exampleFormControlSelect1" >Task Type <span style={{color:'red'}}>*</span></label>
                  <select
                    className={`form-control ${taskTypeError ? 'is-invalid' : ''}`}
                    id="exampleFormControlSelect1"
                    value={selectedTaskType}
                    onChange={(e) => setSelectedTaskType(e.target.value)}
                    >
                    <option value="" disabled>Select Task</option>
                    {taskTypes.map((taskType) => (
                      <option key={taskType.taskTypeId} value={taskType.taskTypeId}>
                        {taskType.taskTypeName}
                      </option>
                    ))}
                  </select>
                  {taskTypeError && <p className="error-message">{taskTypeError}</p>}
                </div>

                <div className="form-group w-100">
                  <label className='pb-1 AllLableinProjects' for="exampleFormControlSelect1" >Source Type </label>
                  <select className="form-control"  id="exampleFormControlSelect1" value={selectedSourceType} onChange={(e) => setSelectedSourceType(e.target.value)}>
                      <option value="" disabled>Select Source</option>
                      {sourceType.map((sourceType) => (
                        <option key={sourceType.sourceTypeId} value={sourceType.sourceTypeId}>
                          {sourceType.sourceTypeName}
                        </option>
                      ))}
                  </select>
                </div>
                
                <div className="form-group w-100">
                  <label className='pb-1 AllLableinProjects' for="exampleFormControlSelect1" >Project </label>
                  <select className="form-control" id="exampleFormControlSelect1" value={selectedProjectType} onChange={(e) => setSelectedProjectType(e.target.value)}>
                      <option value="" >Select Project</option>
                      {projectType.map((projectTypes) => (
                        <option key={projectTypes.projectId} value={projectTypes.projectId}>
                          {projectTypes.projectName}
                        </option>
                      ))}
                  </select>
                </div> */}
                {/* <div className="form-group w-100">
                    <label className='pb-1 AllLableinProjects' for="exampleFormControlSelect1" >Frequency <span style={{color:'red'}}>*</span></label>
                    <select className="form-control" id="exampleFormControlSelect1" value={selectedFrequencyType} onChange={(e) => setSelectedFrequencyType(e.target.value)}>
                        <option value="" disabled>Select Frequency</option>
                        {frequencyType.map((frequencyTypes) => (
                          <option key={frequencyTypes.frequencyId} value={frequencyTypes.frequencyId}>
                            {frequencyTypes.frequencyName}
                          </option>
                        ))}
                    </select>
                </div> */}
              {/* </div> */}
              {/* <div className='d-flex gap-3 mb-2'>
                  <div className="datewisePick form-group w-100">
                    <label className='pb-1 AllLableinProjects' htmlFor="dateInput">Budget Start Date: <span style={{color:'red'}}>*</span></label>
                    <DatePicker
                      selected={selectedStartDateDT}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy" // Customize date format as needed
                      placeholderText="Select a date"
                      className="form-control"
                      id="dateInput"
                    />
                  </div>
                  
                  <div className="datewisePick form-group w-100">
                    <label className='pb-1 AllLableinProjects' htmlFor="dateInput" >Budget End Date: <span style={{color:'red'}}>*</span></label>
                    <DatePicker
                      selected={selectedEndDateDT}
                      onChange={handleEndDateChange}
                      dateFormat="dd/MM/yyyy" // Customize date format as needed
                      placeholderText="Select a date"
                      className="form-control"
                      id="dateInput"
                    />
                  </div>
                
                  <div className="form-group w-100">
                    <label className='pb-1 AllLableinProjects' for="AddTask" >Budget Hours <span style={{color:'red'}}>*</span></label>
                    <input type="text" className="form-control" id="" aria-describedby="emailHelp" placeholder="Add Budget Hours" value={selectedTask.budgetedHours} onChange={(e) => setSelectedTask({ ...selectedTask, budgetedHours: e.target.value })} />
                  </div>
              </div> */}
              {/* <div className="form-group mb-2">
                  <label className='pb-1 AllLableinProjects'>Choose Members <span style={{color:'red'}}>*</span></label>
                      <MultiSelectDropdown
                        options={employeeOptions}
                        selectedValues={selectedEmployees}
                        onChange={handleMultiSelectGroupChange}
                  />
              </div>
              
               <div className="form-group mb-2">
                  <label className='pb-1 AllLableinProjects' for="exampleFormControlTextarea1" >Description </label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" rows="1"  placeholder="Add Description" value={selectedTask.description} onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}></textarea>
              </div>
              <div className="input-group mb-3">
                  <label className='pb-1 AllLableinProjects' for="exampleFormControlTextarea1" >Choose File </label>
                  <div className="custom-file w-100 p-1">
                  <input
                  type="file"
                  className="custom-file-input"
                  id="profileImage"
                  onChange={handleProfileImageChange}
                  />
                  </div>
                  {selectedTask.taskAttachments.length === 0 ? (
                      <p className='projectDetailsp m-0'>No Previously Uploaded Attachment/File Found</p>
                      ) : (
                      <p className='projectDetailsp d-flex align-items-center gap-2 m-0' style={{cursor:'pointer'}} onClick={() => handleAttachmentClick(selectedTask.taskAttachments[0].attachmentURL)}>
                      <Icon icon="tdesign:attach" />
                       Click Here to View Previously Uploaded File
                      </p>
                  )}
              </div>
               <div className='d-flex justify-content-center'>
                  <button type='button' className='btn btn-primary graphiBtn' onClick={handleUpdateTask}>
                  {Modalloading ? 'Updating Task...' : 'Update Task'}
                  </button> 
                </div>
            </form> 

        )}

        </Modal.Body>

      </Modal> */}
      
    </div>
  );
};

export default MydataTable;