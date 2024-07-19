import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DTtask from './datatabletask';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useApi } from '../APIConfig/ApiContext';
import { Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ListIcon from '../images/ListView.svg';
import CardIcon from '../images/CardView.svg';
import truck from '../images/truck.png';
import regend from '../images/regend.png';
import car from '../images/car.png';
import puc from '../images/puc.png';
import roadtax from '../images/roadtax.png';
import policy from '../images/policy.png';
import permit from '../images/permit.png';
import auth from '../images/auth.png';
import MultiSelectDropdown from './MultiSelectDropdown';

const Vehicle = () => {

  const baseUrl = useApi();

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);

  const [Modalloading, setModalLoading] = useState(false);

  const [refreshComponent, setRefreshComponent] = useState(false);

  const navigate = useNavigate();

  const handleShow = () => {
    // setShowModal(true);
    navigate(`/Vehicle/AddNewVehicle`);
  }
  const handleClose = () =>{
    setTaskName('');
    setTaskTypeId('');
    setSourceTypeId('');
    setProjectId('');
    setFrequencyId('');
    setbudgetHours('');
    setDescription('');
    setSelectedEmployees([]);
    setSelecteStartdDate(null);
    setSelecteEndDate(null);
    setProfileImage(null);
    setShowModal(false);
    setTaskNameError('');
      setTaskTypeError('');
      setGroupError('');
  } 

  const [taskName, setTaskName] = useState('');
  const [taskTypeId, setTaskTypeId] = useState('');
  const [sourceTypeId, setSourceTypeId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [frequencyId, setFrequencyId] = useState('');
  const [budgetHours, setbudgetHours] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [Description, setDescription] = useState('');
  const [selectedStartDate, setSelecteStartdDate] = useState(null);
  const [selectedEndDate, setSelecteEndDate] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const [taskNameError, setTaskNameError] = useState('');
  const [taskTypeError, setTaskTypeError] = useState('');
  const [groupError, setGroupError] = useState('');

  const handleSubmit = async () => {
    try {

      const bearerToken = sessionStorage.getItem('token');

      // Reset error messages
      setTaskNameError('');
      setTaskTypeError('');
      setGroupError('');

      // Validate form fields
      if (!taskName) {
        setTaskNameError('Task Name is required');
        return;
      }

      if (!taskTypeId) {
        setTaskTypeError('Task Type is required');
        return;
      }


      if (selectedRadioButton === 'group' && groupDataSend.length === 0 || selectedRadioButton === 'members'  && selectedEmployees.length === 0) {
        setGroupError('Choose at least one group member');
        return;
      }

      setModalLoading(true);
      
      const employeeId = sessionStorage.getItem('userId');
      // const startdate = formatDate(selectedStartDate);
      // const endDate = formatDate(selectedEndDate);
      const formData = new FormData();
      formData.append('taskName', taskName);
      formData.append('taskTypeId', taskTypeId);
      formData.append('SourceTypeId', sourceTypeId);
      formData.append('projectId', projectId);
      // formData.append('frequencyId', frequencyId);
      // formData.append('budgetedStartDate', startdate);
      // formData.append('budgetedEndDate', endDate);
      // formData.append('budgetedHours', budgetHours);
      formData.append('description', Description);
      formData.append('files', profileImage);
      // formData.append('taskMembers[0].employeeId', employeeId);
      formData.append('ownerId', employeeId);
      formData.append('createdBy', employeeId);
      formData.append('lastupdateBy', employeeId);
      if(selectedRadioButton === 'members'){
        selectedEmployees.forEach((employee, index) => {
          formData.append(`taskMembers[${index}].employeeId`, employee.value);
        });
      }else{
        groupDataSend.forEach((employee, index) => {
          formData.append(`taskMembers[${index}].employeeId`, employee.value);
        });
      }
      
      // Add other form fields...

      const response = await axios.post(
        `${baseUrl}/api/Task`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${bearerToken}`
          }
        }
      );
      console.log('Task added successfully', response.data);
      setRefreshComponent(!refreshComponent);
      setRefresh(!refresh);
      setSelectedEmployees([]);
      handleClose();


      // Optionally, you can handle closing the modal or any other actions here
    } catch (error) {
      console.error('Error adding task', error);
    }finally {
      setModalLoading(false);
    }
  };



  const [selectedTab, setSelectedTab] = useState(0);
  const [taskData, setTaskData] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [projectType, setProjectType] = useState([]);
  const [sourceType, setSourceType] = useState([]);
  const [frequencyType, setFrequencyType] = useState([]);

  const [trucks ,setTruck] = useState(0);
  const [fintess ,setFitness] = useState(0);
  const [pucc ,setPucc] = useState(0);
  const [roadTax ,setRoadTax] = useState(0);
  const [insurance ,setInsurance] = useState(0);
  const [RC ,setRC] = useState(0);
  const [permits ,setPermits] = useState(0);
  const [auths ,setAuths] = useState(0);

  const [vowner, setVowner] = useState({});

  const handleTabSelect = (index) => {
    setSelectedTab(index);
  };

  useEffect(() => {
    const fetchTaskstatusData = async () => {
      try {
        // const ownerId = sessionStorage.getItem('userId');
        // const bearerToken = sessionStorage.getItem('token');

        const data = {
          "TVD_ID": 0
        }

        // console.log(data)

        const taskResponse = await axios.post(`${baseUrl}/api/Vehicle`, data );

        // console.log(taskResponse.data.data.vehicleview)

        const vehicleArray = taskResponse.data.data.vehicleview;

        const vehicleOwnerCount = {};

        vehicleArray.forEach(vehicle => {
          const owner = vehicle.vehicleowner;
          if (vehicleOwnerCount[owner]) {
            vehicleOwnerCount[owner] += 1; // Increment count if already exists
          } else {
            vehicleOwnerCount[owner] = 1; // Initialize with 1 if doesn't exist
          }
        });

        // console.log(vehicleOwnerCount)
        setVowner(vehicleOwnerCount)

        // console.log(taskResponse.data.data)
        // console.log(taskResponse.data.data.vehicleview)
        // console.log(taskResponse.data.data.documenttypecount[0])
        // console.log(taskResponse.data.data.vehicleview[0])
        setTruck(taskResponse.data.data.documenttypecount[0].type_count);
        setFitness(taskResponse.data.data.documenttypecount[1].type_count);
        setPucc(taskResponse.data.data.documenttypecount[2].type_count);
        setRoadTax(taskResponse.data.data.documenttypecount[3].type_count);
        setInsurance(taskResponse.data.data.documenttypecount[4].type_count);
        setRC(taskResponse.data.data.documenttypecount[5].type_count);
        setPermits(taskResponse.data.data.documenttypecount[6].type_count);
        setAuths(taskResponse.data.data.documenttypecount[7].type_count);
        

        setTaskData(taskResponse.data);

        setLoading(false);

      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);

      }
    };
    fetchTaskstatusData();
  },[baseUrl, refreshComponent])

  // const getStatusCounts = () => {
  //   const statusCounts = {};

  //   taskData.forEach(task => {
  //     const statusName = task.status ? task.status.statusName : 'Unknown';

  //     if (statusCounts.hasOwnProperty(statusName)) {
  //       statusCounts[statusName]++;
  //     } else {
  //       statusCounts[statusName] = 1;
  //     }
  //   });

  //   return statusCounts;
  // };

  // const getStatusCounts = () => {
  
  
  //   const statusCounts = { 'Today': 0 }; // Initialize 'Today' count to 0
  
  //     taskData.forEach(task => {
  //     const statusName = task.taskMembers.length > 0
  //     ? task.taskMembers[0].status
  //     ? task.taskMembers[0].status.statusName
  //     : 'Unknown'
  //     : 'Unknown';
      
  //     if (statusCounts.hasOwnProperty(statusName)) {
  //       statusCounts[statusName]++;
  //     } else {
  //       statusCounts[statusName] = 1;
  //     }
  //   });
  
  //   return statusCounts;
  // };

  // const statusCounts = getStatusCounts();

  // function SwitchView(viewTab){
    
  //   if(viewTab == "card"){
  //     document.getElementById('swtichingView').classList.add('cardviewTask');
  //     document.getElementById('swtichingView').classList.remove('listview');
  //     document.querySelector('.tapListicons').classList.remove('activeTapIcon');
  //     document.querySelector('.tapCardicons').classList.add('activeTapIcon');
  //   }else{
  //     document.getElementById('swtichingView').classList.add('listview');
  //     document.getElementById('swtichingView').classList.remove('cardviewTask');
  //     document.querySelector('.tapListicons').classList.add('activeTapIcon');
  //     document.querySelector('.tapCardicons').classList.remove('activeTapIcon');
  //   }
  // }


  const getStatusCodeForTab = (index) => {
    switch (index) {
      case 0:
        return 0; // Replace 'Today' with the actual status code for Today
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
      case 5:
        return 5;
      case 6:
        return 6;
      case 7:
        return 7;
      default:
        return 'Unknown';
    }
  };

  // const [isDropdownOpen, setDropdownOpen] = useState(false);

  // const toggleDropdownMSenu = () => {
  //   setDropdownOpen(!isDropdownOpen);
  // };

  const handleMultiSelectChange = (selectedOptions) => {
    setSelectedEmployees(selectedOptions);
    // console.log(selectedOptions);
  };

  const handleMultiSelectGroupChange = (selectedOptions) => {
    // console.log(selectedOptions);
    const groupMemberEmployeeIds = selectedOptions.flatMap(
      (selectedGroup) => selectedGroup.groupMembers.map((member) => ({ value: member.employeeId }))
    );
    // console.log(groupMemberEmployeeIds)
    setSelectedEmployees(selectedOptions);
    setgroupDataSend(groupMemberEmployeeIds);
  };

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedRadioButton, setSelectedRadioButton] = useState('members');
  const [groupData, setGroupData] = useState([]);
  const [groupDataSend , setgroupDataSend] = useState([]);

  // useEffect(() => {
  //   const fetchEmployeeData = async () => {
  //     try {
  //       const ownerId = sessionStorage.getItem('userId');
  //       const bearerToken = sessionStorage.getItem('token');

  //       const response = await axios.get(`${baseUrl}/api/Employee`, {
  //         headers: {
  //           Authorization: `Bearer ${bearerToken}`,
  //         },
  //         params: {
  //           ownerId: ownerId,
  //         },
  //       });

  //       const formattedOptions = response.data.map((employee) => ({
  //         value: employee.employeeId,
  //         label: `${employee.firstName} ${employee.lastName} (${employee.department.departmentName})`,
  //       }));
  //       setEmployeeOptions(formattedOptions);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching employee data', error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchEmployeeData();
  // }, []);

  // useEffect(() => {
  //   const fetchGroupData = async () => {
  //     try {
  //       const ownerId = sessionStorage.getItem('userId');
  //       const withdefaults = true;
  //       const bearerToken = sessionStorage.getItem('token');
  
  //       const groupResponse = await axios.get(`${baseUrl}/api/Group/Owner/?ownerid=${ownerId}&withdefaults=${withdefaults}`, {
  //         headers: {
  //           Authorization: `Bearer ${bearerToken}`,
  //         },
  //       });
  //       console.log(groupResponse.data)
  //       const formattedOptions = groupResponse.data.map((group) => ({
  //         value: group.groupId,
  //         label: group.groupName,
  //         groupMembers: group.groupMembers,
  //       }));
  
  //       setGroupData(formattedOptions);
        
  //     } catch (error) {
  //       console.error('Error fetching group data', error);
  //     }
  //   };
  
  //   fetchGroupData();
  // }, [baseUrl]);
  

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
            <h5 className='dashHead m-0'>Vehicles dashboard</h5>
            <p className='paraMain m-0'>Managing All Details Here.</p>
        </div>
        <div className='right-dashboard-one'>
            <button type='button' className='btn btn-primary graphiBtn' onClick={handleShow}>+ New Truck</button>
        </div>
      </div>
      {/* <div className='dashboard-two'>
      <div className='box-one-dashboardTwo one' style={{backgroundImage:` url(${twoT})`}}>
          <div className='text-dashboard-two'>
             <h5 className='m-0 display-10'>{statusCounts['Pending'] || 0}</h5>
             <p className='paraBoxup'>Pending</p>
          </div>
        </div>
      <div className='box-one-dashboardTwo two' style={{backgroundImage:` url(${oneT})`}}>
          <div className='text-dashboard-two'>
             <h5 className='m-0 display-10'>{statusCounts['Planned'] || 0}</h5>
             <p className='paraBoxup'>Planned</p>
          </div>
        </div>
        <div className='box-one-dashboardTwo two' style={{backgroundImage:` url(${threeT})`}}>
          <div className='text-dashboard-two'>
             <h5 className='m-0 display-10'>{statusCounts['WIP'] || 0}</h5>
             <p className='paraBoxup'>Work in Progress</p>
          </div>
        </div>
        <div className='box-one-dashboardTwo three' style={{backgroundImage:` url(${fourT})`}}>
          <div className='text-dashboard-two'>
             <h5 className='m-0 display-10'>{statusCounts['Completed'] || 0}</h5>
             <p className='paraBoxup'>Completed</p>
          </div>
        </div>
        <div className='box-one-dashboardTwo four' style={{backgroundImage:` url(${fiveT})`}}>
          <div className='text-dashboard-two'>
             <h5 className='m-0 display-10'>{statusCounts['Closed'] || 0}</h5>
             <p className='paraBoxup'>Closed</p>
          </div>
        </div>
        <div className='box-one-dashboardTwo five' style={{backgroundImage:` url(${sixT})`}}>
          <div className='text-dashboard-two'>
             <h5 className='m-0 display-10'>{statusCounts['Hold'] || 0}</h5>
             <p className='paraBoxup'>Hold</p>
          </div>
        </div>
        <div className='box-one-dashboardTwo six' style={{backgroundImage:` url(${sevenT})`}}>
          <div className='text-dashboard-two'>
             <h5 className='m-0 display-10'>{statusCounts['Overrun'] || 0}</h5>
             <p className='paraBoxup'>Overdue</p>
          </div>
        </div>
      </div> */}
      <div className='dashboard-three'>

        <Tabs selectedIndex={selectedTab} onSelect={handleTabSelect}>
        <div className='tabTop'>
          <TabList className='ul-list-mytask'>
            <Tab className={`li-list-mytask ${selectedTab === 0 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={truck} className='imgDash'></img>
                <div>
                    <h5 className='m-0 display-10'>{trucks}</h5>
                  <span>Vehicles</span>
                </div>
              </div>
            </Tab>
            <Tab className={`li-list-mytask ${selectedTab === 1 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={car} className='imgDash'></img>
                <div>
                  <h5 className='m-0 display-10'>{fintess}</h5>
                  <span>Fitness Ending</span>
                </div>
              </div>
            </Tab>
            <Tab className={`li-list-mytask ${selectedTab === 2 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={puc} className='imgDash'></img>
                <div>
                  <h5 className='m-0 display-10'>{pucc}</h5>
                  <span>PUCC Ending</span>
                </div>
              </div>
            </Tab>
            <Tab className={`li-list-mytask ${selectedTab === 3 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={roadtax} className='imgDash'></img>
                <div>
                  <h5 className='m-0 display-10'>{roadTax}</h5>
                  <span>Road Tax File</span>
                </div>
              </div>
            </Tab>
            <Tab className={`li-list-mytask ${selectedTab === 4 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={policy} className='imgDash'></img>
                <div>
                  <h5 className='m-0 display-10'>{insurance}</h5>
                  <span>Insurance Ending</span>
                </div>
              </div>
            </Tab>
            <Tab className={`li-list-mytask ${selectedTab === 5 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={regend} className='imgDash'></img>
                <div>
                  <h5 className='m-0 display-10'>{RC}</h5>
                  <span>Reg. Ending</span>
                </div>
              </div>
            </Tab>
            <Tab className={`li-list-mytask ${selectedTab === 6 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={permit} className='imgDash'></img>
                <div>
                  <h5 className='m-0 display-10'>{permits}</h5>
                  <span>Permit Ending</span>
                </div>
              </div>
            </Tab>
            <Tab className={`li-list-mytask ${selectedTab === 7 ? 'activeTab' : ''}`}>
              <div className='d-flex align-items-center gap-2'>
                <img src={auth} className='imgDash'></img>
                <div>
                  <h5 className='m-0 display-10'>{auths}</h5>
                  <span>NP Auth Ending</span>
                </div>
              </div>
            </Tab>
          </TabList>
            {/* <div className='d-flex gap-2' style={{cursor:'pointer'}}>
              <img src={ListIcon} className='tapListicons activeTapIcon' onClick={() => SwitchView('list')} />
              <img src={CardIcon} className='tapCardicons' onClick={() => SwitchView('card')} />
            </div> */}
        </div>

        <p className='paraVehicleOwner'>Vehicle Owners Info</p>
        <div className='tabBottom'>
              {Object.entries(vowner).map(([owner, count]) => (
              <div className='vehicleownerdata' key={owner}>
                <p className='vehicleownerpara'>{owner}</p>
                <p className='vehicleownerpara two'>{count}</p>
              </div>
            ))}

        </div>

        {/* <div className='tabTop mobile'>

            <button className='dropdownBtnTask dropdown-toggle' type='button' onClick={toggleDropdownMSenu}>
            Select Status
            </button>
            {isDropdownOpen && (
            <TabList className='ul-list-mytask'>
              <Tab className={`li-list-mytask ${selectedTab === 0 ? 'activeTab' : ''}`}>Pending</Tab>
              <Tab className={`li-list-mytask ${selectedTab === 1 ? 'activeTab' : ''}`}>Planned</Tab>
              <Tab className={`li-list-mytask ${selectedTab === 2 ? 'activeTab' : ''}`}>Work in Progress</Tab>
              <Tab className={`li-list-mytask ${selectedTab === 3 ? 'activeTab' : ''}`}>Completed</Tab>
              <Tab className={`li-list-mytask ${selectedTab === 4 ? 'activeTab' : ''}`}>Closed</Tab>
              <Tab className={`li-list-mytask ${selectedTab === 5 ? 'activeTab' : ''}`}>Hold</Tab>
              <Tab className={`li-list-mytask ${selectedTab === 6 ? 'activeTab' : ''}`}>Overdue</Tab>
            </TabList>
          
            )}
            <div className='d-flex gap-3' style={{cursor:'pointer'}}>
              <img src={ListIcon} className='tapListicons activeTapIcon' onClick={() => SwitchView('list')} />
              <img src={CardIcon} className='tapCardicons' onClick={() => SwitchView('card')} />
            </div>

          </div> */}

          <TabPanel>
            <DTtask tabId={getStatusCodeForTab(0)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
          <TabPanel>
            <DTtask tabId={getStatusCodeForTab(1)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
          <TabPanel>
            <DTtask tabId={getStatusCodeForTab(2)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
          <TabPanel>
            <DTtask tabId={getStatusCodeForTab(3)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
          <TabPanel>
            <DTtask tabId={getStatusCodeForTab(4)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
          <TabPanel>
            <DTtask tabId={getStatusCodeForTab(5)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
          <TabPanel>
            <DTtask tabId={getStatusCodeForTab(6)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
          <TabPanel>
            <DTtask tabId={getStatusCodeForTab(7)} refresh={refresh} setRefresh={setRefresh} />
          </TabPanel>
        </Tabs>
      </div>


      {/* <Modal show={showModal} onHide={handleClose} size="lg" backdrop="static" keyboard={false}>
        <Modal.Header>
          <div></div>
          <div className='text-center'>
            <h4 className='createTask-Head m-0'>Add Task</h4>
            <p className='m-0' style={{fontSize:'12px'}}>Add the required details for the new Tasks</p>
          </div>
          <button type="button" className='closeBtn' onClick={handleClose}>X</button>
        </Modal.Header>
        <Modal.Body>
            <form>
              <div className="form-group mb-2">
                <label className='pb-1 AllLableinProjects' for="AddTask" >Add Task <span style={{color:'red'}}>*</span></label>
                <input type="text" className={`form-control ${taskNameError ? 'is-invalid' : ''}`} id="" aria-describedby="emailHelp" placeholder="Add Task" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                {taskNameError && <p className="error-message">{taskNameError}</p>}
              </div>
              <div className='d-flex gap-3 mb-2'>
                <div className="form-group w-100">
                  <label className='pb-1 AllLableinProjects' for="exampleFormControlSelect1" >Task Type <span style={{color:'red'}}>*</span></label>
                  <select className={`form-control ${taskTypeError ? 'is-invalid' : ''}`} id="exampleFormControlSelect1" value={taskTypeId} onChange={(e) => setTaskTypeId(e.target.value)}>
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
                  <select className="form-control" id="exampleFormControlSelect1" value={sourceTypeId} onChange={(e) => setSourceTypeId(e.target.value)}>
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
                  <select className="form-control" id="exampleFormControlSelect1" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                      <option value="" >Select Project</option>
                      {projectType.map((projectTypes) => (
                        <option key={projectTypes.projectId} value={projectTypes.projectId}>
                          {projectTypes.projectName}
                        </option>
                      ))}
                  </select>
                </div>                
              </div>
              
                
                <div className='d-flex gap-3 mb-2'>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios1"
                        value="group"
                        checked={selectedRadioButton === 'group'}
                        onChange={() => setSelectedRadioButton('group')}
                      />
                      <label className="form-check-label" htmlFor="exampleRadios1">
                        Group 
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios2"
                        value="members"
                        checked={selectedRadioButton === 'members'}
                        onChange={() => setSelectedRadioButton('members')}
                        />
                      <label className="form-check-label" htmlFor="exampleRadios2">
                        Members
                      </label>
                    </div>
                </div>

                <div className='mb-2'>
                  {selectedRadioButton === 'group' ? (
                    <>
                      <label className='pb-1 AllLableinProjects'>Choose Group <span style={{color:'red'}}>*</span></label>
                      <MultiSelectDropdown
                        options={groupData}
                        selectedValues={selectedEmployees}
                        onChange={handleMultiSelectGroupChange}
                      />
                      {groupError && <p className="error-message">{groupError}</p>}
                    </>
                  ) : (
                    <>
                      <label className='pb-1 AllLableinProjects'>Choose Employee <span style={{color:'red'}}>*</span></label>
                      <MultiSelectDropdown
                        options={employeeOptions}
                        selectedValues={selectedEmployees}
                        onChange={handleMultiSelectChange}
                      />
                      {groupError && <p className="error-message">{groupError}</p>}
                    </>
                  )}
               
                </div>

                <div className="form-group mb-2">
                  <label className='pb-1 AllLableinProjects' for="exampleFormControlTextarea1" >Description </label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" rows="1"  placeholder="Add Description" value={Description} onChange={(e) => setDescription(e.target.value)}></textarea>
                  
                </div>
                <div className="input-group mb-3">
                  <label className='pb-1 AllLableinProjects' for="exampleFormControlTextarea1" >Choose File </label>
                  <div className="custom-file w-100 p-1">
                  <input
                  type="file"
                  className="custom-file-input"
                  id="profileImage"
                  onChange={handleProfileImageChange}
                  required
                  />
                  </div>
                  
                </div>
                <div className='d-flex justify-content-center'>
                  <button type='button' className='btn btn-primary graphiBtn' onClick={handleSubmit}>
                  {Modalloading ? 'Adding Task...' : 'Add Task'}
                  </button> 
                </div> 
            </form>

        </Modal.Body>

      </Modal> */}

    </section>
  );
};

export default Vehicle;