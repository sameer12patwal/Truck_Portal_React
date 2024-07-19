import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
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
import MultiSelectDropdownforTrips from './MultiSelectDropdownForTrip';
import viewImg from '../images/view.svg';
import { Icon } from '@iconify/react';
// import 'react-tabs/style/react-tabs.css';

const DraftTripDetails = () => {

  const baseUrl = useApi();

  const { V_ID } = useParams();

  const navigate = useNavigate();

//   console.log(V_ID);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [vehicle, setVehicle] = useState([]);
  const [driver, setDriver] = useState([]);
  const [destination, setDestination] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [allMTD , setAllMTD] = useState();
  const [draftedData, setdraftedData] = useState([]);

  const [loader, setLoader] = useState(false);
  const [showPopup, setshowPopup] = useState(false);
  const [messageAPI, setmessageAPI] = useState('');

  const [driverSalary, setDriverSalary] = useState('');

  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 250);
   
  }, []); 

  const fetchData = async () => {
    try {

        setLoader(true);

        const data = {
            "TVD_ID": 0
          }

        const datadriver = {
            "C_ID": 0
        } 

      const responseDraft = await axios.post(`${baseUrl}/api/VeichleTrip/POST_Particular_Trip_details?tripid=${sessionStorage.getItem('tripId')}` );

      const response = await axios.post(`${baseUrl}/api/Vehicle`, data );

      const responseDriver = await axios.post(`${baseUrl}/api/Driver/Get_DriverDetails`, datadriver );

      const responseAllMtd = await axios.post(`${baseUrl}/api/VeichleTrip/POST_Last_Trip_Vehicle_MTD_details?VehicleID=${V_ID}`, {} );

      const responseStore = await axios.get(`${baseUrl}/api/Store`, {} );
      setDestination(responseStore.data.data)

    //   console.log(responseDraft.data.data[0])

      setdraftedData(responseDraft.data.data[0])

      setDriverSalary(responseDraft.data.data[0].driversalary)

      const draftData = responseDraft.data.data[0];
      const storeData = responseStore.data.data;
      const storeCodes = draftData.noofstr.split(',').map(code => code.trim());

    //   console.log(storeData)
    //   console.log(storeCodes)

    //   const selectedValues = storeData
    //       .filter(store => storeCodes.includes(store.storeCode))
    //       .map(store => ({
    //         value: store.storeCode,
    //         label: store.storeName
    //       }));
    const selectedValues = storeCodes.map(code => {
        const store = storeData.find(s => s.storeCode === code);
        return store ? { value: store.storeCode, label: store.storeName } : null;
      }).filter(value => value !== null);

        //   console.log(selectedValues)

        setSelectedDestination(selectedValues);

    //   console.log(responseDraft.data.data[0])

    //   console.log(response.data.data.vehicleview)
    //   console.log(responseStore.data.data)
    //   console.log(responseAllMtd.data.data[0])
      setVehicle(response.data.data.vehicleview);
      setDriver(responseDriver.data.data);
    //   console.log(responseDriver.data.data)
      setAllMTD(responseAllMtd.data.data[0]);

    } catch (error) {
      console.error('Error fetching data', error);
    }finally{
        setTimeout(()=>{
          setLoader(false)
        },2000)
    }
  };


//for tab one

  const [Tabonefilled, setTabonefilled] = useState(false)

  const [tabone, setTabone] = useState({
    lorryNo: '',
    vehicleType: '',
    destination: '', // Assuming this can be multiple values
    driverName: '',
    vehicleFuel: '',
  });

//   useEffect(() => {
//     if (draftedData) {
//       setTabone(prevState => ({
//         ...prevState,
//         destination: draftedData.noofstr || '',
//         driverName: draftedData.driverid || '',
//       }));
//     }
//   }, [draftedData]);

useEffect(() => {
    if (draftedData) {
      const newTabone = {
        destination: draftedData.noofstr || '',
        driverName: draftedData.driverid || '',
      };

      setTabone(prevState => ({
        ...prevState,
        ...newTabone,
      }));

      // Check if both values are present and set Tabonefilled to true if they are
      if (newTabone.destination && newTabone.driverName) {
        setTabonefilled(true);
        setActiveTabIndex(1);
      }
    }
  }, [draftedData]);

  

  useEffect(() => {
    // Update tabone state with selected store codes as a comma-separated string
    const selectedCodes = selectedDestination.map(option => option.value).join(', ');
    setTabone(prevTabone => ({
      ...prevTabone,
      destination: selectedCodes,
    }));
  }, [selectedDestination]);

  useEffect(() => {
    if (allMTD) {
      setTabone(tabone => ({
        ...tabone,
        lorryNo: allMTD.loryno || '',
        vehicleType: sessionStorage.getItem('vehicletype'),
        vehicleFuel: sessionStorage.getItem('fuelType')
      }));
    }
  }, [allMTD]);

  const handleTabOneChange = (e) => {
    const { name, value } = e.target;
    setTabone({ ...tabone, [name]: value });
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setSelectedDestination(selectedOptions);
  };


  const handleTabOneChangeDriver = (e) =>{
    const value = e ? e.value : '';
    // console.log(value)
    // Find the selected driver object from the driver array
    const selectedDriver = driver.find(driver => driver.d_ID === value);

    // Extract driversalary from the selected driver object
    const driversalary = selectedDriver ? (selectedDriver.d_Salary !== null ? selectedDriver.d_Salary : 0) : '';
    // console.log(driversalary)
    // Update state for tabone and save driversalary
    setTabone({ ...tabone, driverName: value });
    setDriverSalary(driversalary);
  }

  const validateInputstabOne = () => {
    if (!tabone.lorryNo) {
      return false;
    }else if(!tabone.vehicleType){
        return false;
    }else if(!tabone.driverName){
        return false;
    }else if(!tabone.vehicleFuel){
        return false;
    }//else if(!tabone.selectOFS){
    //     return false;
    // }

    return true;
  };

  const handleNextClickTabOne = () => {
    if (validateInputstabOne()) {
      setTabonefilled(true)
    //   console.log(tabone)
      setActiveTabIndex(activeTabIndex + 1);
    } else {
      alert("Please fill in all required fields.");
    }
  };

//for tab two

const [Tabtwofilled, setTabtwofilled] = useState(false)

  const [tabtwo, setTabtwo] = useState({
    exitDate: null,
    dcReturnDate: null,
    returnHours: '',
    exitTime: '', // Assuming this is a string in 'HH:mm' format
    dcReturnTime: '',
    returnDays: '',
  });

//   useEffect(() => {
//     if (draftedData) {
//       setTabtwo(prevState => ({
//         ...prevState,
//         exitDate: new Date(draftedData.exitdt) || null,
//         dcReturnDate: new Date (draftedData.dcretdate) || null,
//         returnHours: draftedData.rethours || '',
//         exitTime: draftedData.exittime || '',
//         dcReturnTime: draftedData.dcrettime || '',
//         returnDays: draftedData.retdays || '',
//       }));
//     }
//   }, [draftedData]);

useEffect(() => {
    if (draftedData) {
      const newTabtwo = {
        exitDate: draftedData.exitdt ? new Date(draftedData.exitdt) : null,
        dcReturnDate: draftedData.dcretdate ? new Date(draftedData.dcretdate) : null,
        returnHours: draftedData.rethours || '',
        exitTime: draftedData.exittime || '',
        dcReturnTime: draftedData.dcrettime || '',
        returnDays: draftedData.retdays || '',
      };

      setTabtwo(prevState => ({
        ...prevState,
        ...newTabtwo,
      }));

      // Check if all required values are present and set Tabtwofilled to true if they are
      if (
        newTabtwo.exitDate &&
        newTabtwo.dcReturnDate &&
        newTabtwo.returnHours &&
        newTabtwo.exitTime &&
        newTabtwo.dcReturnTime &&
        newTabtwo.returnDays
      ) {
        setTabtwofilled(true);
        setActiveTabIndex(2);
      }
    }
  }, [draftedData]);

  const handleTabTwoChange = (e) => {
    const { name, value } = e.target;
    setTabtwo({ ...tabtwo, [name]: value });
  };

  const handleDateChange = (date, id) => {
    setTabtwo({ ...tabtwo, [id]: date });
  };

  const parseTimeToMilliseconds = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 3600000 + minutes * 60000; // Convert hours and minutes to milliseconds
  };

  useEffect(() => {
    if (tabtwo.exitDate && tabtwo.dcReturnDate && tabtwo.exitTime && tabtwo.dcReturnTime) {
      const exitDateTime = new Date(tabtwo.exitDate.getTime() + parseTimeToMilliseconds(tabtwo.exitTime));
      const returnDateTime = new Date(tabtwo.dcReturnDate.getTime() + parseTimeToMilliseconds(tabtwo.dcReturnTime));
  
      const differenceInMilliseconds = returnDateTime - exitDateTime;
  
      // Convert milliseconds into hours, minutes, and seconds
      let totalSeconds = differenceInMilliseconds / 1000;
      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
  
      // Format the time string with leading zeros where necessary
      const formattedTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
      ].join(':');
  
      // Update your state with the calculated time
      setTabtwo({ ...tabtwo, returnHours: formattedTime });
    }
  }, [tabtwo.exitDate, tabtwo.dcReturnDate, tabtwo.exitTime, tabtwo.dcReturnTime]);

  useEffect(() => {
    if (tabtwo.exitDate && tabtwo.dcReturnDate) {
      const exitDay = tabtwo.exitDate.getDate(); // Get the day of the month for the exit date
      const returnDay = tabtwo.dcReturnDate.getDate(); // Get the day of the month for the DC return date
  
      // Calculate the difference in days and add 1
      const returnDays = (returnDay + 1) - exitDay;
  
      // Update your state with the calculated days
      // Assuming you have a state property for this, adjust accordingly if it's named differently
      setTabtwo({ ...tabtwo, returnDays: returnDays.toString() });
    }
  }, [tabtwo.exitDate, tabtwo.dcReturnDate]);

  const validateInputstabTwo = () => {
    
    if (!tabtwo.exitDate) {
        // console.log("exitdate")
      return false;
    }else if(!tabtwo.dcReturnDate){
        // console.log("dcreturndate")
        return false;
    }else if(!tabtwo.returnHours){
        // console.log("return hour")
        return false;
    }else if(!tabtwo.exitTime){
        // console.log("exittime")
        return false;
    }else if(!tabtwo.dcReturnTime){
        // console.log("dcreturntime")
        return false;
    }else if(!tabtwo.returnDays){
        // console.log("returndays")
        return false;
    }

    return true;
  };

  const handleNextClickTabTwo = () => {
    if (validateInputstabTwo()) {
      setTabtwofilled(true)
      setActiveTabIndex(activeTabIndex + 1);
    } else {
      alert("Please fill in all required fields.");
    }
  };


  //for tab three

  const [Tabthreefilled, setTabthreefilled] = useState(false);

  const [tabthree, setTabthree] = useState({
    opkm: draftedData.opkm,
    runkm: '',
    clkm: '',
    mtdRunkm: '',
    GPSKM: '',
    GoogleKM: '',
    toUseRunKm: ''
  });

//   useEffect(() => {
//     if (draftedData) {
//       setTabthree(prevState => ({
//         ...prevState,
//         opkm: draftedData.opkm || '',
//         runkm: draftedData.runKM || '',
//         clkm: draftedData.clkm || '',
//         mtdRunkm: draftedData.mtdrunkm || '',
//       }));
//     }
//   }, [draftedData]);

useEffect(() => {
    if (draftedData) {
        if(draftedData.gpskm){
            var newGPSkm = parseFloat(draftedData.gpskm) - parseFloat(draftedData.opkm)
        }
      const newTabthree = {
        opkm: draftedData.opkm || '',
        runkm: draftedData.runKM || '',
        clkm: draftedData.clkm || '',
        mtdRunkm: draftedData.mtdrunkm || '',
        GPSKM: draftedData.gpskm || '',
        GoogleKM: draftedData.googlekm || '',
        toUseRunKm: newGPSkm
      };


      setTabthree(prevState => ({
        ...prevState,
        ...newTabthree,
      }));

      // Check if all required values are present and set Tabthreefilled to true if they are
      if (
        newTabthree.opkm &&
        newTabthree.runkm &&
        newTabthree.clkm &&
        newTabthree.mtdRunkm &&
        newTabthree.GPSKM
      ) {
        setTabthreefilled(true);
        setActiveTabIndex(3);
      }
    }
  }, [draftedData]);

//   const handleTabThreeChange = (e) => {
//     const { name, value } = e.target;
//     setTabthree({ ...tabthree, [name]: value });
//   };

    const handleTabThreeChange = (e) => {
        const { name, value } = e.target;
        const regex = /^[1-9]\d{0,9}$/;

        if (name === 'opkm' || name === 'clkm' || name === 'GPSKM' || name === 'GoogleKM') {
        if (value === '' || regex.test(value)) { 
            setTabthree({ ...tabthree, [name]: value });
        } else {
            alert("Please enter a valid positive number.");
        }
        } else {
        setTabthree({ ...tabthree, [name]: value });
        }
    };

  useEffect(() => {
    if (tabthree.clkm && tabthree.opkm && !isNaN(tabthree.clkm) && !isNaN(tabthree.opkm)) {
      const calculatedRunKms = parseFloat(tabthree.clkm) - parseFloat(tabthree.opkm);
  
      setTabthree({ ...tabthree, runkm: calculatedRunKms.toString() });
    }
  }, [tabthree.clkm, tabthree.opkm]); 

  useEffect(() => {
    if (tabthree.GPSKM && tabthree.opkm && !isNaN(tabthree.GPSKM) && !isNaN(tabthree.opkm)) {
      const calculatedRunKms = parseFloat(tabthree.GPSKM) - parseFloat(tabthree.opkm);
    //   console.log(calculatedRunKms)
      setTabthree({ ...tabthree, toUseRunKm: calculatedRunKms.toString() });
    }
  }, [tabthree.GPSKM, tabthree.opkm]); 

  useEffect(() => {
    if (tabthree.runkm && !isNaN(tabthree.runkm)){
        const mtdrunKmValue = parseFloat(tabthree.runkm) + parseFloat(allMTD.mtdrunkm);
        setTabthree({ ...tabthree, mtdRunkm: mtdrunKmValue.toString() });
    }
  }, [tabthree.runkm]);

  const validateInputstabThree = () => {
    
    if (!tabthree.opkm) {
      return false;
    }else if(!tabthree.runkm){
        return false;
    }else if(!tabthree.clkm){
        return false;
    }else if(!tabthree.mtdRunkm){
        return false;
    }else if(!tabthree.GPSKM){
        return false;
    }else if(!tabthree.GoogleKM){
        return false;
    }

    return true;
  };

  const handleNextClickTabThree = () => {
    if (validateInputstabThree()) {
        setTabthreefilled(true)
        setActiveTabIndex(activeTabIndex + 1);
      } else {
        alert("Please fill in all required fields.");
      }
  }


  //for tab four

  const [Tabfourfilled, setTabfourfilled] = useState(false);
  
  const [tabfour, setTabfour] = useState({
    opdeisel: '',
    dcngfill: '',
    dcngconsumption: '',
    dcngrate: '',
    actavgkm: '',
    revfrt: '',
    dcngfilldc: '',
    closingdcng: '',
    mtdlorydcngconsumption: '',
    bgtdslavg: '',
    rettype: '',
    atdc: '',
    tot: ''
  });

//   useEffect(() => {
//     if (draftedData) {
//       setTabfour(prevState => ({
//         ...prevState,
//         opdeisel: draftedData.opdiesel || '',
//         dcngfill: draftedData.diecngfillontheway || '',
//         dcngconsumption: draftedData.dieselcngcump || '',
//         dcngrate: draftedData.diesratecngratelt || '',
//         actavgkm: draftedData.actavgkm || '',
//         revfrt: draftedData.revfrt || '',
//         dcngfilldc: draftedData.dieselcngfillindc || '',
//         closingdcng: draftedData.closingdiecng || '',
//         mtdlorydcngconsumption: draftedData.mtdlorrydieselcngcump || '',
//         bgtdslavg: draftedData.bgtdslavg || '',
//         rettype: draftedData.rettype || '',
//         atdc: draftedData.atdc || '',
//         tot: draftedData.tot || ''
//       }));
//     }
//   }, [draftedData]);

useEffect(() => {
    if (draftedData) {
      const newTabfour = {
        opdeisel: draftedData.opdiesel || '',
        dcngfill: draftedData.diecngfillontheway || '',
        dcngconsumption: draftedData.dieselcngcump || '',
        dcngrate: draftedData.diesratecngratelt || '',
        actavgkm: draftedData.actavgkm || '',
        revfrt: draftedData.revfrt || '',
        dcngfilldc: draftedData.dieselcngfillindc || '',
        closingdcng: draftedData.closingdiecng || '',
        mtdlorydcngconsumption: draftedData.mtdlorrydieselcngcump || '',
        bgtdslavg: draftedData.bgtdslavg || '',
        rettype: draftedData.rettype || '',
        atdc: draftedData.atdc || '',
        tot: draftedData.tot || ''
      };

      setTabfour(prevState => ({
        ...prevState,
        ...newTabfour
      }));

      // Check if all required values are present and set Tabfourfilled to true if they are
      const allFieldsFilled = Object.values(newTabfour).every(value => value !== '');
      if(allFieldsFilled){
        setTabfourfilled(allFieldsFilled);
        setActiveTabIndex(4);
      }
    }
  }, [draftedData]);

  const handleTabFourChange = (e) => {
    const { name, value } = e.target;
    const regex = /^(\d{1,9}|\d{0,9}\.\d{0,2}|0)$/;// Updated regex

    const fieldsToValidate = [
      'opdeisel', 
      'dcngfill', 
      'dcngrate', 
      'revfrt', 
      'dcngfilldc', 
      'closingdcng', 
      'bgtdslavg'
    ];

    if (fieldsToValidate.includes(name)) {
      if (value === '' || regex.test(value)) {
        setTabfour({ ...tabfour, [name]: value });
      } else {
        alert("Please enter a valid positive number.");
      }
    } else {
      setTabfour({ ...tabfour, [name]: value });
    }
  };


  useEffect(() => {
    if (tabfour.opdeisel && tabfour.dcngfill && tabfour.dcngfilldc && tabfour.closingdcng) {
      const calculatedDeiselCNGConsumption = ((parseFloat(tabfour.opdeisel) + parseFloat(tabfour.dcngfill) + parseFloat(tabfour.dcngfilldc)) - tabfour.closingdcng);
      setTabfour({ ...tabfour, dcngconsumption: Math.round(calculatedDeiselCNGConsumption).toString() });
    }
  }, [tabfour.opdeisel, tabfour.dcngfill, tabfour.dcngfilldc, tabfour.closingdcng]);

  useEffect(() => {
    if (tabfour.dcngconsumption) {
      const calculatedmtdlorydcngconsumption = parseFloat(tabfour.dcngconsumption) + parseFloat(allMTD.mtdlorrydieselcngcump);
      let calculatedactavgkm = 0;

      if (tabthree.GPSKM) {
        if(tabfour.dcngconsumption == 0){
            calculatedactavgkm = 0
        }else{
            calculatedactavgkm = parseFloat(tabthree.GPSKM) / parseFloat(tabfour.dcngconsumption);
        }     
      }

      setTabfour(prevTabfour => ({
        ...prevTabfour,
        mtdlorydcngconsumption: Math.round(calculatedmtdlorydcngconsumption).toString(),
        actavgkm: Math.round(calculatedactavgkm).toString()
      }));
    }
  }, [tabfour.dcngconsumption, tabthree.GPSKM]);

  useEffect(() => {
    if (tabfour.dcngconsumption && tabfour.dcngrate ) {
      const calculatedatdc = parseFloat(tabfour.dcngconsumption) * parseFloat(tabfour.dcngrate);
      setTabfour(prevTabfour => ({
        ...prevTabfour, 
        atdc: Math.round(calculatedatdc).toString(),
        tot: Math.round(calculatedatdc).toString()
        }));
    }
  }, [tabfour.dcngrate]);

  const validateInputstabFour = () => {
    
    if (!tabfour.opdeisel) {
        // console.log("op deisel")
      return false;
    }else if(!tabfour.dcngfill){
        // console.log("d cng fill")
        return false;
    }else if(!tabfour.dcngrate){
        // console.log("dcngrate")
        return false;
    }else if(!tabfour.revfrt){
        // console.log("revfrt")
        return false;
    }else if(!tabfour.dcngfilldc){
        // console.log("dcngfilldc")
        return false;
    }else if(!tabfour.closingdcng){
        // console.log("closingdcng")
        return false;
    }else if(!tabfour.bgtdslavg){
        // console.log("bgtdslavg")
        return false;
    }else if(!tabfour.rettype){
        // console.log("rettype")
        return false;
    }

    return true;
  };

  const handleNextClickTabFour = () => {
    if (validateInputstabFour()) {
        setTabfourfilled(true)
        setActiveTabIndex(activeTabIndex + 1);
      } else {
        alert("Please fill in all required fields.");
      }
  }


  //for tab five
  
const [Tabfivefilled, setTabfivefilled] = useState(false);

const [tabfive, setTabfive] = useState({
    bgtcost: '',
    mkt: '',
    loryrenttrip: '',
    driversalary: '',
    mtddriversalary: '',
    loryrent: '',
    mtdloryrent: '',
    fixedcostdriversalary: '',
    gps: ''
});

// const handleTabFiveChange = (e) => {
// const { name, value } = e.target;
// setTabfive({ ...tabfive, [name]: value });
// };

const handleTabFiveChange = (e) => {
    const { name, value } = e.target;
    const regex = /^(\d{1,9}|\d{0,9}\.\d{0,2}|0)$/;

    if (name === 'bgtcost' || name === 'mkt') {
      if (value === '' || regex.test(value)) { 
        setTabfive({ ...tabfive, [name]: value });
      } else {
        alert("Please enter a valid positive number.");
      }
    } else {
        setTabfive({ ...tabfive, [name]: value });
    }
};

useEffect(() => {
    if (draftedData) {
      const newTabfive = {
        bgtcost: draftedData.bgtcost || '',
        mkt: draftedData.mkt || '',
        loryrenttrip: draftedData.lorryRentPerTrip || '',
        driversalary: draftedData.driversalary || '',
        mtddriversalary: draftedData.mtddriversalary || '',
        loryrent: draftedData.lorryrentfc || '',
        mtdloryrent: draftedData.mtdlorrywiserent || '',
        fixedcostdriversalary: draftedData.fixCostDSalary || '',
        gps: draftedData.gps || ''
      };

      setTabfive(prevState => ({
        ...prevState,
        ...newTabfive
      }));

    //   console.log(draftedData.bgtcost)

      // Check if all required values are present
      const allFieldsFilled = Object.values(newTabfive).every(value => value !== null && value !== '');

      if(allFieldsFilled){
        setTabfivefilled(allFieldsFilled);
        setActiveTabIndex(5);
      }
    }
  }, [draftedData]);

  useEffect(() => {
    
    if (tabtwo.returnHours && !draftedData.fixCostDSalary && !draftedData.gps) {
      const LorryRent = parseFloat((sessionStorage.getItem('lory_Rent')) / 30) || 0;
      const RETHrs = parseFloat(tabtwo.returnDays) || 0;
      const loryRentperTrip = ((LorryRent) * RETHrs).toFixed(2);
      const MTDLoryRent = parseFloat(loryRentperTrip) + parseFloat(allMTD.mtdlorrywiserent);
      const FixedCostDriverSalary = parseFloat(driverSalary) * RETHrs;
      const MTDDriverSalary = parseFloat(FixedCostDriverSalary) + parseFloat(allMTD.mtddriversalary);
      const GPS = parseFloat((200 / 30) * RETHrs);
  
      setTabfive(prevTabfive => {
        const newState = {
          ...prevTabfive,
          loryrent: Math.round(LorryRent).toString(),
          loryrenttrip: Math.round(parseFloat(loryRentperTrip)).toString(),  // Ensure loryRentperTrip is a number
          mtdloryrent: Math.round(MTDLoryRent).toString(),
          driversalary: Math.round(driverSalary).toString(),
          mtddriversalary: Math.round(MTDDriverSalary).toString(),
          fixedcostdriversalary: Math.round(FixedCostDriverSalary).toString(),
          gps: Math.round(GPS).toString(),
        };
        return newState;
      });
    }
  }, [tabtwo.returnHours, draftedData, allMTD, driverSalary, tabtwo.returnDays]);
  

const validateInputstabFive = () => {
    
    if (!tabfive.bgtcost) {
      return false;
    }else if(!tabfive.mkt){
        return false;
    }else if(!tabfive.loryrenttrip){
        return false;
    }else if(!tabfive.driversalary){
        return false;
    }else if(!tabfive.mtddriversalary){
        return false;
    }else if(!tabfive.loryrent){
        return false;
    }else if(!tabfive.mtdloryrent){
        return false;
    }else if(!tabfive.fixedcostdriversalary){
        return false;
    }

    return true;
};

const handleNextClickTabFive = () => {
    if (validateInputstabFive()) {
        setTabfivefilled(true)
        setActiveTabIndex(activeTabIndex + 1);
      } else {
        alert("Please fill in all required fields.");
      }
}



// for tab six

const [Tabsixfilled, setTabsixfilled] = useState(false);
  
const [tabsix, setTabsix] = useState({
    exitno: '',
    pkd: '',
    value: '',
    extdeldt: '',
    ttlpkt: '',
    qty: '',
    bgttrdays: '',
    revloads: ''
});

// useEffect(() => {
//     if (draftedData) {
//       setTabsix(prevState => ({
//         ...prevState,
//         exitno: draftedData.exitno || '',
//         pkd: draftedData.pkd|| '',
//         value: draftedData.val || '',
//         extdeldt: draftedData.expdeldt || '',
//         ttlpkt: draftedData.ttlpkt || '',
//         qty: draftedData.qty || '',
//         bgttrdays: draftedData.bgttrdays || '',
//         revloads: draftedData.noofrevload || ''
//       }));
//     }
//   }, [draftedData]);

useEffect(() => {
    if (draftedData) {
      const newTabsix = {
        exitno: draftedData.exitno || '',
        pkd: draftedData.pkd || '',
        value: draftedData.val || '',
        extdeldt: draftedData.expdeldt || '',
        ttlpkt: draftedData.ttlpkt || '',
        qty: draftedData.qty || '',
        bgttrdays: draftedData.bgttrdays || '',
        revloads: draftedData.noofrevload || ''
      };

      setTabsix(prevState => ({
        ...prevState,
        ...newTabsix
      }));

      // Check if all required values are present
      const allFieldsFilled = Object.values(newTabsix).every(value => value !== '');
      if(allFieldsFilled){
        setTabsixfilled(allFieldsFilled);
        setActiveTabIndex(6);
      }
      
    }
  }, [draftedData]);

// const handleTabSixChange = (e) => {
//     const { name, value } = e.target;
//     setTabsix({ ...tabsix, [name]: value });
// };

const handleTabSixChange = (e) => {
    const { name, value } = e.target;
    const regex = /^(\d{1,9}|\d{0,9}\.\d{0,2}|0)$/; // Allows only positive numbers, not starting with zero, and optional decimal points
    const alphanumericRegex = /^[a-zA-Z0-9+]*$/; // Allows alphanumeric values

    const fieldsToValidate = [ 
        'pkd', 
        'value', 
        'ttlpkt', 
        'qty', 
        'bgttrdays', 
        'revloads'
    ];

    const alphanumericFields = ['bgttrdays'];

    if (alphanumericFields.includes(name)) {
        if (alphanumericRegex.test(value)) {
            setTabsix({ ...tabsix, [name]: value });
        } else {
            alert(`Please enter a valid ${name} value.`);
        }
    } else if (fieldsToValidate.includes(name)) {
        if (value === '' || regex.test(value)) {
            setTabsix({ ...tabsix, [name]: value });
        } else {
            alert("Please enter a valid positive number.");
        }
    } else {
        setTabsix({ ...tabsix, [name]: value });
    }
};

const validateInputstabSix = () => {
    
    if (!tabsix.exitno) {
      return false;
    }else if(!tabsix.pkd){
        return false;
    }else if(!tabsix.value){
        return false;
    }else if(!tabsix.extdeldt){
        return false;
    }else if(!tabsix.ttlpkt){
        return false;
    }else if(!tabsix.qty){
        return false;
    }else if(!tabsix.bgttrdays){
        return false;
    }else if(!tabsix.revloads){
        return false;
    }

    return true;
};

const handleNextClickTabSix = () => {
    if (validateInputstabSix()) {
        setTabsixfilled(true)
        setActiveTabIndex(activeTabIndex + 1);
      } else {
        alert("Please fill in all required fields.");
      }
}



//for tab seven

const [Tabsevenfilled, setTabsevenfilled] = useState(false);
  
const [tabseven, setTabseven] = useState({
    repmtn: '',
    totaltaxcash: '',
    totaltaxfastag: '',
    rto: '',
    mechanicalRec: '',
    challan: '',
    borderexp: '',
    loadunload: '',
    inc: '',
    otherexp: '',
    totalcost: '',
    mtdrepmaint: '',
    mtdtolltaxcash: '',
    mtdtolltaxfastag: '',
    mtdrto: '',
    mtdmechanicalrec: '',
    mtdchallan: '',
    mtdborderexp: '',
    mtdloadunload: '',
    mtdinc: '',
    mtdotherexp: '',
    conscost: '',
    remark:'',
    ureaPurchase: ''
});

// useEffect(() => {
//     if (draftedData) {
//       setTabseven(prevState => ({
//         ...prevState,
//         repmtn: draftedData.repmtn || '',
//         totaltaxcash: draftedData.tolltaxcash || '',
//         totaltaxfastag: draftedData.tolltaxfasttag || '',
//         rto: draftedData.rto || '',
//         mechanicalRec: draftedData.mechanicalrec || '',
//         challan: draftedData.challan || '',
//         borderexp: draftedData.borderexp || '',
//         loadunload: draftedData.loadunload || '',
//         inc: draftedData.inc || '',
//         otherexp: draftedData.otherexp || '',
//         totalcost: draftedData.totalcost || '',
//         mtdrepmaint: draftedData.mtdrepmaint || '',
//         mtdtolltaxcash: draftedData.mtdtolltaxcash || '',
//         mtdtolltaxfastag: draftedData.mtdtolltaxfasttag || '',
//         mtdrto: draftedData.mtdrto || '',
//         mtdmechanicalrec: draftedData.mtdmechanicalrec || '',
//         mtdchallan: draftedData.mtdchallan || '',
//         mtdborderexp: draftedData.mtdborderexp || '',
//         mtdloadunload: draftedData.mtdloadunload || '',
//         mtdinc: draftedData.mtdinc || '',
//         mtdotherexp: draftedData.mtdotherexp || '',
//         conscost: draftedData.conscost || ''
//       }));
//     }
//   }, [draftedData]);

useEffect(() => {
    if (draftedData) {
      const newTabseven = {
        repmtn: draftedData.repmtn || '',
        totaltaxcash: draftedData.tolltaxcash || '',
        totaltaxfastag: draftedData.tolltaxfasttag || '',
        rto: draftedData.rto || '',
        mechanicalRec: draftedData.mechanicalrec || '',
        challan: draftedData.challan || '',
        borderexp: draftedData.borderexp || '',
        loadunload: draftedData.loadunload || '',
        inc: draftedData.inc || '',
        otherexp: draftedData.otherexp || '',
        totalcost: draftedData.totalcost || '',
        mtdrepmaint: draftedData.mtdrepmaint || '',
        mtdtolltaxcash: draftedData.mtdtolltaxcash || '',
        mtdtolltaxfastag: draftedData.mtdtolltaxfasttag || '',
        mtdrto: draftedData.mtdrto || '',
        mtdmechanicalrec: draftedData.mtdmechanicalrec || '',
        mtdchallan: draftedData.mtdchallan || '',
        mtdborderexp: draftedData.mtdborderexp || '',
        mtdloadunload: draftedData.mtdloadunload || '',
        mtdinc: draftedData.mtdinc || '',
        mtdotherexp: draftedData.mtdotherexp || '',
        conscost: draftedData.conscost || '',
        remark: draftedData.other_expense_remarks || '',
        ureaPurchase: draftedData.ureaPurchase || ''
      };

      setTabseven(prevState => ({
        ...prevState,
        ...newTabseven
      }));

      // Check if all required values are present
      const allFieldsFilled = Object.values(newTabseven).every(value => value !== '');
      if(allFieldsFilled){
        setTabsevenfilled(allFieldsFilled);
        setActiveTabIndex(7);
      }
 
    }
  }, [draftedData]);

// const handleTabSevenChange = (e) => {
//     const { name, value } = e.target;
//     setTabseven({ ...tabseven, [name]: value });
// };
const handleTabSevenChange = (e) => {
    const { name, value } = e.target;
    const regex = /^(\d{1,9}|\d{0,9}\.\d{0,2}|0)$/; // Allows only positive numbers, not starting with zero, and optional decimal points

    const fieldsToValidate = [
        'repmtn', 
        'totaltaxcash', 
        'totaltaxfastag', 
        'rto', 
        'mechanicalRec', 
        'challan', 
        'borderexp', 
        'loadunload', 
        'inc', 
        'otherexp',
        'ureaPurchase',
    ];

    if (fieldsToValidate.includes(name)) {
        if (value === '' || regex.test(value)) {
            setTabseven({ ...tabseven, [name]: value });
        } else {
            alert("Please enter a valid positive number.");
        }
    } else {
    setTabseven({ ...tabseven, [name]: value });
    }
};


useEffect(() => {
    let updates = {};

    if (tabseven.repmtn && !isNaN(tabseven.repmtn)) {
        const MTDrepmaint = parseFloat(tabseven.repmtn) + parseFloat(allMTD.mtdrepmaint || 0);
        updates.mtdrepmaint = MTDrepmaint.toString();
    }

    if (tabseven.totaltaxcash && !isNaN(tabseven.totaltaxcash)) {
        const MTDtolltaxcash = parseFloat(tabseven.totaltaxcash) + parseFloat(allMTD.mtdtolltaxcash || 0);
        updates.mtdtolltaxcash = MTDtolltaxcash.toString();
    }

    if (tabseven.totaltaxfastag && !isNaN(tabseven.totaltaxfastag)) {
        const MTDtolltaxfastag = parseFloat(tabseven.totaltaxfastag) + parseFloat(allMTD.mtdtolltaxfastag || 0);
        updates.mtdtolltaxfastag = MTDtolltaxfastag.toString();
    }

    if (tabseven.rto && !isNaN(tabseven.rto)) {
        const MTDrto = parseFloat(tabseven.rto) + parseFloat(allMTD.mtdrto || 0);
        updates.mtdrto = MTDrto.toString();
    }

    if (tabseven.mechanicalRec && !isNaN(tabseven.mechanicalRec)) {
        const MTDmechanicalRec = parseFloat(tabseven.mechanicalRec) + parseFloat(allMTD.mtdmechanicalrec || 0);
        updates.mtdmechanicalrec = MTDmechanicalRec.toString();
    }

    if (tabseven.challan && !isNaN(tabseven.challan)) {
        const MTDchallan = parseFloat(tabseven.challan) + parseFloat(allMTD.mtdchallan || 0);
        updates.mtdchallan = MTDchallan.toString();
    }

    if (tabseven.borderexp && !isNaN(tabseven.borderexp)) {
        const MTDborderex = parseFloat(tabseven.borderexp) + parseFloat(allMTD.mtdborderexp || 0);
        updates.mtdborderexp = MTDborderex.toString();
    }

    if (tabseven.loadunload && !isNaN(tabseven.loadunload)) {
        const MTDloadunload = parseFloat(tabseven.loadunload) + parseFloat(allMTD.mtdloadunload || 0);
        updates.mtdloadunload = MTDloadunload.toString();
    }

    if (tabseven.inc && !isNaN(tabseven.inc)) {
        const MTDinc = parseFloat(tabseven.inc) + parseFloat(allMTD.mtdinc || 0);
        updates.mtdinc = MTDinc.toString();
    }

    if (tabseven.otherexp && !isNaN(tabseven.otherexp)) {
        const MTDotherexp = parseFloat(tabseven.otherexp) + parseFloat(allMTD.mtdotherexp || 0);
        updates.mtdotherexp = MTDotherexp.toString();
        const totalcost = parseFloat(tabseven.repmtn) + parseFloat(tabseven.totaltaxcash) + parseFloat(tabseven.totaltaxfastag) 
        + parseFloat(tabseven.rto) + parseFloat(tabseven.mechanicalRec) + parseFloat(tabseven.challan) + 
        parseFloat(tabseven.borderexp) + parseFloat(tabseven.loadunload) + parseFloat(tabseven.inc) + parseFloat(tabseven.otherexp);
        updates.totalcost = totalcost.toString();
    }

    if(tabseven.totalcost && !isNaN(tabseven.totalcost)){
        // console.log(tabfour.tot)
        const CONSCOST = parseFloat(tabseven.totalcost) + parseFloat(tabfour.tot);
        updates.conscost = Math.round(CONSCOST).toString();
    }

    if (Object.keys(updates).length > 0) {
        setTabseven(prevState => ({...prevState, ...updates}));
    }

}, [tabseven.repmtn, tabseven.totalcost, tabseven.totaltaxcash, tabseven.totaltaxfastag, tabseven.rto, tabseven.mechanicalRec, tabseven.challan, tabseven.borderexp, tabseven.loadunload, tabseven.inc, tabseven.otherexp]);


const validateInputstabSeven = () => {
    
    if (!tabseven.repmtn) {
      return false;
    }else if(!tabseven.totaltaxcash){
        return false;
    }else if(!tabseven.totaltaxfastag){
        return false;
    }else if(!tabseven.rto){
        return false;
    }else if(!tabseven.mechanicalRec){
        return false;
    }else if(!tabseven.challan){
        return false;
    }else if(!tabseven.borderexp){
        return false;
    }else if(!tabseven.loadunload){
        return false;
    }else if(!tabseven.inc){
        return false;
    }else if(!tabseven.otherexp){
        return false;
    }else if(!tabseven.totalcost){
        return false;
    }else if(!tabseven.mtdrepmaint){
        return false;
    }else if(!tabseven.mtdtolltaxcash){
        return false;
    }else if(!tabseven.mtdtolltaxfastag){
        return false;
    }else if(!tabseven.mtdrto){
        return false;
    }else if(!tabseven.mtdmechanicalrec){
        return false;
    }else if(!tabseven.mtdchallan){
        return false;
    }else if(!tabseven.mtdborderexp){
        return false;
    }else if(!tabseven.mtdloadunload){
        return false;
    }else if(!tabseven.mtdinc){
        return false;
    }else if(!tabseven.mtdotherexp){
        return false;
    }else if(!tabseven.ureaPurchase){
        return false;
    }

    return true;
  };

  const handleNextClickTabSeven = () => {
    if (validateInputstabSeven()) {
        setTabsevenfilled(true)
        setActiveTabIndex(activeTabIndex + 1);
      } else {
        alert("Please fill in all required fields.");
      }
  }



//for tab Eight

const [TabEightfilled, setTabEightfilled] = useState(false);
  
const [tabeight, setTabeight] = useState({
    picktype: '',
    retlocationfrom: '',
    retloadingdate: null,
    rethaultdays: '',
    retpkd: '',
    retrecdate: null,
    totdays: '',
    retfrt: '',
    tptcom: '',
    netfrt: '',
    baldeposit: '',
    paymentmode: '',
    tptname: '',
    retlocationto: '',
    retloadingexitdate: null,
    retwt: '',
    retval: '',
    retunloaddate: null,
    frtmt: '',
    advance: '',
    biltycharge: '',
    deposit: '',
    balpending: '',
    paymentstatus: '',
});

const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? null : date;
  };

useEffect(() => {
    if (draftedData) {
      setTabeight(prevState => ({
        ...prevState,
        picktype: draftedData.picktype || '0',
        retlocationfrom: draftedData.retlocationfrom || '0',
        retloadingdate: draftedData.retloadingdate ? parseDate(draftedData.retloadingdate) : null,
        rethaultdays: draftedData.retlohaltdays || '0',
        retpkd: draftedData.retpkd || '0',
        retrecdate: draftedData.retrecdate ? parseDate(draftedData.retrecdate) : null,
        totdays: draftedData.totdays || '',
        retfrt: draftedData.retfrt || '0',
        tptcom: draftedData.tptcom || '0',
        netfrt: draftedData.netfrt || '0',
        baldeposit: draftedData.baldeposit || '0',
        paymentmode: draftedData.pymtmode || '0',
        tptname: draftedData.tptname || '0',
        retlocationto: draftedData.retlocationto || '0',
        retloadingexitdate: draftedData.retloadingexitdate ? parseDate(draftedData.retloadingexitdate) : null,
        retwt: draftedData.retwt || '0',
        retval: draftedData.retval || '0',
        retunloaddate: draftedData.retunloaddt ? parseDate(draftedData.retunloaddt) : null,
        frtmt: draftedData.frtmt || '0',
        advance: draftedData.advance || '0',
        biltycharge: draftedData.biltycharge || '0',
        deposit: draftedData.deposit || '0',
        balpending: draftedData.balancepending || '0',
        paymentstatus: draftedData.pymtstat || '0',
      }));
    }
  }, [draftedData]);


const handleTabEightChange = (e) => {
    const { name, value } = e.target;
    setTabeight({ ...tabeight, [name]: value });
};

const handleDateChangeEight = (date, id) => {
    setTabeight({ ...tabeight, [id]: date });
};

useEffect(() => {
    if (tabeight.retunloaddate && tabeight.retloadingexitdate) {
      const retunloaddate = tabeight.retunloaddate.getDate(); // Get the day of the month for the exit date
      const retloadingexitdate = tabeight.retloadingexitdate.getDate(); // Get the day of the month for the DC return date
  
      // Calculate the difference in days and add 1
    //   console.log(retunloaddate)
      const returnDays = (retunloaddate + 1) - retloadingexitdate;
  
      // Update your state with the calculated days
      // Assuming you have a state property for this, adjust accordingly if it's named differently
      setTabeight({ ...tabeight, totdays: returnDays.toString() });
    }
  }, [tabeight.retunloaddate, tabeight.retloadingexitdate]);

  useEffect(() => {
    if (tabeight.retfrt && tabeight.tptcom && tabeight.biltycharge) {
        const NetFRTVal = (parseFloat(tabeight.retfrt) - (parseFloat(tabeight.tptcom) + parseFloat(tabeight.biltycharge)));
        setTabeight(prevState => ({ ...prevState, netfrt: NetFRTVal.toString() }));
    }
}, [tabeight.retfrt, tabeight.tptcom, tabeight.biltycharge]);

useEffect(() => {
    if (tabeight.deposit) {
        const NetFRTVal = (parseFloat(tabeight.deposit));
        setTabeight(prevState => ({ ...prevState, baldeposit: NetFRTVal.toString() }));
    }
}, [tabeight.deposit]);

useEffect(() => {
    if (tabeight.netfrt && tabeight.deposit && tabeight.baldeposit) {
        const NetFRTVal = (parseFloat(tabeight.netfrt) - (parseFloat(tabeight.deposit) + parseFloat(tabeight.baldeposit)));
        setTabeight(prevState => ({ ...prevState, balpending: NetFRTVal.toString() }));
    }
}, [tabeight.netfrt && tabeight.deposit && tabeight.baldeposit]);

const validateInputstabEight = () => {

if (!tabeight.picktype) {
    // console.log("picktype")
    return false;
}else if(!tabeight.retlocationfrom){
    // console.log("picktype2")
    return false;
}else if(!tabeight.rethaultdays){
    // console.log("picktype4")
    return false;
}else if(!tabeight.retpkd){
    // console.log("picktype5")
    return false;
}else if(!tabeight.retfrt){
    // console.log("picktype8")
    return false;
}else if(!tabeight.tptcom){
    // console.log("picktype9")
    return false;
}else if(!tabeight.netfrt){
    console.log("picktype10")
    return false;
}else if(!tabeight.baldeposit){
    console.log("picktype11")
    return false;
}else if(!tabeight.paymentmode){
    console.log("picktype12")
    return false;
}else if(!tabeight.tptname){
    console.log("picktype13")
    return false;
}else if(!tabeight.retlocationto){
    console.log("picktype14")
    return false;
}else if(!tabeight.retwt){
    console.log("picktype16")
    return false;
}else if(!tabeight.retval){
    console.log("picktype17")
    return false;
}else if(!tabeight.frtmt){
    console.log("picktype19")
    return false;
}else if(!tabeight.advance){
    console.log("picktype20")
    return false;
}else if(!tabeight.biltycharge){
    console.log("picktype21")
    return false;
}else if(!tabeight.deposit){
    console.log("picktype22")
    return false;
}else if(!tabeight.balpending){
    console.log("picktype24")
    return false;
}else if(!tabeight.paymentstatus){
    console.log("picktype25")
    return false;
}

return true;
};

const handleNextClickTabEight = () => {
if (validateInputstabEight()) {
    setTabEightfilled(true)
    setActiveTabIndex(activeTabIndex + 1);
    } else {
    alert("Please fill in all required fields.");
    }
}



  //for tab Nine

const [TabNinefilled, setTabNinefilled] = useState(false);
  
const [tabnine, setTabnine] = useState({
    routeexp: '',
    revfrt:'',
    actualcost: '',
    percortoncost: '',
    savingrevvaluepercent: '',
    achsavingvaluepercent: '',
    totalexpense: '',
    costing: '',
    perkmcost: '',
    savingrevvalue: '',
    achsavingvalue: ''
});

useEffect(() => {

    setTabnine(prevState => ({ ...prevState, routeexp: tabseven.conscost.toString() }));

}, [tabseven.conscost]);

useEffect(() => {
    if(tabfive.loryrenttrip && tabfive.fixedcostdriversalary && tabfive.gps && tabnine.routeexp){
       const totalEXP = (parseFloat(tabfive.loryrenttrip) + parseFloat(tabfive.fixedcostdriversalary) + parseFloat(tabfive.gps) + parseFloat(tabnine.routeexp))
       const costingval = parseFloat(totalEXP - tabfour.revfrt)
       const ActualCost = parseFloat(costingval)
       const perKmCost = (totalEXP - tabfour.revfrt)/tabthree.GPSKM
       const percartoncost = tabsix.ttlpkt > 0 ? parseFloat(costingval/tabsix.ttlpkt) : 0;
       const savingRevVal = parseFloat(tabfive.bgtcost - (totalEXP - tabfour.revfrt))
       const savingRevValpercent = tabfive.bgtcost > 0 ? parseFloat(savingRevVal/tabfive.bgtcost) : 0;
       const actualSavingVal = parseFloat(tabfive.bgtcost - totalEXP);
       const actualSavValpercent = tabfive.bgtcost > 0 ? parseFloat(actualSavingVal/tabfive.bgtcost) : 0;
       setTabnine(prevState => ({ ...prevState, totalexpense: Math.round(totalEXP).toString() }));
       setTabnine(prevState => ({ ...prevState, costing: Math.round(costingval).toString() }));
       setTabnine(prevState => ({ ...prevState, actualcost: Math.round(ActualCost).toString() }));
       setTabnine(prevState => ({ ...prevState, perkmcost: Math.round(perKmCost).toString() }));
       setTabnine(prevState => ({ ...prevState, percortoncost: Math.round(percartoncost).toString() }));
       setTabnine(prevState => ({ ...prevState, savingrevvalue: Math.round(savingRevVal).toString() }));
       setTabnine(prevState => ({ ...prevState, savingrevvaluepercent: Math.round(savingRevValpercent).toString() }));
       setTabnine(prevState => ({ ...prevState, achsavingvalue: Math.round(actualSavingVal).toString() }));
       setTabnine(prevState => ({ ...prevState, achsavingvaluepercent: Math.round(actualSavValpercent).toString() }));
    }

}, [tabsix.ttlpkt, tabfive.bgtcost, tabthree.GPSKM, tabfive.loryrenttrip, tabfive.fixedcostdriversalary, tabfive.gps, tabnine.routeexp]);




const handleFinalSubmit = async (val) => {

    try{

        function formatDate(dateString) {
            if(!dateString){
                return '';
            }
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        }

        var isUpdateVal = true;
        if(sessionStorage.getItem('tripId') === 'null'){
            isUpdateVal = false
        }else if(sessionStorage.getItem('tripId') == '0'){
            isUpdateVal = false
        }

        setLoader(true);
    
        const requestBody = {
            isUpdate: isUpdateVal,
            isDraft: val,
            trip_ID: sessionStorage.getItem('tripId'),
            vechile_ID: V_ID,
            driverid: tabone.driverName,
            actionperformedby: sessionStorage.getItem('UserId'),
            vehiclE_NO: tabone.lorryNo,
            to: "string",
            nO_OF_STR: tabone.destination,
            exiT_DT: formatDate(tabtwo.exitDate),
            exiT_TIME: tabtwo.exitTime,
            dC_RET_DATE: formatDate(tabtwo.dcReturnDate),
            dC_RET_TIME: tabtwo.dcReturnTime,
            reT_HOURS: tabtwo.returnHours,
            reT_DAYS: tabtwo.returnDays,
            oP_KM: tabthree.opkm,
            cL_KM: tabthree.clkm,
            run_KM: tabthree.runkm,
            GPSKM: tabthree.GPSKM,
            GoogleKM: tabthree.GoogleKM,
            mtD_RUN_KM: tabthree.mtdRunkm,
            oP_DIESEL: tabfour.opdeisel,
            dieseL_CNG_FILL_IN_DC: tabfour.dcngfilldc,
            diE_CNG_FILL_ON_THE_WAY: tabfour.dcngfill,
            closinG_DIE_CNG: tabfour.closingdcng,
            dieseL_CNG_CUMP: tabfour.dcngconsumption,
            mtD_LORRY_DIESEL_CNG_CUMP: tabfour.mtdlorydcngconsumption,
            dieS_RATE___CNG_RATE__LT: tabfour.dcngrate,
            bgT_DSL_AVG: tabfour.bgtdslavg,
            acT_AVG_KM: tabfour.actavgkm,
            reT_TYPE: tabfour.rettype,
            reV_FRT: tabfour.revfrt,
            bgT_COST: tabfive.bgtcost,
            acT_COST: tabnine.actualcost,
            mkt: tabfive.mkt,
            lorrY_RENT_F_C: tabfive.loryrent,
            lorry_Rent_Per_Trip: tabfive.loryrenttrip,
            mtD_LORRY_WISE_RENT: tabfive.mtdloryrent,
            driveR_SALARY: tabfive.driversalary,
            fix_Cost_D_Salary: tabfive.fixedcostdriversalary,
            mtD_DRIVER_SALARY: tabfive.mtddriversalary,
            gps: tabfive.gps,
            routE_EXP_DIESEL: tabnine.routeexp,
            totaL_EXP: tabnine.totalexpense,
            costing: tabnine.costing,
            reV_FRT1: tabfour.revfrt,
            peR_KM_COST: tabnine.perkmcost,
            peR_CARTON_COST: tabnine.percortoncost,
            savinG__REV_VAL: tabnine.savingrevvalue,
            savinG__REV_VAL_: tabnine.savingrevvaluepercent,
            acH__SAVINGVAL: tabnine.achsavingvalue,
            acH__SAVINGVAL__: tabnine.achsavingvaluepercent,
            exiT_NO: tabsix.exitno,
            ttL_PKT: tabsix.ttlpkt,
            pkd: tabsix.pkd,
            qty: tabsix.qty,
            val: tabsix.value,
            bgT_TR_DAYS: tabsix.bgttrdays,
            exP_DEL_DT: tabsix.extdeldt,
            nO_OF_REV_LOAD: tabsix.revloads,
            aT_DC: tabfour.atdc,
            tot: tabfour.tot,
            reP___MTN: tabseven.repmtn,
            mtD_REP___MAINT: tabseven.mtdrepmaint,
            tolL_TAX_CASH: tabseven.totaltaxcash,
            mtD_TOLL_TAX_CASH: tabseven.mtdtolltaxcash,
            tolL_TAX_FAST_TAG: tabseven.totaltaxfastag,
            mtD_TOLL_TAX_FAST_TAG: tabseven.mtdtolltaxfastag,
            rto: tabseven.rto,
            mtD_RTO: tabseven.mtdrto,
            mechanicaL_REC: tabseven.mechanicalRec,
            mtD_MECHANICAL_REC: tabseven.mtdmechanicalrec,
            challan: tabseven.challan,
            mtD_CHALLAN: tabseven.mtdchallan,
            bordeR_EXP: tabseven.borderexp,
            mtD_BORDER_EXP: tabseven.mtdborderexp,
            loaD_UNLOAD: tabseven.loadunload,
            mtD_LOAD_UNLOAD: tabseven.mtdloadunload,
            inc: tabseven.inc,
            mtD_INC: tabseven.mtdinc,
            otheR_EXP: tabseven.otherexp,
            mtD_OTHER_EXP: tabseven.mtdotherexp,
            totaL_COST: tabseven.totalcost,
            conS_COST: tabseven.conscost,
            other_expense_remarks: tabseven.remark,
            ureaPurchase: tabseven.ureaPurchase,
            picK_TYPE: tabeight.picktype,
            tpT_NAME: tabeight.tptname,
            reT_LOCATION_FROM: tabeight.retlocationfrom,
            reT_LOCATION_TO: tabeight.retlocationto,
            reT_LOADING_DATE: formatDate(tabeight.retloadingdate),
            reT_LOADING_EXIT_DATE: formatDate(tabeight.retloadingexitdate),
            reT_LO_HALT_DAYS: tabeight.rethaultdays,
            reT_WT: tabeight.retwt,
            reT_PKD: tabeight.retpkd,
            reT_VAL: tabeight.retval,
            reT_REC_DATE: formatDate(tabeight.retrecdate),
            reT_UNLOAD_DT: formatDate(tabeight.retunloaddate),
            totdays: tabeight.totdays,
            frT_MT: tabeight.frtmt,
            reT_FRT: tabeight.retfrt,
            advance: tabeight.advance,
            tpT_COM: tabeight.tptcom,
            biltY_CHARGE: tabeight.biltycharge,
            neT_FRT: tabeight.netfrt,
            deposit: tabeight.deposit,
            baldeposit: tabeight.baldeposit,
            balancE_PENDING: tabeight.balpending,
            pymT_MODE: tabeight.paymentmode,
            pymT_STAT: tabeight.paymentstatus
        };
    
        // console.log(requestBody)
    
        const response = await axios.post(`${baseUrl}/api/VeichleTrip/Post_Veichle_Trip`, requestBody);
    
        console.log('Trip added successfully:', response.data);

        if(response.status === 200){
            if(val === true){
                setmessageAPI("Trip Details Draft Submitted Successfully...")
            }else{
                setmessageAPI("Trip Details Submitted Successfully...")
            }
            setTimeout(() => {
                setLoader(false);
                setshowPopup(true);
            }, 1500);
        }else{
            setmessageAPI('Error in Adding Trip Details...')
            setLoader(false);
            setshowPopup(true);
        }

    }catch (error) {
        console.error('Error adding project:', error);
    }   

}

const goBackHome = () => {
    navigate('/Trip/Moving')
}

const okButtonClicked = () =>{
    navigate('/Trip/Moving'); 
}


  
  

  return (
    <section className='dashboard-Mytask'>

    {loader && (
        <div className='loaderAdd'>
            <div className="cs-loader">
                <div className="cs-loader-inner" style={{width:'100%'}}>
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
            <div className='popupBox' style={{left:'40%'}}>
                <p className='messageAPI'>{messageAPI}</p>
                <button type='button' className='btn btn-primary graphiBtn' onClick={okButtonClicked}>Ok</button>
            </div>
        </div>

    )}
      
        <div className='dashboard-one'>
            <div className='left-dashboard-one d-flex align-items-center gap-2'>
                <Icon icon="ic:outline-arrow-back" className='IconVehicleD' onClick={goBackHome} />  
                <h5 className='dashHead m-0'>Moving Trip Details</h5>
            </div>
            <div className='right-dashboard-one'>
              <button type='button' className='btn btn-primary graphiBtn' onClick={() => handleFinalSubmit(true)}>Save as Draft</button>
            </div>
        </div>

        <div className="dashboard-three">
            
        <Tabs selectedIndex={activeTabIndex} onSelect={tabIndex => setActiveTabIndex(tabIndex)}>
        <div style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                background: 'transparent'
            }} />
            <div style={{ position: 'relative', zIndex: 0 }}>
                <TabList className='trip-tab'>
                    <Tab className={`trip-tab ${activeTabIndex === 0 ? 'activeTab' : ''} ${Tabonefilled ? 'detailsFilled' : ''}`}>
                        <span className={`trip-circle ${activeTabIndex === 0 ? 'activeTab' : ''} ${Tabonefilled ? 'detailsFilled' : ''}`}>1</span>
                        <p className='trip-text'>Truck Details</p>
                    </Tab>
                    <Tab className={`trip-tab ${activeTabIndex === 1 ? 'activeTab' : ''} ${Tabtwofilled ? 'detailsFilled' : ''}`}>
                        <span className={`trip-circle ${activeTabIndex === 1 ? 'activeTab' : ''} ${Tabtwofilled ? 'detailsFilled' : ''}`}>2</span>
                        <p className='trip-text'>Trip Start/End</p>
                    </Tab>
                    <Tab className={`trip-tab ${activeTabIndex === 2 ? 'activeTab' : ''} ${Tabthreefilled ? 'detailsFilled' : ''}`}>
                        <span className={`trip-circle ${activeTabIndex === 2 ? 'activeTab' : ''} ${Tabthreefilled ? 'detailsFilled' : ''}`}>3</span>
                        <p className='trip-text'>Kms Running</p> 
                    </Tab>
                    <Tab className={`trip-tab ${activeTabIndex === 3 ? 'activeTab' : ''} ${Tabfourfilled ? 'detailsFilled' : ''}`}>
                        <span className={`trip-circle ${activeTabIndex === 3 ? 'activeTab' : ''} ${Tabfourfilled ? 'detailsFilled' : ''}`}>4</span>
                        <p className='trip-text'>Deisel Consumption</p>
                    </Tab>
                    <Tab className={`trip-tab ${activeTabIndex === 4 ? 'activeTab' : ''} ${Tabfivefilled ? 'detailsFilled' : ''}`}>
                        <span className={`trip-circle ${activeTabIndex === 4 ? 'activeTab' : ''} ${Tabfivefilled ? 'detailsFilled' : ''}`}>5</span>
                        <p className='trip-text'>Route Expenses</p>
                    </Tab>
                    <Tab className={`trip-tab ${activeTabIndex === 5 ? 'activeTab' : ''} ${Tabsixfilled ? 'detailsFilled' : ''}`}>
                        <span className={`trip-circle ${activeTabIndex === 5 ? 'activeTab' : ''} ${Tabsixfilled ? 'detailsFilled' : ''}`}>6</span>
                        <p className='trip-text'>Package Details</p>
                    </Tab>
                    <Tab className={`trip-tab ${activeTabIndex === 6 ? 'activeTab' : ''} ${Tabsevenfilled ? 'detailsFilled' : ''}`}>
                        <span className={`trip-circle ${activeTabIndex === 6 ? 'activeTab' : ''} ${Tabsevenfilled ? 'detailsFilled' : ''}`}>7</span>
                        <p className='trip-text'>Other Expenses</p>
                    </Tab>
                    <Tab className={`trip-tab ${activeTabIndex === 7 ? 'activeTab' : ''} ${TabEightfilled ? 'detailsFilled' : ''}`}>
                        <span className={`trip-circle ${activeTabIndex === 7 ? 'activeTab' : ''} ${TabEightfilled ? 'detailsFilled' : ''}`}>8</span>
                        <p className='trip-text'>First Loading Point</p>
                    </Tab>
                    <Tab className={`trip-tab ${activeTabIndex === 8 ? 'activeTab' : ''} ${TabNinefilled ? 'detailsFilled' : ''}`}>
                        <span className={`trip-circle ${activeTabIndex === 8 ? 'activeTab' : ''} ${TabNinefilled ? 'detailsFilled' : ''}`}>9</span>
                        <p className='trip-text'>Trip Costing</p>
                    </Tab>
                </TabList>
            </div>
        </div>

            <TabPanel>
                <div className='detailsTrip'>
                    <div className='row d-flex'>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Lorry No.<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name="lorryNo" value={allMTD ? allMTD.loryno : ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Vehicle Type<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                   <input type='text' className='form-control' value={tabone.vehicleType} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                  <p className='vehicleDPara'>Destination<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8' style={{position:'relative'}}>
                                    <MultiSelectDropdownforTrips
                                        options={destination.map(destination => ({ value: destination.storeCode, label: destination.storeName }))}
                                        selectedValues={selectedDestination}
                                        onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions)}
                                    />
                                </div>
                                
                            </div>

                        </div>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Driver Name<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <select className="form-control" id="exampleFormControlSelect1" name="driverName" value={tabone.driverName} onChange={handleTabOneChangeDriver}>
                                        <option value="" >Select Driver</option>
                                        {driver.map(option => (
                                            <option key={option.d_ID} value={option.d_ID}>{option.emp_Name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Vehicle Fuel<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    {/* <select className="form-control" id="exampleFormControlSelect1" name="vehicleFuel" value={tabone.vehicleFuel} onChange={handleTabOneChange}>
                                        <option value="" >Select Fuel</option>
                                        <option value='DIESEL'>DIESEL</option>
                                        <option value='CNG'>CNG</option>
                                        <option value='EV'>EV</option>
                                    </select> */}
                                    <input type='text' className='form-control' value={tabone.vehicleFuel} readOnly></input>
                                </div>
                            </div>

                            {/* <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Select OFS<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <select className="form-control" id="exampleFormControlSelect1" name="selectOFS" value={tabone.selectOFS} onChange={handleTabOneChange}>
                                        <option value="" >Select OFS</option>
                                        <option value='OFS 1'>OFS 1</option>
                                        <option value='OFS 2'>OFS 2</option>
                                    </select>
                                </div>
                            </div> */}
                            
                        </div>

                    </div>
                </div>

                <div className='buttonClass first'>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabOne}>Next</button>
                </div>

            </TabPanel>

            <TabPanel>
                <div className='detailsTrip'>
                   <div className='row d-flex'>

                       <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Exit Date<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <DatePicker
                                        selected ={tabtwo.exitDate ? new Date(tabtwo.exitDate) : null}
                                        onChange={(date) => handleDateChange(date, 'exitDate')}
                                        className='form-control'
                                        id='exitDate'
                                        dateFormat="dd-MM-yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>DC Return Date<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <DatePicker
                                        selected ={tabtwo.dcReturnDate ? new Date(tabtwo.dcReturnDate) : null}
                                        onChange={(date) => handleDateChange(date, 'dcReturnDate')}
                                        className='form-control'
                                        id='dcReturnDate'
                                        dateFormat="dd-MM-yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Return Hours<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabtwo.returnHours} readOnly></input>
                                </div>
                            </div>

                       </div>

                       <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Exit Time<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='time' className='form-control' name='exitTime' value={tabtwo.exitTime} onChange={handleTabTwoChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>DC Return Time<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='time' className='form-control' name='dcReturnTime' value={tabtwo.dcReturnTime} onChange={handleTabTwoChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Return Days<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabtwo.returnDays || ''} readOnly></input>
                                </div>
                            </div>

                       </div>

                   </div>
                </div>

                <div className='buttonClass'>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabTwo}>Next</button>
                </div>

            </TabPanel>

            <TabPanel>
                <div className='detailsTrip'>
                    <div className='row d-flex'>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>OP KMs<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name="opkm" value={tabthree.opkm} onChange={handleTabThreeChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Run KMs<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabthree.runkm || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>GPS KMs<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name="GPSKM" value={tabthree.GPSKM} onChange={handleTabThreeChange}></input>
                                </div>
                            </div>

                        </div>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>CL KMs<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name="clkm" value={tabthree.clkm} onChange={handleTabThreeChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Run KMs<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabthree.mtdRunkm || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Google KMs<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name="GoogleKM" value={tabthree.GoogleKM} onChange={handleTabThreeChange}></input>
                                </div>
                            </div>
                            
                        </div>

                    </div>
                </div>

                <div className='buttonClass'>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabThree}>Next</button>
                </div>
            </TabPanel>

            <TabPanel>
                <div className='detailsTrip'>
                    <div className='row d-flex'>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>OP Diesel<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='opdeisel' value={tabfour.opdeisel} onChange={handleTabFourChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Diesel/CNG Fill on way<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='dcngfill' value={tabfour.dcngfill} onChange={handleTabFourChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Diesel/CNG Consumption<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfour.dcngconsumption || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Diesel/CNG Rate<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='dcngrate' value={tabfour.dcngrate} onChange={handleTabFourChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>ACT-AVG/KM<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfour.actavgkm || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>REV FRT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='revfrt' value={tabfour.revfrt} onChange={handleTabFourChange}></input>
                                </div>
                            </div>

                        </div>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Deisel/CNF Fill in DC<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='dcngfilldc' value={tabfour.dcngfilldc} onChange={handleTabFourChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Closing Deisel/CNG<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='closingdcng' value={tabfour.closingdcng} onChange={handleTabFourChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Lorry Desiel/CNG Consumption<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfour.mtdlorydcngconsumption || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>BGT-DSL-AVG<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='bgtdslavg' value={tabfour.bgtdslavg} onChange={handleTabFourChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET Type<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <select className="form-control" id="exampleFormControlSelect1" name='rettype' value={tabfour.rettype} onChange={handleTabFourChange}>
                                        <option value="" >Select RET Type</option>
                                        <option value='EMPTY'>EMPTY</option>
                                        <option value='GRT'>GRT</option>
                                        <option value='MKT LOAD'>MKT LOAD</option>
                                        <option value='OWN LOAD'>OWN LOAD</option>
                                    </select>
                                </div>
                            </div>
                            
                        </div>

                    </div>
                    <div className='bottom-text'>
                        <p className='textbttom'>Desiel CNG Costing</p>
                    </div>

                    <div className='row d-flex mt-4 align-items-center'>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>AT DC<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfour.atdc || ''} readOnly></input>
                                </div>
                            </div>
                        </div>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>TOT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfour.tot || ''} readOnly></input>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='buttonClass'>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabFour}>Next</button>
                </div>
            </TabPanel>

            <TabPanel>
                <div className='detailsTrip'>
                    <div className='row d-flex'>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>BGT Cost<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='bgtcost' value={tabfive.bgtcost} onChange={handleTabFiveChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MKT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='mkt' value={tabfive.mkt} onChange={handleTabFiveChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Lorry Rent/Trip<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfive.loryrenttrip || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Driver Salary<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={driverSalary || tabfive.driversalary} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Driver Salary<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfive.mtddriversalary || ''} readOnly></input>
                                </div>
                            </div>

                        </div>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Lorry Rent<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='loryrent' value={tabfive.loryrent || ''} onChange={handleTabFiveChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Lorry Rent<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfive.mtdloryrent || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Fixed Cost Driver Salary<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfive.fixedcostdriversalary || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>GPS<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfive.gps || ''} readOnly></input>
                                </div>
                            </div>
                            
                        </div>

                    </div>
                </div>

                <div className='buttonClass'>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabFive}>Next</button>
                </div>
            </TabPanel>

            <TabPanel>
                <div className='detailsTrip'>
                    <div className='row d-flex'>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Exit Number<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='exitno' value={tabsix.exitno} onChange={handleTabSixChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>PKD<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='pkd' value={tabsix.pkd} onChange={handleTabSixChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Value<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='value' value={tabsix.value} onChange={handleTabSixChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>EXT-DEL-DT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='extdeldt' value={tabsix.extdeldt} onChange={handleTabSixChange}></input>
                                </div>
                            </div>

                        </div>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>TTL PKT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='ttlpkt' value={tabsix.ttlpkt} onChange={handleTabSixChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>QTY<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='qty' value={tabsix.qty} onChange={handleTabSixChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>BGT TR-Days<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='bgttrdays' value={tabsix.bgttrdays} onChange={handleTabSixChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>No. of REV Loads<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='revloads' value={tabsix.revloads} onChange={handleTabSixChange}></input>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                <div className='buttonClass'>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabSix}>Next</button>
                </div>
            </TabPanel>

            <TabPanel>
                <div className='detailsTrip' style={{height:'56vh', overflowY:'auto'}}>
                    <div className='row d-flex'>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>REP & MTN<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='repmtn' value={tabseven.repmtn} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Total Tax Cash<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='totaltaxcash' value={tabseven.totaltaxcash} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Total Tax Fastag<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='totaltaxfastag' value={tabseven.totaltaxfastag} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RTO<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='rto' value={tabseven.rto} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Mechanical REC<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='mechanicalRec' value={tabseven.mechanicalRec} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Challan<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='challan' value={tabseven.challan} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Border Exp.<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='borderexp' value={tabseven.borderexp} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Load/Unload<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='loadunload' value={tabseven.loadunload} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>INC<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='inc' value={tabseven.inc} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Other Exp<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='otherexp' value={tabseven.otherexp} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Total Cost<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.totalcost} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Remark<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name="remark" value={tabseven.remark} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>


                        </div>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD REP & MAINT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.mtdrepmaint} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Toll Tax Cash<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.mtdtolltaxcash} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Toll Tax Fastag<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.mtdtolltaxfastag} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD RTO<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.mtdrto} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Mechanical REC<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.mtdmechanicalrec} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Challan<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.mtdchallan} readOnly ></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Border Exp.<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.mtdborderexp} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Load/Unload<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.mtdloadunload} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD INC<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.mtdinc} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>MTD Other Exp.<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.mtdotherexp} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>CONS Cost<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.conscost} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Urea Purchase<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name="ureaPurchase" value={tabseven.ureaPurchase} onChange={handleTabSevenChange}></input>
                                </div>
                            </div>
                            
                        </div>

                    </div>
                </div>

                <div className='buttonClass'>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabSeven}>Next</button>
                </div>
            </TabPanel>

            <TabPanel>
                <div className='detailsTrip' style={{height:'56vh', overflowY:'auto'}}>
                    <div className='row d-flex'>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Pick Type<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='picktype' value={tabeight.picktype} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET Location From<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='retlocationfrom' value={tabeight.retlocationfrom} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET Loading Date<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <DatePicker
                                        selected ={tabeight.retloadingdate ? new Date(tabeight.retloadingdate) : null}
                                        onChange={(date) => handleDateChangeEight(date, 'retloadingdate')}
                                        className='form-control'
                                        id='retloadingdate'
                                        dateFormat="dd-MM-yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET Halt Days<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='rethaultdays' value={tabeight.rethaultdays} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET PKD<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='retpkd' value={tabeight.retpkd} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET REC Date<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <DatePicker
                                        selected ={tabeight.retrecdate ? new Date(tabeight.retrecdate) : null}
                                        onChange={(date) => handleDateChangeEight(date, 'retrecdate')}
                                        className='form-control'
                                        id='retrecdate'
                                        dateFormat="dd-MM-yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>TOT Days<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabeight.totdays || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET FRT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='retfrt' value={tabeight.retfrt} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>TPT COM<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='tptcom' value={tabeight.tptcom} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>NET FRT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabeight.netfrt || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>BAL Deposit<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabeight.baldeposit || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Payment Mode<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='paymentmode' value={tabeight.paymentmode} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                        </div>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>TPT Name<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='tptname' value={tabeight.tptname} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET Location To<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='retlocationto' value={tabeight.retlocationto} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET Loading Exit Date<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <DatePicker
                                        selected ={tabeight.retloadingexitdate ? new Date(tabeight.retloadingexitdate) : null}
                                        onChange={(date) => handleDateChangeEight(date, 'retloadingexitdate')}
                                        className='form-control'
                                        id='retloadingexitdate'
                                        dateFormat="dd-MM-yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET WT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='retwt' value={tabeight.retwt} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET VAL<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='retval' value={tabeight.retval} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>RET Unload Date<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <DatePicker
                                        selected ={tabeight.retunloaddate ? new Date(tabeight.retunloaddate) : null}
                                        onChange={(date) => handleDateChangeEight(date, 'retunloaddate')}
                                        className='form-control'
                                        id='retunloaddate'
                                        dateFormat="dd-MM-yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>FRT/MT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='frtmt' value={tabeight.frtmt} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Advance<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='advance' value={tabeight.advance} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Bilty Charge<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='biltycharge' value={tabeight.biltycharge} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Deposit<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='deposit' value={tabeight.deposit} onChange={handleTabEightChange}></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>BAL Pending<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabeight.balpending || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Payment Status<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' name='paymentstatus' value={tabeight.paymentstatus} onChange={handleTabEightChange}></input>
                                </div>
                            </div>
                            
                        </div>

                    </div>
                </div>

                <div className='buttonClass'>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabEight}>Next</button>
                </div>
            </TabPanel>

            <TabPanel>
                <div className='detailsTrip' style={{height:'56vh', overflowY:'auto'}}>
                    <div className='row d-flex'>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Route Exp + Diesel<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabseven.conscost || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>REV FRT<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabfour.revfrt || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>ACT COST<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabnine.actualcost || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Per Corton Cost<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabnine.percortoncost || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Saving + REV Value%<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabnine.savingrevvaluepercent || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>ACH Saving Value%<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabnine.achsavingvaluepercent || ''} readOnly></input>
                                </div>
                            </div>

                        </div>

                        <div className='col-6'>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Total Expense<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabnine.totalexpense || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Costing<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabnine.costing || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Per KM Cost<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabnine.perkmcost || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>Saving + REV Value<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabnine.savingrevvalue || ''} readOnly></input>
                                </div>
                            </div>

                            <div className='row d-flex mb-2 align-items-center'>
                                <div className='col-4'>
                                    <p className='vehicleDPara'>ACH Saving Value<span className='mandatory'>*</span></p>
                                </div>
                                <div className='col-8'>
                                    <input type='text' className='form-control' value={tabnine.achsavingvalue || ''} readOnly></input>
                                </div>
                            </div>
                            
                        </div>

                    </div>
                </div>

                <div className='buttonClass'>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                   <button type='button' className='btn btn-primary graphiBtn' onClick={() => handleFinalSubmit(false)}>Submit</button>
                </div>
            </TabPanel>

        </Tabs>

        </div>

    </section>
  );
};

export default DraftTripDetails;





