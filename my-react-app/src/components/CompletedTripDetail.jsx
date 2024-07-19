import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useApi } from '../APIConfig/ApiContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'datatables.net-dt/css/jquery.dataTables.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MultiSelectDropdown from './MultiSelectDropdown';
import * as XLSX from 'xlsx';
import { Icon } from '@iconify/react';


const Completed = () => {

  const baseUrl = useApi();
  const { tripid, tripstatus } = useParams();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [loader, setLoader] = useState(false);

  const [driver, setDriver] = useState([]);

  useEffect(() => {
      fetchData();
  }, []); 

  const fetchData = async () => {
    try {

        setLoader(true);

        const datadriver = {
            "C_ID": 0
        } 

        const responseDraft = await axios.post(`${baseUrl}/api/VeichleTrip/POST_Particular_Trip_details?tripid=${tripid}` );
        const responseDriver = await axios.post(`${baseUrl}/api/Driver/Get_DriverDetails`, datadriver );

        var allDriver = responseDriver.data.data;
        var myData = responseDraft.data.data[0];

        var myDriver = allDriver.find(driver => driver.d_ID == myData.driverid);
        // console.log(myData.driverid)
        
        if (myDriver) {
            var driverName = myDriver.emp_Name;
            setDriver(driverName)
        } else {
            setDriver("Not Found")
        }
        console.log(responseDraft.data.data[0])
        setTableData(responseDraft.data.data[0]);
        setExportData(responseDraft.data.data);

    } catch (error) {
      console.error('Error fetching data', error);
    }finally{
        setTimeout(()=>{
          setLoader(false)
        },2500)
    }
  };

//   useEffect(() => {
//     const table = new DataTable('#table', {
//       scrollY: '65vh',
//       destroy: true,
//       // scrollX: true,
//       ordering: false,
//       paging: false,
//       columnDefs: [
//         { "width": "5%", "targets": 0 },
//         { "width": "15%", "targets": 1 },
//         { "width": "25%", "targets": 2 },
//         { "width": "12.5%", "targets": 3 },
//         { "width": "12.5%", "targets": 4 },
//         { "width": "15%", "targets": 5 },
//         { "width": "15%", "targets": 6 },

//       ],
//       createdRow: function (row, data, dataIndex) {
//         const tdElements = row.getElementsByTagName('td');
//         for (let i = 0; i < tdElements.length; i++) {
//           tdElements[i].classList.add('DTMT-Head');
//         }
//       },
//     });

//     console.log(tableData)
//     table.clear();
//     if (!tableData || tableData.length === 0) {
//       table.clear().draw();
//     } else {
//     tableData.forEach((task, index) => {

//       const rowData = [
//         `VCT${index}`,
//         task.lorY_NO,
//         task.vehiclE_OWNER,
//         // formatTimestampToDDMMYYYY(task.driveR_DOB),
//         `${task.size} ${task.sizE_MEASUREMENT.trim()}`,
//         task.fuel,
//         `<div class="mainClassTd">
//            <div class="circleTd ${task.trip_Status}">
//               <img src="${tick}" class="ticktask" />
//            </div>
//            <p class="${task.trip_Status}">${task.trip_Status}</p>
//         </div>`,
//         `<div class="mainClassTd">
//            <img src="${viewImg}" class="view-details-link completed" data-v_ID="${encodeURIComponent(task.vId)}" />
//            <p class="imgText ${task.trip_Status} m-0">Download Report</p>
//         </div>`
//       ];

//       table.row.add(rowData);
//     });

//     function formatTimestampToDDMMYYYY(timestamp) {
//       if (!timestamp) {
//         return '';
//       }
    
//       const dateObject = new Date(timestamp);

//       if (isNaN(dateObject.getTime())) {
//         return '';
//       }
    
//       const day = String(dateObject.getDate()).padStart(2, '0');
//       const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//       const year = dateObject.getFullYear();
    
//       return `${day}/${month}/${year}`;
//     }
    

//     table.draw();

//   }
//     const addEventListeners = () => {
//     document.querySelectorAll('.view-details-link').forEach((link) => {
//       link.addEventListener('click', handleViewDetails);
//     });
//   }

//   addEventListeners();

//   table.on('draw.dt', addEventListeners);
   
//   }, [tableData]);

//   function handleViewDetails(event) {
//     const V_ID = event.currentTarget.getAttribute('data-v_ID');
//     console.log(V_ID)
//     // navigate(`/Driver/ViewDriverDetails/${D_ID}`);
//     // console.log(groupId);
//   } 

  const handleExport = () => {
    if (!Array.isArray(exportData)) {
        console.error('exportData is not an array');
        alert('Export data is not available.');
        return;
      }
    
    //   console.log(exportData);
    
    // Define headers
    const headers = [
        'VEHICLE NO','VEHICLE TYPE','DIVER NAME','TO','EXIT DT','EXIT TIME','DC-RET DATE','DC-RET TIME','RET HOURS','RET DAYS','OP KM','CL KM', 'RUN KM', 'MTD RUN KM', 'GPS KM', 'Googl KM',
        'OP DIESEL','DIESEL/CNG FILL IN DC','DIESEL/CNG FILL ON THE WAY','CLOSING DIE/CNG', 'DIESEL/CNG CUMP','MTD LORRY DIESEL/CNG CUMP',
        'DIES RATE/CNG RATE/LT', 'BGT-DSL-AVG', 'ACT AVG/KM','RET TYPE','REV FRT','BGT-COST','ACT-COST','MKT','LORRY RENT F.C','Lorry Rent Per Trip',
        'MTD LORRY WISE RENT','DRIVER SALARY','Fix Cost D-Salary','MTD DRIVER SALARY','GPS','ROUTE EXP+DIESEL','TOTAL EXP','COSTING','REV-FRT',
        'PER KM COST','PER CARTON COST','SAVING +REV.VAL', 'SAVING +REV.VAL%', 'ACH. SAVING VAL','ACH. SAVING VAL %','EXIT NO','TTL PKT ','PKD','QTY','VAL','BGT TR-DAYS',
        'EXP-DEL-DT','NO OF REV LOAD','ATDC','TOT', 'REP&MTN', 'MTD REP & MAINT','TOLL TAX-CASH','MTD TOLL TAX-CASH','TOLL TAX-FAST TAG', 'MTD TOLL TAX-FAST TAG','RTO',
        'MTD RTO','MECHANICAL-REC','MTD MECHANICAL-REC','CHALLAN','MTD CHALLAN','BORDER EXP.','MTD BORDER EXP.','LOAD/UNLOAD', 'MTD LOAD/UNLOAD',
        'INC','MTD INC','OTHER EXP','MTD OTHER EXP','TOTAL COST','CONS COST', 'PICK TYPE','TPT NAME','RET-LOCATION-FROM','RET-LOCATION-TO',
        'RET-LOADING DATE','RET-LOADING-EXIT-DATE','RET-LO-HALT-DAYS','RET-WT','RET-PKD','RET-VAL', 'RET-REC-DATE', 'RET-UNLOAD-DT', 'TOT DAYS',
        'FRT/MT', 'RET FRT','ADVANCE','TPT-COM','BILTY CHARGE','NET FRT','DEPOSIT','BAL DEPOSIT','BALANCE PENDING','PYMT-MODE', 'PYMT STAT'
    ];

    // Transform each task object into the desired row format
    const rowData = exportData.map(task => [
        task.vehicleno,
        sessionStorage.getItem('vehicletype') ? sessionStorage.getItem('vehicletype') : 'NA',
        driver ? driver : 'NA',
        // task.to,
        task.noofstr,
        task.exitdt,
        task.exittime,
        task.dcretdate,
        task.dcrettime,
        task.rethours,
        task.retdays,
        task.opkm,
        task.clkm,
        task.runKM,
        task.mtdrunkm,
        task.gpskm,
        task.googlekm,
        task.opdiesel,
        task.dieselcngfillindc,
        task.diecngfillontheway,
        task.closingdiecng,
        task.dieselcngcump,
        task.mtdlorrydieselcngcump,
        task.diesratecngratelt,
        task.bgtdslavg,
        task.actavgkm,
        task.rettype,
        task.revfrt,
        task.bgtcost,
        task.actcost,
        task.mkt,
        task.lorryrentfc,
        task.lorryRentPerTrip,
        task.mtdlorrywiserent,
        task.driversalary,
        task.fixCostDSalary,
        task.mtddriversalary,
        task.gps,
        task.routeexpdiesel,
        task.totalexp,
        task.costing,
        task.revfrT1,
        task.perkmcost,
        task.percartoncost,
        task.savingrevval,
        task.savingrevvaL1,
        task.achsavingval,
        task.achsavingvaL1,
        task.exitno,
        task.ttlpkt,
        task.pkd,
        task.qty,
        task.val,
        task.bgttrdays,
        task.expdeldt,
        task.noofrevload,
        task.atdc,
        task.tot,
        task.repmtn,
        task.mtdrepmaint,
        task.tolltaxcash,
        task.mtdtolltaxcash,
        task.tolltaxfasttag,
        task.mtdtolltaxfasttag,
        task.rto,
        task.mtdrto,
        task.mechanicalrec,
        task.mtdmechanicalrec,
        task.challan,
        task.mtdchallan,
        task.borderexp,
        task.mtdborderexp,
        task.loadunload,
        task.mtdloadunload,
        task.inc,
        task.mtdinc,
        task.otherexp,
        task.mtdotherexp,
        task.totalcost,
        task.conscost,
        task.picktype,
        task.tptname,
        task.retlocationfrom,
        task.retlocationto,
        task.retloadingdate,
        task.retloadingexitdate,
        task.retlohaltdays,
        task.retwt,
        task.retpkd,
        task.retval,
        task.retrecdate,
        task.retunloaddt,
        task.totdays,
        task.frtmt,
        task.retfrt,
        task.advance,
        task.tptcom,
        task.biltycharge,
        task.netfrt,
        task.deposit,
        task.baldeposit,
        task.balancepending,
        task.pymtmode,
        task.pymtstat
    ]);

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
    XLSX.writeFile(workbook, `Export_Trip_Data_${tripid}_${new Date().toISOString()}.xlsx`);
};

const goBackHome = () => {
    if(tripstatus == 'Moving'){
        navigate('/Trip/Moving')
    }else{
        navigate('/Trip/Completed')
    }
}

const [Tabonefilled, setTabonefilled] = useState(false)
const [Tabtwofilled, setTabtwofilled] = useState(false)
const [Tabthreefilled, setTabthreefilled] = useState(false)
const [Tabfourfilled, setTabfourfilled] = useState(false)
const [Tabfivefilled, setTabfivefilled] = useState(false)
const [Tabsixfilled, setTabsixfilled] = useState(false)
const [Tabsevenfilled, setTabsevenfilled] = useState(false)
const [TabEightfilled, setTabeightfilled] = useState(false)
const [TabNinefilled, setTabninefilled] = useState(false)

const handleNextClickTabOne = () => {

      setActiveTabIndex(activeTabIndex + 1);
    
  };

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

      <div className='dashboard-one'>
        <div className='left-dashboard-one d-flex align-items-center gap-2'>
            <div>
               <Icon icon="ic:outline-arrow-back" className='IconVehicleD' onClick={goBackHome} />  
            </div>
            <div>
                {tableData &&
                <h5 className='dashHead m-0'>Completed Trip Detail for - Vehicle No. {tableData.vehicleno} (view only)</h5>
                }
            </div>           
        </div>
        <div className='right-dashboard-one'>
          <button type='button' className='btn btn-primary graphiBtn' onClick={handleExport}>Export Data</button>
        </div>
      </div>

      <div className='dashboard-three' style={{height:'78vh', overflowY:'auto'}}>

        {tableData &&

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
                
                    <div style={{ position: 'relative', zIndex: 99 }}>
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
                                <span className={`trip-circle ${activeTabIndex === 4 ? 'activeTab' : ''} ${Tabfourfilled ? 'detailsFilled' : ''}`}>5</span>
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
                                        <p className='vehicleDPara'>Lorry No.</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name="lorryNo" value={tableData.vehicleno || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Vehicle Type</p>
                                    </div>
                                    <div className='col-8'>
                                    <input type='text' className='form-control' value={sessionStorage.getItem('vehicletype') || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                    <p className='vehicleDPara'>Destination</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retlocationfrom' value={tableData.noofstr || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                    
                                </div>

                            </div>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Driver Name</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retlocationfrom' value={driver || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                {/* <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Vehicle Fuel</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retlocationfrom'></input>
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
                                        <p className='vehicleDPara'>Exit Date</p>
                                    </div>
                                    <div className='col-8'>
                                    <input type='text' className='form-control' value={tableData.exitdt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>DC Return Date</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.dcretdate || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Return Hours</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.rethours || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                        </div>

                        <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Exit Time</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='time' className='form-control' name='exitTime' value={tableData.exittime || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>DC Return Time</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='time' className='form-control' name='dcReturnTime' value={tableData.dcrettime || ''}  readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Return Days</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.retdays || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                        </div>

                    </div>
                    </div>

                    <div className='buttonClass'>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabOne}>Next</button>
                    </div>

                </TabPanel>

                <TabPanel>
                    <div className='detailsTrip'>
                        <div className='row d-flex'>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>OP KMs</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name="opkm" value={tableData.opkm || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Run KMs</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.runKM || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>GPS KMs</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name="opkm" value={tableData.gpskm || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                            </div>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>CL KMs</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name="clkm" value={tableData.clkm || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Run KMs</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdrunkm || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Google KMs</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name="clkm" value={tableData.googlekm || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                    </div>

                    <div className='buttonClass'>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabOne}>Next</button>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className='detailsTrip'>
                        <div className='row d-flex'>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>OP Diesel</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='opdeisel' value={tableData.opdiesel || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Diesel/CNG Fill on way</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='dcngfill' value={tableData.diecngfillontheway || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Diesel/CNG Consumption</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.dieselcngcump || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Diesel/CNG Rate</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='dcngrate' value={tableData.diesratecngratelt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>ACT-AVG/KM</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.actavgkm || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>REV FRT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='revfrt' value={tableData.revfrt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                            </div>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Deisel/CNF Fill in DC</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='dcngfilldc' value={tableData.dieselcngfillindc || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Closing Deisel/CNG</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='closingdcng' value={tableData.closingdiecng || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Lorry Desiel/CNG Consumption</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdlorrydieselcngcump || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>BGT-DSL-AVG</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='bgtdslavg' value={tableData.bgtdslavg || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET Type</p>
                                    </div>
                                    <div className='col-8'>
                                    <input type='text' className='form-control' name='retlocationfrom' value={tableData.rettype || ''} readOnly style={{background:'#e7e7e7'}}></input>
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
                                        <p className='vehicleDPara'>AT DC</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.atdc || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>
                            </div>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>TOT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.tot || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className='buttonClass'>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabOne}>Next</button>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className='detailsTrip'>
                        <div className='row d-flex'>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>BGT Cost</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='bgtcost' value={tableData.bgtcost || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MKT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='mkt' value={tableData.mkt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Lorry Rent/Trip</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.lorryrentfc || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Driver Salary/Day</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.driversalary || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Driver Salary</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtddriversalary || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                            </div>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Lorry Rent/Day</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='loryrent' value={tableData.lorryRentPerTrip || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Lorry Rent</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdlorrywiserent || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Fixed Cost Driver Salary</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.fixCostDSalary || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>GPS</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.gps || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                    </div>

                    <div className='buttonClass'>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabOne}>Next</button>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className='detailsTrip'>
                        <div className='row d-flex'>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Exit Number</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='exitno' value={tableData.exitno || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>PKD</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='pkd' value={tableData.pkd || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Value</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='value' value={tableData.val || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>EXT-DEL-DT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='extdeldt' value={tableData.expdeldt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                            </div>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>TTL PKT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='ttlpkt' value={tableData.ttlpkt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>QTY</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='qty' value={tableData.qty || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>BGT TR-Days</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='bgttrdays' value={tableData.bgttrdays || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>No. of REV Loads</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='revloads' value={tableData.noofrevload || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div className='buttonClass'>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabOne}>Next</button>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className='detailsTrip' style={{height:'56vh', overflowY:'auto'}}>
                        <div className='row d-flex'>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>REP & MTN</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='repmtn' value={tableData.repmtn || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Total Tax Cash</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='totaltaxcash' value={tableData.tolltaxcash || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Total Tax Fastag</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='totaltaxfastag' value={tableData.tolltaxfasttag || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RTO</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='rto' value={tableData.rto || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Mechanical REC</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='mechanicalRec' value={tableData.mechanicalrec || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Challan</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='challan' value={tableData.challan || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Border Exp.</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='borderexp' value={tableData.borderexp || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Load/Unload</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='loadunload' value={tableData.loadunload || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>INC</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='inc' value={tableData.inc || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Other Exp</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='otherexp' value={tableData.otherexp || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Total Cost</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.totalcost || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>remark</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.other_expense_remarks || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>


                            </div>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD REP & MAINT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdrepmaint || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Toll Tax Cash</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdtolltaxcash || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Toll Tax Fastag</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdtolltaxfasttag || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD RTO</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdrto || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Mechanical REC</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdmechanicalrec || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Challan</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdchallan || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Border Exp.</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdborderexp || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Load/Unload</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdloadunload || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD INC</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdinc || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>MTD Other Exp.</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.mtdotherexp || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>CONS Cost</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.conscost || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                    </div>

                    <div className='buttonClass'>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabOne}>Next</button>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className='detailsTrip' style={{height:'56vh', overflowY:'auto'}}>
                        <div className='row d-flex'>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Pick Type</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='picktype' value={tableData.picktype || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET Location From</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retlocationfrom' value={tableData.retlocationfrom || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET Loading Date</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retlocationfrom' value={tableData.retloadingdate || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET Halt Days</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='rethaultdays' value={tableData.retlohaltdays || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET PKD</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retpkd' value={tableData.retpkd || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET REC Date</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retlocationfrom' value={tableData.retrecdate || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>TOT Days</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.totdays || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET FRT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retfrt' value={tableData.retfrt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>TPT COM</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='tptcom' value={tableData.tptcom || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>NET FRT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.netfrt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>BAL Deposit</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.baldeposit || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Payment Mode</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='paymentmode' value={tableData.pymtmode || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                            </div>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>TPT Name</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='tptname' value={tableData.tptname || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET Location To</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retlocationto' value={tableData.retlocationto || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET Loading Exit Date</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retlocationfrom' value={tableData.retloadingexitdate || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET WT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retwt' value={tableData.retwt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET VAL</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retval' value={tableData.retval || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>RET Unload Date</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='retlocationfrom' value={tableData.retunloaddt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>FRT/MT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='frtmt' value={tableData.frtmt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Advance</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='advance' value={tableData.advance || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Bilty Charge</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='biltycharge' value={tableData.biltycharge || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Deposit</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='deposit' value={tableData.deposit || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>BAL Pending</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.balancepending || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Payment Status</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' name='paymentstatus' value={tableData.pymtstat || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                    </div>

                    <div className='buttonClass'>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={handleNextClickTabOne}>Next</button>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className='detailsTrip' style={{height:'56vh', overflowY:'auto'}}>
                        <div className='row d-flex'>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Route Exp + Diesel</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.routeexpdiesel || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>REV FRT</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.revfrt || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>ACT COST</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.actcost || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Per Corton Cost</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.percartoncost || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Saving + REV Value%</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.savingrevvaL1 || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>ACH Saving Value%</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.achsavingvaL1 || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                            </div>

                            <div className='col-6'>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Total Expense</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.totalexp || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Costing</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.costing || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Per KM Cost</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.perkmcost || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>Saving + REV Value</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.savingrevval || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>

                                <div className='row d-flex mb-2 align-items-center'>
                                    <div className='col-4'>
                                        <p className='vehicleDPara'>ACH Saving Value</p>
                                    </div>
                                    <div className='col-8'>
                                        <input type='text' className='form-control' value={tableData.achsavingval || ''} readOnly style={{background:'#e7e7e7'}}></input>
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                    </div>

                    <div className='buttonClass'>
                    <button type='button' className='btn btn-primary graphiBtn' onClick={() => setActiveTabIndex(activeTabIndex - 1)}>Previous</button>
                    {/* <button type='button' className='btn btn-primary graphiBtn' onClick={() => handleFinalSubmit(false)}>Submit</button> */}
                    </div>
                </TabPanel>

            </Tabs>

        }
      </div>

    </section>
  );
};

export default Completed;