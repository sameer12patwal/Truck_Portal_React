// import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from '../APIConfig/ApiContext';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import sampleTruck from '../images/test_truck.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const addVehicle = () => {
    const baseUrl = useApi();

    // const { V_ID } = useParams();
    const [loader, setLoader] = useState(false);
    const [showPopup, setshowPopup] = useState(false);
    const [messageAPI, setmessageAPI] = useState('');


    const [lorryNo, setlorryNo] = useState(null);
    const [vehiclE_OWNER, setvehiclE_OWNER] = useState(null);
    const [modeL_NO, setmodeL_NO] = useState(null);
    const [chasiS_NUMBER, setchasiS_NUMBER] = useState(null);
    const [size, setsize] = useState(null);
    const [sizeMeasure, setsizeMeasure] = useState(null);
    const [tankSize , settankSize] = useState(null);
    const [tankMeasure, settankMeasure] = useState(null);
    const [fuel, setfuel] = useState(null);
    const [modeL_YEAR, setmodeL_YEAR] = useState(null);
    const [vRent, setvRent] = useState(null);
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

    function goBackHome(){
        navigate("/Vehicle");
    }

    const handelEditSubmit = async () => {

      try{

        setlorryError('');
        setvehicleOwnerError('');
        setmodelnoError('');
        setchasisError('');
        setsizeError('');
        setsizeMeasureError('');
        setTanksizeError('');
        setTankMeasureError('');
        setfuelError('');
        setMyearError('');
        setDateError('');
        setTankMeasureError('');
        setvRentError('');


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
            setsizeMeasureError("Size Measure Can't be Empty");
            return;
        }
        if (!tankSize) {
            setTanksizeError("Tank Size is required");
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
            setMyearError("Model Year is Required");
            return;
        }
        if(!(/^\d{4}$/.test(modeL_YEAR))){
            setMyearError("Invalid Model Year Entered");
            return;
        }
        const year = parseInt(modeL_YEAR, 10);
        if(year < 2000 || year > 2024){
            // console.log('her')
            setMyearError("Model Year can only be Between 2000 to 2024");
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
        if (dynamicData[0].documentenddate === null) {
            setDateError('Date is required');
            return;
        }

        setLoader(true);


        const body = {
          VId: 0,
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
          Data: dynamicData.map(doc => ({
            TVD_ID: doc.tvD_ID,
            DOCUMENTNAME: doc.documentname,
            DOCUMENT_END_DATE: doc.documentenddate,
            document: doc.documentpath
          }))
        };
  
        // console.log(body)
  
        const formData = new FormData();
  
        formData.append('VId', 0);
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
        dynamicData.forEach((doc, index) => {

            if (doc.documentenddate != null && doc.documentenddate !== "") {
                formData.append(`Data[${index}].TVD_ID`, doc.tvD_ID);
                formData.append(`Data[${index}].DOCUMENTNAME`, doc.documentname);
                formData.append(`Data[${index}].DOCUMENT_END_DATE`, doc.documentenddate);
                formData.append(`Data[${index}].document`, doc.documentpath);

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
            setmessageAPI('Vehicle Added Successfully...')
            setTimeout(() => {
                setLoader(false);
                setshowPopup(true);
            }, 1500);
        }else{
            setmessageAPI('Error in Adding Vehicle...')
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

        // setlorryNo(null);
        // setvehiclE_OWNER(null);
        // setmodeL_NO(null);
        // setchasiS_NUMBER(null);
        // setsize(null);
        // settankSize(null);
        // settankMeasure(null);
        // setfuel(null);
        // setmodeL_YEAR(null);

        // setlorryError('');
        // setvehicleOwnerError('');
        // setmodelnoError('');
        // setchasisError('');
        // setsizeError('');
        // setTanksizeError('');
        // setTankMeasureError('');
        // setfuelError('');
        // setMyearError('');
        // setDateError('');
    }

    const handleDateChange = (date, index) => {
        const formattedDate = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0] : null;
      
        const updatedData = [...dynamicData];
        updatedData[index].documentenddate = formattedDate;
      
        setDynamicData(updatedData);
      };
      

    const handleAttachmentChange = (e, index) => {

      const file = e.target.files[0];

      const updatedFiles = [...dynamicData];
      updatedFiles[index].documentpath = file;

      setDynamicData(updatedFiles );
  
    };

    const [dynamicData, setDynamicData] = useState([
        { tvD_ID: 1, documentname: 'FITNESS REGN', documentenddate: null, documentpath: null },
        { tvD_ID: 2, documentname: 'PUCC', documentenddate: null, documentpath: null },
        { tvD_ID: 3, documentname: 'ROAD TAX', documentenddate: null, documentpath: null },
        { tvD_ID: 4, documentname: 'Insurance valadity', documentenddate: null, documentpath: null },
        { tvD_ID: 5, documentname: 'RC', documentenddate: null, documentpath: null },
        { tvD_ID: 6, documentname: 'Permit', documentenddate: null, documentpath: null },
        { tvD_ID: 7, documentname: 'NP Auth', documentenddate: null, documentpath: null },
    ]);

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
                        <h5 className='dashHead m-0'>Add New Vehicle</h5>
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
                      <p className='paraVD_up'>Vehicle Details</p>
                    </div>
                    <div className='row d-flex p-2'>
                      <div className='col-4'>
                        <div className='image_Vehile'>
                           <>
                            {TruckImage ? (
                               <img src={imageSrc} className="imgSampleTruck" alt="Driver"  />
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
                                  
                                </div>

                              </div>
                              
                        </div>

                        <div className='vehicle_impDetails'>

                          <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                              <p className='vehicleDPara'>Lory No. <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                              <input type='text' className={`form-control input_VehicleDetails ${lorryError ? 'is-invalid' : ''}`} minLength={9}  maxLength={15} onChange={(e) => setlorryNo(e.target.value)}></input>
                              {lorryError && <p className="error-message">{lorryError}</p>}
                            </div> 
                          </div>

                          <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                              <p className='vehicleDPara'>Vehicle Owner <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                              <input type='text' className={`form-control input_VehicleDetails ${vehicleOwnerError ? 'is-invalid' : ''}`} minLength={5}  maxLength={40} onChange={(e) => setvehiclE_OWNER(e.target.value)}></input>
                              {vehicleOwnerError && <p className="error-message">{vehicleOwnerError}</p>}
                            </div>
                          </div>

                          <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                              <p className='vehicleDPara'>Model No. <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                              <input type='text' className={`form-control input_VehicleDetails ${modelnoError ? 'is-invalid' : ''}`} minLength={5}  maxLength={40} onChange={(e) => setmodeL_NO(e.target.value)}></input>
                              {modelnoError && <p className="error-message">{modelnoError}</p>}
                            </div>
                          </div>

                          <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                              <p className='vehicleDPara'>Chasis No. <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-8'>
                              <input type='text' className={`form-control input_VehicleDetails ${chasisError ? 'is-invalid' : ''}`} minLength={16} maxLength={18} onChange={(e) => setchasiS_NUMBER(e.target.value)}></input>
                              {chasisError && <p className="error-message">{chasisError}</p>}
                            </div>
                          </div>

                          <div className='row d-flex mb-2 align-items-center'>
                            <div className='col-4'>
                              <p className='vehicleDPara'>Vehicle Size <span className='mandatory'>*</span></p>
                            </div>
                            <div className='col-4'>
                              <input type='text' className={`form-control input_VehicleDetails ${sizeError ? 'is-invalid' : ''}`} onChange={(e) => {
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
                                }}
                                min="0" ></input>              
                              
                            </div> 
                            <div className='col-4'>
                                <select className={`form-select input_VehicleDetails ${sizeMeasureError ? 'is-invalid' : ''}`} onChange={(e) => setsizeMeasure(e.target.value)}>
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
                              <input type='text' className={`form-control input_VehicleDetails ${TanksizeError ? 'is-invalid' : ''}`} onChange={(e) => {
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
                                min="0" ></input>

                            </div> 
                            <div className='col-4'>
                                <select className={`form-select input_VehicleDetails ${TankMeasureError ? 'is-invalid' : ''}`} onChange={(e) => settankMeasure(e.target.value)}>
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
                            {/* <input type='text' className={`form-control input_VehicleDetails ${fuelError ? 'is-invalid' : ''}`} onChange={(e) => setfuel(e.target.value)}></input>
                            {fuelError && <p className="error-message">{fuelError}</p>} */}
                            <select className={`form-select input_VehicleDetails ${fuelError ? 'is-invalid' : ''}`} onChange={(e) => setfuel(e.target.value)}>
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
                            <input type='text' className={`form-control input_VehicleDetails ${MyearError ? 'is-invalid' : ''}`} minLength={4} maxLength={4} onChange={(e) => {
                                const inputValue = e.target.value;
                                const isValidInput = /^\d+$/.test(inputValue);
                                if (isValidInput || inputValue === '') {
                                    setmodeL_YEAR(inputValue);
                                    setMyearError(''); 
                                } else {
                                    setMyearError('Invalid Model Year, Enter Numeric Values');
                                }
                            }}></input>
                            {MyearError && <p className="error-message">{MyearError}</p>}
                          </div> 
                        </div>

                        <div className='row d-flex mb-2 align-items-center'>
                          <div className='col-4'>
                              <p className='vehicleDPara'>Vehicle Rent <span className='mandatory'>*</span></p>
                          </div>
                          <div className='col-8'>
                              <input type='number' className={`form-control input_VehicleDetails ${vRentError ? 'is-invalid' : ''}`} minLength={3} maxLength={10} onChange={(e) => setvRent(e.target.value)} ></input>              
                              {vRentError && <p className="error-message">{vRentError}</p>}
                          </div> 
                        </div>

                        <hr style={{margin:'1.5rem 0'}}></hr>

                        <div>
                          {dynamicData && dynamicData.map((doc, index) => (
                            <div key={index} className='row d-flex mb-2 align-items-center'>
                              <div className='col-4'>
                               
                                <p className='vehicleDPara'>{doc.documentname}</p>
                              </div>
                              <div className='col-8'>
                                
                                <DatePicker
                                  selected={dynamicData[index].documentenddate ? new Date(dynamicData[index].documentenddate) : null}
                                  onChange={(date) => handleDateChange(date, index)}
                                  tvd_id={doc.tvD_ID}
                                  docName={doc.documentname}
                                  className={`form-control input_VehicleDetails ${dateError ? 'is-invalid' : ''}`}
                                  showMonthDropdown
                                  showYearDropdown
                                  id={`dateInput_${index}`}
                                  dateFormat="yyyy-MM-dd"
                                //   readOnly={true}
                                  onFocus={(e) => e.target.blur()}
                                //   readOnly
                                />
                                {/* {dateError && <p className="error-message">{dateError}</p>} */}
                              </div> 
                            </div>
                          ))}
                        </div>

                      </div>

                      <div className='col-4'>

                        <p className='vehicle_docs'>Vehicle Documents</p>

                        <div>
                          {dynamicData && dynamicData.map((doc, index) => (
                            <div key={index} className='d-flex mb-3 align-items-center justify-content-between'>
                              <div className='d-flex gap-2'>
                                <Icon icon="ep:document" /> 
                                <p className='vehicleDPara'>{doc.documentname}</p>
                              </div>

                              <div className='d-flex align-items-center gap-3'>
                                <div className='d-flex align-items-center'>
                                
                                  <>
                                  <label htmlFor={`fileInput_${index}`} className='custom-file-upload'>
                                    <Icon icon="icon-park-outline:upload-one" />
                                  </label>

                                  <input
                                    type="file"
                                    id={`fileInput_${index}`}
                                    className='fileUpload'
                                   
                                    onChange={(e) => handleAttachmentChange(e, index)}
                                    accept=".png, .jpeg"  
                                  />
                                  </>
                                  
                                </div>

                              </div>
                              
                            </div>
                          ))}
                        </div>

                      </div>

                    </div>


                  </div>

                </>
            

        </div>
    </section>
  );
};

export default addVehicle;