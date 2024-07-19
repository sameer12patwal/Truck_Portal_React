import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from '../APIConfig/ApiContext';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import sampleTruck from '../images/test_truck.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';

const viewTaskGroup = () => {
    const baseUrl = useApi();

    const { V_ID } = useParams();
    const [taskData, setTaskData] = useState(null);
    const [isDisabled, setDisabled] = useState(true);
    const [showButtons, setShowButtons] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setshowPopup] = useState(false);
    const [messageAPI, setmessageAPI] = useState('');
    const [exportData, setExportData] = useState([]);

    const [lorryNo, setlorryNo] = useState();
    const [vehiclE_OWNER, setvehiclE_OWNER] = useState();
    const [modeL_NO, setmodeL_NO] = useState();
    const [chasiS_NUMBER, setchasiS_NUMBER] = useState();
    const [size, setsize] = useState();
    const [sizeMeasure, setsizeMeasure] = useState(null);
    const [tankSize , settankSize] = useState();
    const [tankMeasure, settankMeasure] = useState();
    const [fuel, setfuel] = useState();
    const [modeL_YEAR, setmodeL_YEAR] = useState();
    const [vRent, setvRent] = useState();
    const [TruckImage, setTruckImage] = useState(null);

    const [lorryError , setlorryError] = useState('');
    const [vehicleOwnerError , setvehicleOwnerError] = useState('');
    const [modelnoError , setmodelnoError] = useState('');
    const [chasisError , setchasisError] = useState('');
    const [sizeError , setsizeError] = useState('');
    const [sizeMeasureError , setsizeMeasureError] = useState('');
    const [TanksizeError, setTanksizeError] = useState('');
    const [TankMeasureError, setTankMeasureError] = useState('');
    const [fuelError , setfuelError] = useState('');
    const [MyearError , setMyearError] = useState('');
    const [dateError, setDateError] = useState('');
    const [vRentError, setvRentError] = useState('');


    const navigate = useNavigate();

    // console.log(V_ID)

    useEffect(() => {
        const fetchGroupData = async () => {
          try {
            // const bearerToken = sessionStorage.getItem('token');
            const reqBody = {
              "V_Id": V_ID
            }
            const response = await axios.post(`${baseUrl}/api/VehicleDetail`, reqBody);
            
            setTaskData(response.data.data.vehicle_Info[0]);
            setlorryNo(response.data.data.vehicle_Info[0].lorY_NO);
            setvehiclE_OWNER(response.data.data.vehicle_Info[0].vehiclE_OWNER);
            setmodeL_NO(response.data.data.vehicle_Info[0].modeL_NO);
            setchasiS_NUMBER(response.data.data.vehicle_Info[0].chasiS_NUMBER);
            setsize(response.data.data.vehicle_Info[0].size);
            const sizeMeasureValueFromDatabase = response.data.data.vehicle_Info[0].sizE_MEASUREMENT.trim();
            setsizeMeasure(sizeMeasureValueFromDatabase);
            setfuel(response.data.data.vehicle_Info[0].fuel);
            const modalYearValueFromDatabase = response.data.data.vehicle_Info[0].modeL_YEAR.trim();
            setmodeL_YEAR(modalYearValueFromDatabase);
            settankSize(response.data.data.vehicle_Info[0].tank)
            const tankMeasureValueFromDatabase = response.data.data.vehicle_Info[0].tanK_MEASUREMENT.trim();
            settankMeasure(tankMeasureValueFromDatabase);
            setvRent(response.data.data.vehicle_Info[0].v_rent)
            // console.log(response.data.data.vehicle_Info[0]);
            setTruckImage(response.data.data.vehicle_Info[0].truck_Img_path)
            // const taskMemberNames = response.data.taskMembers.map(member => ({
            //   name: `${member.employee.firstName} ${member.employee.lastName}`,
            //   status: member.status // Assuming the status property is directly under taskMember
            // }));
            // console.log(taskMemberNames)
            setExportData(response.data.data.vehicle_Info);
            // settaskMember(taskMemberNames);
          } catch (error) {
            console.error('Error fetching data', error);
          }
        };
        fetchGroupData();
      }, [V_ID, baseUrl, refresh]); // Include dependencies in the dependency array

      useEffect(() => {
        // console.log(taskData);
      }, [taskData]);

    function goBackHome(){
        navigate("/Vehicle");
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

        setlorryError('');
        setvehicleOwnerError('');
        setmodelnoError('');
        setchasisError('');
        setsizeError('');
        setsizeMeasureError('');
        setfuelError('');
        setMyearError('');
        setDateError('');
        setTanksizeError('');
        setTankMeasureError('');
        setvRent('');

        if (!lorryNo) {
          setlorryError('Lorry No. is required');
          return;
        }
        if (lorryNo.length < 9 || lorryNo.length > 15) {
            setlorryError('Lorry No. must be between 9 and 15 characters');
            return;
        }
        if (!vehiclE_OWNER) {
            setvehicleOwnerError('Owner details required');
            return;
        }
        if (vehiclE_OWNER.length < 5 || vehiclE_OWNER.length > 40) {
            setvehicleOwnerError('Vehicle Owner must be between 5 and 40 characters');
            return;
        }
        if (!modeL_NO) {
            setmodelnoError('Model No. is required');
            return;
        }
        if (modeL_NO.length < 5 || modeL_NO.length > 40) {
            setmodelnoError('Model No. must be between 5 and 40 characters');
            return;
        }
        // if (!chasiS_NUMBER) {
        //     setchasisError('Chasis No. is required');
        //     return;
        // }
        const chasisRegex = /^[a-zA-Z0-9]{16,18}$/;
          if (!chasisRegex.test(chasiS_NUMBER)) {
          setchasisError('Chasis No. must be alphanumeric and between 16 to 18 characters.');
          return;
        }
        if (!size) {
          setsizeError("Size is required & it can't be less than 0 ");
          return;
        }
        if (!sizeMeasure) {
          setsizeMeasureError("Size Measure is Required");
          return;
        }
        if (!tankSize) {
          setTanksizeError("Tank Size is required & it can't be less than 0 ");
          return;
        }
        if (!tankMeasure) {
            setTankMeasureError('Tank Measure is required');
            return;
        }
        if (!fuel) {
            setfuelError('Fuel Details required');
            return;
        }
        if (!modeL_YEAR) {
          setMyearError("can't be empty & year range from 2000 to 2024");
          return;
        }
        if (!vRent || vRent.length < 3 ) {
          setvRentError("Vehicle Rent required");
          return;
        }
        if (parseFloat(vRent) <= 0) {
          setvRentError("Vehicle Rent cannot be negative or zero");
          return;
        }
        if (taskData.vehicle_doc[0].documentenddate === null) {
            setDateError('Date is required');
            return;
        }

        setLoader(true);

        const body = {
          VId: V_ID,
          LORY_NO: lorryNo,
          VEHICLE_OWNER: vehiclE_OWNER,
          MODEL_NO: modeL_NO,
          CHASIS_NUMBER: chasiS_NUMBER,
          SIZE: size,
          SIZE_MEASUREMENT: sizeMeasure,
          TANK: tankSize,
          TANK_MEASUREMENT: tankMeasure,
          FUEL: fuel,
          MODEL_YEAR: modeL_YEAR,
          v_rent: vRent,
          Truck_file: TruckImage,
          Data: taskData.vehicle_doc.map(doc => ({
            TVD_ID: doc.tvD_ID,
            DOCUMENTNAME: doc.documentname,
            DOCUMENT_END_DATE: doc.documentenddate,
            document: doc.documentpath
          }))
        };
  
        // console.log(body)
  
        const formData = new FormData();
  
        formData.append('VId', V_ID);
        formData.append('LORY_NO', lorryNo);
        formData.append('VEHICLE_OWNER', vehiclE_OWNER);
        formData.append('MODEL_NO', modeL_NO);
        formData.append('CHASIS_NUMBER', chasiS_NUMBER);
        formData.append('SIZE', size);
        formData.append('SIZE_MEASUREMENT', sizeMeasure);
        formData.append('TANK', tankSize);
        formData.append('TANK_MEASUREMENT', tankMeasure);
        formData.append('FUEL', fuel);
        formData.append('MODEL_YEAR', modeL_YEAR);
        formData.append('v_rent', vRent);
        formData.append('Truck_file', TruckImage);
        taskData.vehicle_doc.forEach((doc, index) => {
          // Check if doc.documentenddate is not null, undefined, or an empty string
          if (doc.documentenddate != null && doc.documentenddate !== "") {
            formData.append(`Data[${index}].TVD_ID`, doc.tvD_ID);
            formData.append(`Data[${index}].DOCUMENTNAME`, doc.documentname);
            formData.append(`Data[${index}].DOCUMENT_END_DATE`, doc.documentenddate);
            formData.append(`Data[${index}].document`, doc.documentpath);
        
            // If you want to append doc.documentpath when it is not null or undefined
            // if (doc.documentpath != null) {
            //   formData.append(`Data[${index}].DOCUMENT_PATH`, doc.documentpath);
            // }
        
            // console.log(doc.documentenddate);
          }
        });
        
  
  
        const response = await axios.post(
          `${baseUrl}/api/Vehicle_form`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        console.log('details updated successfully', response.data);
        if(response.status === 200){
          setmessageAPI('Vehicle Updated Successfully...')
          setTimeout(() => {
              setLoader(false);
              setshowPopup(true);
          }, 1500);
        }else{
          setmessageAPI('Error in updating vehicle details')
          setLoader(false);
          setshowPopup(true);
        }

      }catch (error) {
        console.error('Error updating details', error);
      }
      

    };

    const cancelEdit = () =>{
        setDisabled(true)
        setShowButtons(false);
        setlorryError('');
        setvehicleOwnerError('');
        setmodelnoError('');
        setchasisError('');
        setsizeError('');
        setfuelError('');
        setMyearError('');
        setDateError('');
        setvRent('');
      if(refresh === false){
        setRefresh(true);
      }else{
        setRefresh(false)
      }
    }

    const handleDateChange = (date, index) => {
      const formattedDate = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0] : null;
    
      const updatedVehicleDoc = [...taskData.vehicle_doc];
      updatedVehicleDoc[index].documentenddate = formattedDate;
    
      setTaskData({ ...taskData, vehicle_doc: updatedVehicleDoc });
    };
    


    const handleAttachmentChange = (e, index) => {
      const file = e.target.files[0];
    
      // Log the file information
      // console.log(`File selected for ${taskData?.vehicle_doc?.[index]?.documentname}:`, file);

      const updatedFiles = [...taskData.vehicle_doc];
      updatedFiles[index].documentpath = file;

      setTaskData({ ...taskData, vehicle_doc: updatedFiles });
  
    };

    const okButtonClicked = () =>{
      window.location.reload();
    }

  const [imageSrc, setImageSrc] = useState(null);

  const handelTruckImageChange = (e) => {
      const file = e.target.files[0];
      setTruckImage(file);
      if (file && file.type.startsWith('image/')) {
          // Generate a URL for the file
          const src = URL.createObjectURL(file);
          setImageSrc(src);
        }
  }

const handleExport = () => {
    if (!Array.isArray(exportData)) {
        console.error('exportData is not an array');
        alert('Export data is not available.');
        return;
      }
    
    //   console.log(exportData);
    
    // Define headers
    const headers = [
        'LORRY NO.','VEHICLE OWNER','MODEL NO.','CHASIS NUMBER','VEHICLE SIZE','TANK SIZE','VEHICLE FUEL','MODEL YEAR','VEHICLE RENT','FITNESS REGISTRATION','PUCC','ROAD TAX', 'ISURANCE', 'RC','PERMIT'];

    // Transform each task object into the desired row format
    const rowData = exportData.map(task => [
        task.lorY_NO,
        task.vehiclE_OWNER,
        task.modeL_NO,
        task.chasiS_NUMBER,
        `${task.size} ${task.sizE_MEASUREMENT}`,
        task.fuel,
        task.modeL_YEAR,
        `${task.tank} ${task.tanK_MEASUREMENT}`,
        task.v_rent, 
        formatTimestampToDDMMYYYY(task.vehicle_doc[0].documentenddate),
        formatTimestampToDDMMYYYY(task.vehicle_doc[1].documentenddate),
        formatTimestampToDDMMYYYY(task.vehicle_doc[2].documentenddate),
        formatTimestampToDDMMYYYY(task.vehicle_doc[3].documentenddate),
        formatTimestampToDDMMYYYY(task.vehicle_doc[4].documentenddate),
        formatTimestampToDDMMYYYY(task.vehicle_doc[5].documentenddate)
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
    XLSX.writeFile(workbook, `Export_VEHICLES_DATA_${exportData[0].lorY_NO}_${new Date().toISOString()}.xlsx`);
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
           
            {taskData ? (
                <>
                  <div className='dashboard-one'>
                    <div className='left-dashboard-one vehicleDetails'>
                        <Icon icon="ic:outline-arrow-back" className='IconVehicleD' onClick={goBackHome} />
                        <h5 className='dashHead m-0'>Vehicles Details</h5>
                    </div>
                    <div className='right-dashboard-one'>
                        <button type='button' className='btn btn-primary graphiBtn' onClick={handleExport} style={{marginRight:'10px'}}>Export Data</button>
                        <button type='button' className='btn btn-primary graphiBtn' onClick={EditDetails} >Edit Details</button>
                    </div>
                  </div>
                  <div className='dashboard-three' style={{height:'80vh'}}>
                    <div className='vehicleD_up'>
                      <p className='paraVD_up'>Vehicle Details</p>
                    </div>
                    <div className='row d-flex p-2'>
                      <div className='col-4'>
                        <div className='image_Vehile'>
                           {/* <img src={sampleTruck} className='imgSampleTruck'></img> */}
                           <>
                            {TruckImage ? (
                               <img src={TruckImage instanceof File ? imageSrc : `http://103.55.63.14:8229/${TruckImage}`} className="imgSampleTruck" alt="Driver"  />
                            ) : (
                              <img src={sampleTruck} className='imgSampleTruck'></img>
                            )}
                          </>
                        </div>

                        <div className='d-flex mb-3 mt-3 align-items-center justify-content-between'>
                            <div className='d-flex gap-2'>
                              <Icon icon="ep:document" /> 
                              <p className='vehicleDPara'>Vehicle's Image</p>
                            </div>

                            <div className='d-flex align-items-center gap-3'>
                              <div className='d-flex align-items-center'>

                              {showButtons && (
                              <>
                                <label htmlFor='fileInput_10' className='custom-file-upload'>
                                  <Icon icon="icon-park-outline:upload-one" />
                                </label>

                                <input
                                  type="file"
                                  id='fileInput_10'
                                  className='filedrivers'                                   
                                  onChange={handelTruckImageChange}
                                  accept=".png, .jpeg"  
                                />
                                </>
                              )}
                              </div>
                            </div>                              
                        </div>

                        <div className='vehicle_impDetails'>

                          <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                              <p className='vehicleDPara'>Lory No. <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                              <input type='text' className={`form-control input_VehicleDetails ${lorryError ? 'is-invalid' : ''}`} value={lorryNo} minLength={9}  maxLength={15}  onChange={(e) => setlorryNo(e.target.value)} disabled={isDisabled}></input>
                              {lorryError && <p className="error-message">{lorryError}</p>}
                            </div> 
                          </div>

                          <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                              <p className='vehicleDPara'>Vehicle Owner <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                              <input type='text' className={`form-control input_VehicleDetails ${vehicleOwnerError ? 'is-invalid' : ''}`} value={vehiclE_OWNER} minLength={5}  maxLength={40} onChange={(e) => setvehiclE_OWNER(e.target.value)} disabled={isDisabled}></input>
                              {vehicleOwnerError && <p className="error-message">{vehicleOwnerError}</p>}
                            </div>
                          </div>

                          <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                              <p className='vehicleDPara'>Model No.</p>
                            </div>
                            <div className='col-8'>
                              <input type='text' className={`form-control input_VehicleDetails ${modelnoError ? 'is-invalid' : ''}`} value={modeL_NO} minLength={5}  maxLength={40} onChange={(e) => setmodeL_NO(e.target.value)} disabled={isDisabled}></input>
                              {modelnoError && <p className="error-message">{modelnoError}</p>}
                            </div>
                          </div>

                          <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                              <p className='vehicleDPara'>Chasis No. <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                              <input type='text' className={`form-control input_VehicleDetails ${chasisError ? 'is-invalid' : ''}`} value={chasiS_NUMBER} minLength={16} maxLength={18} onChange={(e) => setchasiS_NUMBER(e.target.value)} disabled={isDisabled}></input>
                              {chasisError && <p className="error-message">{chasisError}</p>}
                            </div>
                          </div>

                          <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                              <p className='vehicleDPara'>Vehicle Size <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-4'>
                              <input type='text' className={`form-control input_VehicleDetails ${sizeError ? 'is-invalid' : ''}`} value={size} onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const value = parseInt(inputValue, 10);
                                    
                                    if (inputValue.length <= 4 && /^\d*$/.test(inputValue) && !isNaN(value) && value >= 0) {
                                    // Update state if input value is valid and has length less than or equal to 4
                                    setsize(inputValue);
                                    setsizeError(''); // Clear error message if input is valid
                                    } else if (inputValue === '') {
                                    // Allow clearing the input
                                    setsize('');
                                    setsizeError('');
                                    } else {
                                    // Display error message for inputs with more than 4 digits or non-numeric characters
                                    setsizeError('Invalid Entry, Maximum 4 numeric values are allowed');
                                    }
                                }} min="0" disabled={isDisabled}></input>
                              
                            </div> 
                            <div className='col-4'>
                              {/* <input type='text' className='form-control input_VehicleDetails' value='FT' disabled></input> */}
                                <select className={`form-select input_VehicleDetails ${sizeMeasureError ? 'is-invalid' : ''}`} value={sizeMeasure} onChange={(e) => setsizeMeasure(e.target.value)} disabled={isDisabled}>
                                    <option value="">Select</option>
                                    <option value="FT">FT</option>
                                    <option value="FT-SXL">FT-SXL</option>
                                </select>
                            </div>
                            {sizeError && <p className="error-message" style={{textAlign:'right'}}>{sizeError}</p>}
                          </div>

                        </div>
                      </div>

                      <div className='col-4'>

                        <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>Tank Size <span className='mandatory'>*</span></p>
                          </div>
                          <div className='col-4'>
                            <input type='text' className={`form-control input_VehicleDetails ${TanksizeError ? 'is-invalid' : ''}`} value={tankSize} onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const value = parseInt(inputValue, 10);
                                    
                                    if (inputValue.length <= 4 && /^\d*$/.test(inputValue) && !isNaN(value) && value >= 0) {
                                    // Update state if input value is valid and has length less than or equal to 4
                                    settankSize(inputValue);
                                    setTanksizeError(''); // Clear error message if input is valid
                                    } else if (inputValue === '') {
                                    // Allow clearing the input
                                    settankSize('');
                                    setTanksizeError('');
                                    } else {
                                    // Display error message for inputs with more than 4 digits or non-numeric characters
                                    setTanksizeError('Invalid Entry, Maximum 4 numeric values are allowed');
                                    }
                                }}
                              min="0" disabled={isDisabled} ></input>
                            
                            
                          </div> 
                          <div className='col-4'>
                              <select className={`form-select input_VehicleDetails ${TankMeasureError ? 'is-invalid' : ''}`} value={tankMeasure} onChange={(e) => settankMeasure(e.target.value)} disabled={isDisabled}>
                                  <option value="">Select</option>
                                  <option value="KG">KG</option>
                                  <option value="LTR">LTR</option>
                              </select>
                          </div>
                          {TanksizeError && <p className="error-message" style={{textAlign:'right'}}>{TanksizeError}</p>}
                        </div>

                        <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>Vehicle Fuel <span className='mandatory'>*</span></p>
                          </div>
                          <div className='col-8'>
                            {/* <input type='text' className={`form-control input_VehicleDetails ${fuelError ? 'is-invalid' : ''}`} value={fuel} onChange={(e) => setfuel(e.target.value)} disabled={isDisabled}></input>
                            {fuelError && <p className="error-message">{fuelError}</p>} */}
                            <select className={`form-select input_VehicleDetails ${fuelError ? 'is-invalid' : ''}`} value={fuel} onChange={(e) => setfuel(e.target.value)} disabled={isDisabled}>
                                <option value="">Select Fuel Type</option>
                                <option value="DIESEL">DIESEL</option>
                                <option value="CNG">CNG</option>
                                <option value="EV">EV</option>
                            </select>
                            {fuelError && <p className="error-message">{fuelError}</p>}
                          </div> 
                        </div>

                        <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>Model Year <span className='mandatory'>*</span></p>
                          </div>
                          <div className='col-8'>
                            {/* <input type='text' className={`form-control input_VehicleDetails ${MyearError ? 'is-invalid' : ''}`} value={modeL_YEAR} onChange={(e) => setmodeL_YEAR(e.target.value)} disabled={isDisabled}></input> */}
                            <input type='text' className={`form-control input_VehicleDetails ${MyearError ? 'is-invalid' : ''}`} value={modeL_YEAR} onChange={(e) => {
                                const inputValue = e.target.value;
                                const isValidInput = /^\d+$/.test(inputValue);
                                if (isValidInput || inputValue === '') {
                                    setmodeL_YEAR(inputValue);
                                    setMyearError(''); 
                                } else {
                                    setMyearError('Invalid Model Year, Enter Numeric Values');
                                }
                            }}
                              min="0" disabled={isDisabled}></input>
                            {MyearError && <p className="error-message">{MyearError}</p>}
                          </div> 
                        </div>

                        <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                              <p className='vehicleDPara'>Vehicle Rent <span className='mandatory'>*</span></p>
                          </div>
                          <div className='col-8'>
                              <input type='number' className={`form-control input_VehicleDetails ${vRentError ? 'is-invalid' : ''}`} value={vRent} onChange={(e) => setvRent(e.target.value)} disabled={isDisabled} ></input>              
                              {vRentError && <p className="error-message">{vRentError}</p>}
                          </div> 
                        </div>

                        <hr style={{margin:'1.5rem 0'}}></hr>

                        {/* <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>Reg. Start Date</p>
                          </div>
                          <div className='col-8'>
                            <input type='text' className='input_VehicleDetails' value={taskData.vehicle_doc[4].documentstartdate} disabled={isDisabled}></input>
                          </div> 
                        </div> */}

                        <div>
                          {taskData.vehicle_doc.map((doc, index) => (
                            <div key={index} className='row d-flex mb-2 align-items-center'>
                              <div className='col-4'>
                                {/* Optionally, replace "Reg. Start Date" with dynamic content like doc.documentname if available */}
                                <p className='vehicleDPara'>{doc.documentname}</p>
                              </div>
                              <div className='col-8'>
                                {/* <input type='text' tvd_id = {doc.tvD_ID} docName = {doc.documentname} className='input_VehicleDetails' value={doc.documentenddate}  onChange={(e) => handleInputChange(e, index)} disabled={isDisabled}></input> */}
                                <DatePicker
                                  selected={doc.documentenddate ? new Date(doc.documentenddate) : null}
                                  onChange={(date) => handleDateChange(date, index)}
                                  tvd_id={doc.tvD_ID}
                                  docName={doc.documentname}
                                  className={`form-control input_VehicleDetails ${dateError ? 'is-invalid' : ''}`}
                                  showMonthDropdown
                                  showYearDropdown
                                  // dateFormat="dd/MM/yyyy"
                                  id={`dateInput_${index}`}
                                  disabled={isDisabled}
                                  onFocus={(e) => e.target.blur()}
                                  dateFormat="yyyy-MM-dd"
                                />
                              </div> 
                            </div>
                          ))}
                        </div>

                        {/* <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>Reg. End Date</p>
                          </div>
                          <div className='col-8'>
                            <input type='text' className='input_VehicleDetails' value={taskData.vehicle_doc[4].documentenddate} disabled={isDisabled}></input>
                          </div> 
                        </div>

                        <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>Fitness Reg</p>
                          </div>
                          <div className='col-8'>
                            <input type='text' className='input_VehicleDetails' tvd_id ={5} docName = 'Fitness_Certificate' value={taskData.vehicle_doc[0].documentno} disabled={isDisabled}></input>
                          </div> 
                        </div> */}

                        {/* <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>PUCC</p>
                          </div>
                          <div className='col-8'>
                            <input type='text' className='input_VehicleDetails' tvd_id = {2} docName = 'PUCC' value={taskData.vehicle_doc[1].documentno} disabled={isDisabled}></input>
                          </div> 
                        </div>

                        <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>Road Tax</p>
                          </div>
                          <div className='col-8'>
                            <input type='text' className='input_VehicleDetails' tvd_id = {3} docName = 'Road Tax' value={taskData.vehicle_doc[2].documentno} disabled={isDisabled}></input>
                          </div> 
                        </div>

                        <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>Insurance</p>
                          </div>
                          <div className='col-8'>
                            <input type='text' className='input_VehicleDetails' tvd_id = {4} docName = 'Insurance' value={taskData.vehicle_doc[3].documentno} disabled={isDisabled}></input>
                          </div> 
                        </div> */}

                        {/* <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>Permit No.</p>
                          </div>
                          <div className='col-8'>
                            <input type='text' className='input_VehicleDetails' tvd_id = {6} docName = 'Permit Number' value={taskData.vehicle_doc[5].documentno} disabled={isDisabled}></input>
                          </div> 
                        </div> */}

                        {/* <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>NP Auth No.</p>
                          </div>
                          <div className='col-8'>
                            <input type='text' className='input_VehicleDetails' tvd_id = {7} docName = 'NP Auth' value={taskData.vehicle_doc[6].documentno} disabled={isDisabled}></input>
                          </div> 
                        </div> */}

                      </div>

                      <div className='col-4'>

                        {/* <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>Permit Valid</p>
                          </div>
                          <div className='col-8'>
                            <input type='text' className='input_VehicleDetails' value={taskData.vehicle_doc[5].documentenddate} disabled={isDisabled}></input>
                          </div> 
                        </div>

                        <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                            <p className='vehicleDPara'>NP Auth Valid.</p>
                          </div>
                          <div className='col-8'>
                            <input type='text' className='input_VehicleDetails' value={taskData.vehicle_doc[6].documentenddate} disabled={isDisabled}></input>
                          </div> 
                        </div> */}

                        <p className='vehicle_docs'>Vehicle Documents</p>

                        <div>
                          {taskData.vehicle_doc.map((doc, index) => (
                            <div key={index} className='d-flex mb-3 align-items-center justify-content-between'>
                              <div className='d-flex gap-2'>
                                <Icon icon="ep:document" /> 
                                <p className='vehicleDPara'>{doc.documentname}</p>
                              </div>

                              <div className='d-flex align-items-center gap-3'>
                                <div className='d-flex align-items-center'>
                                {showButtons && (
                                  <>
                                  <label htmlFor={`fileInput_${index}`} className='custom-file-upload'>
                                    <Icon icon="icon-park-outline:upload-one" />
                                  </label>

                                  <input
                                    type="file"
                                    id={`fileInput_${index}`}
                                    className='fileUpload'
                                    // style={{ display: 'none' }}
                                    onChange={(e) => handleAttachmentChange(e, index)}
                                    accept=".png, .jpeg"  // Specify the allowed file types
                                    disabled={isDisabled}
                                  />
                                  </>
                                  )}
                                </div>
                                {taskData?.vehicle_doc?.[index]?.documentpath ? (
                                    <Icon icon="lucide:view" className='viewAttachment' onClick={() => openAttachment(taskData.vehicle_doc[index].documentpath)} />
                                  ) : (
                                    <Icon icon="lucide:view" className='noAttachment' disabled />
                                  )}
                              </div>
                              
                            </div>
                          ))}
                        </div>


                        

                        {/* <div className='d-flex mb-3 align-items-center justify-content-between'>
                          <div className='d-flex gap-2'>
                            <Icon icon="ep:document" /> 
                            <p className='vehicleDPara'>PUCC</p>
                          </div>
                          <Icon icon="lets-icons:view-alt" />
                        </div>

                        <div className='d-flex mb-3 align-items-center justify-content-between'>
                          <div className='d-flex gap-2'>
                            <Icon icon="ep:document" /> 
                            <p className='vehicleDPara'>Road Tax</p>
                          </div>
                          <Icon icon="lets-icons:view-alt" />
                        </div>

                        <div className='d-flex mb-3 align-items-center justify-content-between'>
                          <div className='d-flex gap-2'>
                            <Icon icon="ep:document" /> 
                            <p className='vehicleDPara'>Insurance</p>
                          </div>
                          <Icon icon="lets-icons:view-alt" />
                        </div>

                        <div className='d-flex mb-3 align-items-center justify-content-between'>
                          <div className='d-flex gap-2'>
                            <Icon icon="ep:document" /> 
                            <p className='vehicleDPara'>RC</p>
                          </div>
                          <Icon icon="lets-icons:view-alt" />
                        </div>

                        <div className='d-flex mb-3 align-items-center justify-content-between'>
                          <div className='d-flex gap-2'>
                            <Icon icon="ep:document" /> 
                            <p className='vehicleDPara'>Permit</p>
                          </div>
                          <Icon icon="lets-icons:view-alt" />
                        </div> */}

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

export default viewTaskGroup;