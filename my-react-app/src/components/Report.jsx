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
import MultiSelectDropdown from './MultiSelectDropdown';

const Report = () => {

  const baseUrl = useApi();

  

  return (
    <h2>Coming Soon</h2>
  );
};

export default Report;