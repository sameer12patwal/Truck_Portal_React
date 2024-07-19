import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from '../APIConfig/ApiContext';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import sampleTruck from '../images/test_truck.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const viewDriverDetail = () => {
    const baseUrl = useApi();

    const { D_ID } = useParams();
    const [taskData, setTaskData] = useState(null);
    const [isDisabled, setDisabled] = useState(true);
    const [showButtons, setShowButtons] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setshowPopup] = useState(false);
    const [messageAPI, setmessageAPI] = useState('');

    const [driverName, setdriverName] = useState(null);
    const [selectedDOB, setselectedDOB] = useState(null);
    const [selectedLicVal, setselectedLicVal] = useState(null);
    const [selectedDOJ, setselectedDOJ] = useState(null);
    const [EmpId, setEmpId] = useState(null);
    const [Mobile, setMobile] = useState(null);
    const [LicNo , setLicNo] = useState(null);
    const [licenseImage, setLicenseImage] = useState(null);
    const [DriverImage, setDriverImage] = useState(null);
    const [DSalary, setDSalary] = useState(null);


    const [driverNameError , setdriverNameError] = useState('');
    const [DOBError, setDOBError] = useState('');
    const [DOJError, setDOJError] = useState('');
    const [LicValError, setLicValError] = useState('');
    const [EmpIdError , setEmpIdError] = useState('');
    const [MobileError , setMobileError] = useState('');
    const [LicNoError, setLicNoError] = useState('');
    const [SalaryError , setSalaryError] = useState('');


    const navigate = useNavigate();

    // console.log(D_ID)

    useEffect(() => {
        const fetchGroupData = async () => {
          try {
            // const bearerToken = sessionStorage.getItem('token');
            const reqBody = {
              "D_Id": D_ID
            }
            const response = await axios.post(`${baseUrl}/api/Driver/Get_DriverDetails`, reqBody);

            console.log(response.data.data)

            // const formatDate = (dateString) => {
            //     const dateObject = new Date(dateString);
            //     const day = dateObject.getDate().toString().padStart(2, '0');
            //     const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Note: Month is zero-based, so we add 1
            //     const year = dateObject.getFullYear();
              
            //     return `${day}-${month}-${year}`;
            // };

            // const formattedDOB = formatDate(response.data.data.driveR_DOB);

            setTaskData(response.data.data);
            setdriverName(response.data.data.emp_Name);
            setselectedDOB(response.data.data.driveR_DOB);
            setselectedLicVal(response.data.data.driving_Licence_exp_date);
            setselectedDOJ(response.data.data.date_Of_Joining);
            setEmpId(response.data.data.emP_ID);
            setMobile(response.data.data.mobile);
            setLicNo(response.data.data.driving_Licence);
            setLicenseImage(response.data.data.doc_Path);
            setDriverImage(response.data.data.empPath);
            setDSalary(response.data.data.d_Salary);
            
            
            // console.log(response.data.data.vehicle_Info[0])
            // const taskMemberNames = response.data.taskMembers.map(member => ({
            //   name: `${member.employee.firstName} ${member.employee.lastName}`,
            //   status: member.status // Assuming the status property is directly under taskMember
            // }));
            // console.log(taskMemberNames)
            // settaskMember(taskMemberNames);
          } catch (error) {
            console.error('Error fetching data', error);
          }
        };
        fetchGroupData();
      }, [D_ID, baseUrl, refresh]); // Include dependencies in the dependency array

      

      useEffect(() => {
        // console.log(taskData);
      }, [taskData]);

    function goBackHome(){
        navigate("/Driver");
    }

    const openAttachment = (documentPath) => {
      if (documentPath) {

        const fullURL = `${baseUrl}/${documentPath}`;
        window.open(fullURL, '_blank');
      }
    };

    const EditDetails = () => {
      setDisabled(false);
      setShowButtons(true);

    }

    const handelEditSubmit = async () => {

      try{

       setdriverNameError('');
       setDOBError('');
       setDOJError('');
       setLicValError('');
       setEmpIdError('');
       setMobileError('');
       setLicNoError('');
       setSalaryError('');


        if (!driverName) {
            setdriverNameError('Driver Name is Required');
            return;
        }
        if (driverName.length < 3 || driverName.length > 40) {
            setdriverNameError('Driver name must be between 3 and 40 characters');
            return;
        }
        if (!selectedDOB) {
            setDOBError('Date Required');
            return;
        }
        if (!EmpId) {
            setEmpIdError('Employee ID is Required');
            return;
        }
        if (EmpId.length < 3 || EmpId.length > 10) {
            setdriverNameError('Employee Code must be between 3 and 10 characters');
            return;
        }
        const isValidMobile = /^[6-9]\d{9}$/.test(Mobile); 
        if (!Mobile) {
            setMobileError("Mobile No. is Required");
            return;
        }
        if(!isValidMobile){
            setMobileError("Enter Corrected Mobile Number");
            return;
        }
        if (!selectedDOJ) {
            setDOJError('Date Required');
            return;
        }
        if (!LicNo) {
            setLicNoError("License Number is Required ");
            return;
        }
        const LicRegex = /^[a-zA-Z0-9]{14,16}$/;
            if (!LicRegex.test(LicNo)) {
            setLicNoError('Invalid License Number Entered');
            return;
        }
        if (!selectedLicVal) {
            setLicValError('Date Required');
            return;
        }
        if (!DSalary) {
          setSalaryError('Driver Salary Required');
          return;
      }

        setLoader(true);

        const DOBdate = new Date(selectedDOB);
        const formattedDOB = DOBdate.getFullYear() + '-' + 
                      String(DOBdate.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(DOBdate.getDate()).padStart(2, '0');

        const DOJdate = new Date(selectedDOJ);
        const formattedDOJ = DOJdate.getFullYear() + '-' + 
                      String(DOJdate.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(DOJdate.getDate()).padStart(2, '0');

        const LicVal = new Date(selectedLicVal);
        const formattedLicVal = LicVal.getFullYear() + '-' + 
                      String(LicVal.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(LicVal.getDate()).padStart(2, '0');

        const body = {
            IsUpdate: true,
            D_ID: D_ID,
            EmpName: driverName,
            EMP_ID: EmpId,
            EMP_File: DriverImage, 
            MOBILE: Mobile,
            Driving_Licence: LicNo,
            Driving_Licence_exp_date: formattedLicVal,
            DRIVER_DOB: formattedDOB,
            Date_Of_Joining: formattedDOJ,
            D_Salary: DSalary,
            Doc_File: licenseImage,
            Updated_by: sessionStorage.getItem('UserId')
        };
  
        // console.log(body)
  
        const formData = new FormData();
  
        formData.append('IsUpdate', true);
        formData.append('D_ID', D_ID);
        formData.append('EmpName', driverName);
        formData.append('EMP_ID', EmpId);
        formData.append('EMP_File', DriverImage);
        formData.append('MOBILE', Mobile);
        formData.append('Driving_Licence', LicNo);
        formData.append('Driving_Licence_exp_date', formattedLicVal);
        formData.append('DRIVER_DOB', formattedDOB);
        formData.append('Date_Of_Joining', formattedDOJ);
        formData.append('D_Salary', DSalary);
        formData.append('Doc_File', licenseImage);
        formData.append('Updated_by', sessionStorage.getItem('UserId'));
        
  
  
        const response = await axios.post(
          `${baseUrl}/api/Driver/Post_Driver`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        console.log('details updated successfully', response.data);
        if(response.status === 200){
          setmessageAPI('Details Updated Successfully...')
          setTimeout(() => {
              setLoader(false);
              setshowPopup(true);
          }, 1500);
        }else{
          setmessageAPI('Error in updating details')
          setLoader(false);
          setshowPopup(true);
        }

      }catch (error) {
        console.error('Error updating details', error);
      }
      

    };

    const cancelEdit = () =>{
    //     setDisabled(true)
    //     setShowButtons(false);
    //     setdriverNameError('');
    //     setDOBError('');
    //     setDOJError('');
    //     setLicValError('');
    //     setEmpIdError('');
    //     setMobileError('');
    //     setLicNoError('');
    //   if(refresh === false){
    //     setRefresh(true);
    //   }else{
    //     setRefresh(false)
    //   }
    window.location.reload();
    }

    const handelDOBchange = (date) =>{
        // const formattedDate = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0] : null;
        // console.log(formattedDate)
        // console.log(date);
        setselectedDOB(date);
    }

    const handelDOJchange = (date) =>{
        // const formattedDate = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0] : null;
        // console.log(formattedDate)
        // console.log(date);
        setselectedDOJ(date);
    }
    const handelLicValchange = (date) =>{
        // const formattedDate = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0] : null;
        // console.log(formattedDate)
        // console.log(date);
        setselectedLicVal(date);
    }

    const handelLicenseImageChange = (e) => {
        const file = e.target.files[0];
        setLicenseImage(file);
    }

    const [imageSrc, setImageSrc] = useState(null);

    const handelDriverImageChange = (e) => {
        const file = e.target.files[0];
        setDriverImage(file);
        if (file && file.type.startsWith('image/')) {
            // Generate a URL for the file
            const src = URL.createObjectURL(file);
            setImageSrc(src);
          }
    }


    const okButtonClicked = () =>{
      window.location.reload();
    }


  return (
    <section className='dashboard-Mytask' style={{position:'relative'}}>

        {loader && (
            <div className='loaderAdd'>
                <div class="cs-loader">
                    <div class="cs-loader-inner">
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                    </div>
                </div>
            </div>
        )}

        {showPopup && (

            <div className='popupAdd'>
                <div className='popupBox'>
                    <p className='messageAPI'>{messageAPI}</p>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={okButtonClicked}>Ok</button>
                </div>
            </div>

        )}

        <div className='groupDetails-box' style={{height:'92vh'}}>
           
            {taskData ? (
                <>
                  <div className='dashboard-one'>
                    <div className='left-dashboard-one vehicleDetails'>
                        <Icon icon="ic:outline-arrow-back" className='IconVehicleD' onClick={goBackHome} />
                        <h5 className='dashHead m-0'>Driver Details</h5>
                    </div>
                    <div className='right-dashboard-one'>
                        <button type='button' className='btn btn-primary graphiBtn' onClick={EditDetails} >Edit Details</button>
                    </div>
                  </div>
                  <div className='dashboard-three' style={{height:'80vh'}}>
                    <div className='vehicleD_up'>
                      <p className='paraVD_up'>Driver Details</p>
                    </div>
                    <div className='row d-flex p-2'>
                      <div className='col-4'>
                        <div className='image_Driver'>
                        
                           {/* <img src={sampleTruck} className='imgSampleTruck'></img> */}
                          <>
                            {DriverImage ? (
                                <>
                                    <img src={DriverImage instanceof File ? imageSrc : `http://103.55.63.14:8229/${DriverImage}`} className="imgSampleDriver" alt="Driver"  />
                                    <a href={DriverImage instanceof File ? URL.createObjectURL(DriverImage) : `http://103.55.63.14:8229/${DriverImage}`} download="driver_image.jpg" className='imgDriverDownload'>
                                      <Icon icon="solar:maximize-square-minimalistic-linear" />
                                    </a>
                                </>
                               ) : (
                               <Icon icon="mingcute:user-4-line" />
                            )}
                          </>
                           

                        </div>
                            <div className='d-flex mb-3 mt-3 align-items-center justify-content-between'>
                              <div className='d-flex gap-2'>
                                <Icon icon="ep:document" /> 
                                <p className='vehicleDPara'>Driver's Image</p>
                              </div>

                              <div className='d-flex align-items-center gap-3'>
                                <div className='d-flex align-items-center'>

                                {showButtons && (
                                <>
                                  <label htmlFor='fileInput_0' className='custom-file-upload'>
                                    <Icon icon="icon-park-outline:upload-one" />
                                  </label>

                                  <input
                                    type="file"
                                    id='fileInput_1'
                                    className='filedrivers'                                   
                                    onChange={handelDriverImageChange}
                                    accept=".png, .jpeg"  
                                  />
                                  </>
                                )}
                                </div>

                              </div>
                              
                            </div>
                      </div>

                      <div className='col-4'>

                        <div className='vehicle_impDetails'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Driver Name <span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className={`form-control input_VehicleDetails ${driverNameError ? 'is-invalid' : ''}`} value={driverName} onChange={(e) => setdriverName(e.target.value)} minLength={3}  maxLength={40} disabled={isDisabled}></input>
                                    {driverNameError && <p className="error-message">{driverNameError}</p>}
                                </div> 
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                <p className='vehicleDPara'>Date of Birth <span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                <DatePicker
                                    selected={selectedDOB ? new Date(selectedDOB) : null}
                                    onChange={handelDOBchange}
                                    className={`form-control input_VehicleDetails ${DOBError ? 'is-invalid' : ''}`}
                                    id='DOBDate'
                                    dateFormat="dd-MM-yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    onFocus={(e) => e.target.blur()}
                                    disabled={isDisabled}
                                    />
                                </div>
                            </div>

                            {/* <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                <p className='vehicleDPara'>Department <span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <select className={`form-select input_VehicleDetails ${fuelError ? 'is-invalid' : ''}`} onChange={(e) => setfuel(e.target.value)}>
                                        <option value="">Select Department</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="CNG">CNG</option>
                                        <option value="Electric">Electric</option>
                                    </select>
                                    {fuelError && <p className="error-message">{fuelError}</p>}
                                </div>
                            </div> */}

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Employee ID <span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className={`form-control input_VehicleDetails ${EmpIdError ? 'is-invalid' : ''}`} value={EmpId} onChange={(e) => setEmpId(e.target.value)} minLength={3}  maxLength={10} disabled={isDisabled}></input>
                                    {EmpIdError && <p className="error-message">{EmpIdError}</p>}
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Mobile Number <span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='number' className={`form-control input_VehicleDetails ${MobileError ? 'is-invalid' : ''}`} value={Mobile || ''}  onChange={(e) => setMobile(e.target.value)} min="0" disabled={isDisabled}></input>              
                                    {MobileError && <p className="error-message">{MobileError}</p>}
                                </div> 
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                                <p className='vehicleDPara'>Date of Joining <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                                <DatePicker
                                    selected={selectedDOJ ? new Date(selectedDOJ) : null}
                                    onChange={handelDOJchange}
                                    className={`form-control input_VehicleDetails ${DOJError ? 'is-invalid' : ''}`}
                                    id='DOJDate'
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    onFocus={(e) => e.target.blur()}
                                    disabled={isDisabled}
                                />
                            </div> 
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                                <p className='vehicleDPara'>License Number <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                                <input type='text' className={`form-control input_VehicleDetails ${LicNoError ? 'is-invalid' : ''}`} value={LicNo} onChange={(e) => setLicNo(e.target.value)} disabled={isDisabled}></input>
                                {LicNoError && <p className="error-message">{LicNoError}</p>}                               
                            </div> 
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                                <p className='vehicleDPara'>License Validity <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                                <DatePicker
                                    selected={selectedLicVal ? new Date(selectedLicVal) : null}
                                    onChange={handelLicValchange}
                                    className={`form-control input_VehicleDetails ${LicValError ? 'is-invalid' : ''}`}
                                    id='DOJDate'
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    onFocus={(e) => e.target.blur()}
                                    disabled={isDisabled}
                                />
                            </div> 
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                                <p className='vehicleDPara'>Driver Salary <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                                <input type='number' className={`form-control input_VehicleDetails ${SalaryError ? 'is-invalid' : ''}`} value={DSalary} minLength={3} maxLength={10} onChange={(e) => setDSalary(e.target.value)} disabled={isDisabled}></input>              
                                {SalaryError && <p className="error-message">{SalaryError}</p>}
                            </div> 
                            </div>

                        </div>

                        {/* <hr style={{margin:'1.5rem 0'}}></hr> */}

                      </div>

                      <div className='col-4'>

                        <p className='vehicle_docs'>Driver's Documents</p>

                        <div>

                            <div className='d-flex mb-3 align-items-center justify-content-between'>
                              <div className='d-flex gap-2'>
                                <Icon icon="ep:document" /> 
                                <p className='vehicleDPara'>Driving License</p>
                              </div>

                              <div className='d-flex align-items-center gap-3'>
                                <div className='d-flex align-items-center'>

                                {showButtons && (
                                <>
                                  <label htmlFor='fileInput_0' className='custom-file-upload'>
                                    <Icon icon="icon-park-outline:upload-one" />
                                  </label>

                                  <input
                                    type="file"
                                    id='fileInput_0'
                                    className='fileUpload'                                   
                                    onChange={handelLicenseImageChange}
                                    accept=".png, .jpeg"  
                                  />
                                  </>
                                )}
                                </div>
                                {taskData?.doc_Path ? (
                                    <Icon icon="lucide:view" className='viewAttachment' onClick={() => openAttachment(taskData.doc_Path)} />
                                  ) : (
                                    <Icon icon="lucide:view" className='noAttachment' disabled />
                                  )}

                              </div>
                              
                            </div>

                        </div>

                      </div>

                    </div>

                    {showButtons && (
                      <div className='d-flex align-items-center justify-content-center gap-2'>
                          <button type='button' className='btn btn-primary graphiBtn' onClick={handelEditSubmit}>Submit</button>
                          <button type='button' className='btn btn-secondary cancelBtn' onClick={cancelEdit}>Reset</button>
                      </div>
                    )}

                  </div>

                </>
            ) : (
                <p>Loading...</p> 
            )}

        </div>
    </section>
  );
};

export default viewDriverDetail;