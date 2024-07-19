// import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from '../APIConfig/ApiContext';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import sampleTruck from '../images/test_truck.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const addDriver = () => {
    const baseUrl = useApi();

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

    function goBackHome(){
        navigate("/Driver");
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
        if (!Mobile) {
            setMobileError("Mobile No. is Required");
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
          IsUpdate: false,
          D_ID: 0,
          EmpName: driverName,
          EMP_ID: EmpId,
          EMP_File: DriverImage, 
          MOBILE: Mobile,
          Driving_Licence: LicNo,
          Driving_Licence_exp_date: formattedLicVal,
          DRIVER_DOB: formattedDOB,
          Date_Of_Joining: formattedDOJ,
          Doc_File: licenseImage,
          Created_by: sessionStorage.getItem('UserId'),
          D_Salary: DSalary
        };
  
        // console.log(body)
  
        const formData = new FormData();
  
        formData.append('IsUpdate', false);
        formData.append('D_ID', 0);
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
        formData.append('Created_by', sessionStorage.getItem('UserId'));
        
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
            setmessageAPI("Driver's Details Added Successfully...")
            setTimeout(() => {
                setLoader(false);
                setshowPopup(true);
            }, 1500);
        }else{
            setmessageAPI('Error in Adding Details...')
            setLoader(false);
            setshowPopup(true);
        }

        }catch (error) {
            console.error('Error updating details', error);
            setLoader(false);
        }
    };

    const cancelEdit = () =>{

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

    const handleMobileChange = (e) => {
        const value = e.target.value.trim(); // Trim any leading or trailing whitespace
        const isValidMobile = /^[6-9]\d{9}$/.test(value); // Validate format: starts with 6, 7, 8, or 9 and has 10 digits
    
        if (!value) {
          setMobile('');
          setMobileError('');
        } else if (isValidMobile) {
          setMobile(value);
          setMobileError('');
        } else {
          setMobile('');
          setMobileError('Invalid Mobile Number...');
        }
      };


  return (
    <section className='dashboard-Mytask' style={{position:'relative'}}>

    {loader && (
        <div className='loaderAdd'>
            <div className="cs-loader">
                <div className="cs-loader-inner">
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
                   
                <>
                  <div className='dashboard-one'>
                    <div className='left-dashboard-one vehicleDetails'>
                        <Icon icon="ic:outline-arrow-back" className='IconVehicleD' onClick={goBackHome} />
                        <h5 className='dashHead m-0'>Add New Driver</h5>
                    </div>
                    <div className='right-dashboard-one'>
                       <div className='d-flex align-items-center justify-content-center gap-2'>
                          <button type='button' className='btn btn-primary graphiBtn' onClick={handelEditSubmit}>Submit</button>
                          <button type='button' className='btn btn-secondary cancelBtn' onClick={cancelEdit}>Reset</button>
                      </div>
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
                               <img src={imageSrc} className="imgSampleDriver" alt="Driver"  />
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

                                  <label htmlFor='fileInput_1' className='custom-file-upload'>
                                    <Icon icon="icon-park-outline:upload-one" />
                                  </label>

                                  <input
                                    type="file"
                                    id='fileInput_1'
                                    className='filedrivers'                                   
                                    onChange={handelDriverImageChange}
                                    accept=".png, .jpeg"  
                                  />
                                  
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
                                    <input type='text' className={`form-control input_VehicleDetails ${driverNameError ? 'is-invalid' : ''}`} onChange={(e) => setdriverName(e.target.value)} minLength={3}  maxLength={40}></input>
                                    {driverNameError && <p className="error-message">{driverNameError}</p>}
                                </div> 
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                <p className='vehicleDPara'>Date of Birth <span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                <DatePicker
                                    selected={selectedDOB}
                                    onChange={handelDOBchange}
                                    className={`form-control input_VehicleDetails ${DOBError ? 'is-invalid' : ''}`}
                                    id='DOBDate'
                                    dateFormat="dd-MM-yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    onFocus={(e) => e.target.blur()}
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
                                    <input type='text' className={`form-control input_VehicleDetails ${EmpIdError ? 'is-invalid' : ''}`} onChange={(e) => setEmpId(e.target.value)} minLength={3}  maxLength={10}></input>
                                    {EmpIdError && <p className="error-message">{EmpIdError}</p>}
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                                <p className='vehicleDPara'>Mobile Number <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                                <input type='number' className={`form-control input_VehicleDetails ${MobileError ? 'is-invalid' : ''}`} onChange={handleMobileChange} min="0" ></input>              
                                {MobileError && <p className="error-message">{MobileError}</p>}
                            </div> 
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                                <p className='vehicleDPara'>Date of Joining <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                                <DatePicker
                                    selected={selectedDOJ}
                                    onChange={handelDOJchange}
                                    className={`form-control input_VehicleDetails ${DOJError ? 'is-invalid' : ''}`}
                                    id='DOJDate'
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    onFocus={(e) => e.target.blur()}
                                />
                            </div> 
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                                <p className='vehicleDPara'>License Number <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                                <input type='text' className={`form-control input_VehicleDetails ${LicNoError ? 'is-invalid' : ''}`} minLength={14} maxLength={16} onChange={(e) => setLicNo(e.target.value)}></input>
                                {LicNoError && <p className="error-message">{LicNoError}</p>}                               
                            </div> 
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                                <p className='vehicleDPara'>License Validity <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                                <DatePicker
                                    selected={selectedLicVal}
                                    onChange={handelLicValchange}
                                    className={`form-control input_VehicleDetails ${LicValError ? 'is-invalid' : ''}`}
                                    id='DOJDate'
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    onFocus={(e) => e.target.blur()}
                                />
                            </div> 
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                              <div className='col-4'>
                                  <p className='vehicleDPara'>Driver Salary <span className='mandatory'>*</span></p>
                              </div>
                              <div className='col-8'>
                                  <input type='number' className={`form-control input_VehicleDetails ${SalaryError ? 'is-invalid' : ''}`} minLength={3} maxLength={10} onChange={(e) => setDSalary(e.target.value)} ></input>              
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
                                  
                                </div>

                              </div>
                              
                            </div>

                        </div>

                      </div>

                    </div>


                  </div>

                </>
            

        </div>
    </section>
  );
};

export default addDriver;