import React, { useEffect, useState } from 'react';
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
import oneT from '../images/onebox.png';
import twoT from '../images/twobox.png';
import threeT from '../images/threebox.png';
import fourT from '../images/fourbox.png';
import fiveT from '../images/fivebox.png';
import sixT from '../images/sixbox.png';
import sevenT from '../images/sevenbox.png';
import MultiSelectDropdown from './MultiSelectDropdown';

const RouteM = () => {

  const baseUrl = useApi();

  

  return (
    <h2>Coming Soon</h2>
  );
};

export default RouteM;