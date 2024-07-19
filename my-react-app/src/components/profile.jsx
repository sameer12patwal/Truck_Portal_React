import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from '../APIConfig/ApiContext';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Icon } from '@iconify/react';
import location from '../images/location.svg';
import sms from '../images/sms.svg';
import locBlue from '../images/locationBlue.svg';
import call from '../images/call.svg';
import link from '../images/linkk.svg';
import man from '../images/man.svg';

const Profile = () => {
  const baseUrl = useApi();
  const [profileData, setProfileData] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleShow = () => {
    setShowModal(true);
  }
  const handleClose = () => setShowModal(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setdepartmentId] = useState('');
  const [employeeCode, setemployeeCode] = useState('')

  
    const fetchProfileData = async () => {
      try {
        const bearerToken = sessionStorage.getItem('token');
        const userID = sessionStorage.getItem('userId');
        const response = await axios.get(
          `${baseUrl}/api/Employee/${userID}`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            }
          }
        );
        
        setProfileData(response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setAddress(response.data.address);
        setBio(response.data.bio);
        setMobile(response.data.mobile);
        setEmail(response.data.email);
        setdepartmentId(response.data.departmentId);
        setemployeeCode(response.data.employeeCode);

        setLoading(false);

      } catch (error) {
        console.error('Error fetching profile data', error);
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProfileData();
  }, [baseUrl]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleUpdateProfile = async () => {
    try {
      const employeeId = sessionStorage.getItem('userId');

      const formData = new FormData();
      formData.append('FirstName', firstName);
      formData.append('LastName', lastName);
      formData.append('Profile', profileImage);
      formData.append('Address', address);
      formData.append('Bio', bio);
      formData.append('Mobile', mobile);
      formData.append('Email', email);
      formData.append('EmployeeId', employeeId);
      formData.append('EmployeeCode', employeeCode);
      formData.append('DepartmentId', departmentId);
      formData.append('LastUpdatedBy', employeeId);
      formData.append('CreatedBy', employeeId);

      console.log(profileImage)

      console.log(formData)

      const response = await axios.put(`${baseUrl}/api/Employee/${employeeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile Updated:', response.data);

      handleClose();

      fetchProfileData();
    } catch (error) {
      console.error('Error updating profile', error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <section className='dashboard-Mytask'>
      {loading && (
          <div className="youtube-loader">
          {/* YouTube-style top red line loader */}
          <div className="loader-bar"></div>
        </div>
      )}
      <div className='up-body-profile'>
        <div className='color-up-profile'>
            <sapn className='iconEdit' onClick={handleShow}><Icon icon="uil:edit" /></sapn>
        </div>
        <div className='info-up-profile'>
          <div className='img-box-profile mb-2'>
          {profileData && (
            
            <img src={profileData.profilePic || man} alt='Profile' className='profile-image' />
          )}
          </div>
          {profileData && (
            <>
              <h6 className='profile-Name'>{profileData.firstName} {profileData.lastName}</h6>
              <p className='profile-desgination mb-1'>{profileData.department.departmentName}</p>
              <p className='profile-desgination mb-0'>
                <img src={location} alt='Location' className='location-icon' />
                {profileData.address}
              </p>
            </>
          )}
        </div>
      </div>

      <div className='down-body-profile'>
        <div className='left-body-profile'>
          <h6 className='Bio-profile'>Bio</h6>
          {profileData && (
            <p className='profile-desgination'>{profileData.bio}</p>
          )}
        </div>
        <div className='right-body-profile'>
          {profileData && (
            <>
              <div className='Email-rofile d-flex align-items-center gap-2 mb-2'>
                <img src={sms} alt='Icon' className='profile-icons' />
                <p className='email-info m-0'>{profileData.email}</p>
              </div>
              <div className='Email-rofile d-flex align-items-center gap-2 mb-2'>
                <img src={locBlue} alt='Icon' className='profile-icons' />
                <p className='email-info m-0'>{profileData.address}</p>
              </div>
              <div className='Email-rofile d-flex align-items-center gap-2 mb-2'>
                <img src={call} alt='Icon' className='profile-icons' />
                <p className='email-info m-0'>{profileData.mobile}</p>
              </div>
              <div className='Email-rofile d-flex align-items-center gap-2 mb-2'>
                <img src={link} alt='Icon' className='profile-icons' />
                <p className='email-info m-0'><span>EC: </span>{profileData.employeeCode}</p>
              </div>
            </>
          )}
        </div>
      </div>


      <Modal show={showModal} onHide={handleClose} size="md">
        <Modal.Header>
          <div></div>
          <div className='text-center'>
            <h4 className='createTask-Head m-0'>Edit Profile</h4>
            <p className='m-0' style={{fontSize:'12px'}}>Update the required details for the Editing your Profle</p>
          </div>
          <button type="button" className='closeBtn' onClick={handleClose}>X</button>
        </Modal.Header>
        <Modal.Body>
            <form encType="multipart/form-data">
                <div className='d-flex gap-3'>
                    <div className="form-group mb-2 w-50">
                        <label className='pb-1' for="AddTask" style={{fontSize: '14px'}}>Add First Name</label>
                        <input type="text" className="form-control" id="" aria-describedby="emailHelp" value={firstName} placeholder="Enter First Name" onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="form-group mb-2 w-50">
                        <label className='pb-1' for="AddTask" style={{fontSize: '14px'}}>Add Last Name</label>
                        <input type="text" className="form-control" id="" aria-describedby="emailHelp" value={lastName} placeholder="Enter Last Name" onChange={(e) => setLastName(e.target.value)} />
                    </div>
                </div>
                <div className='d-flex gap-3 mb-2'>
                    <div className="form-group w-100">
                       <label className='pb-1' for="exampleFormControlSelect1" style={{fontSize: '14px'}}>Email</label>
                       <input type="text" className="form-control" id="" aria-describedby="emailHelp" value={email} placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group w-100">
                       <label className='pb-1' for="exampleFormControlSelect1" style={{fontSize: '14px'}}>Phone Number</label>
                       <input type="text" className="form-control" id="" aria-describedby="emailHelp" value={mobile} placeholder="Enter Your Phone no." onChange={(e) => setMobile(e.target.value)} />
                    </div>
                </div>
              {/* <div className='d-flex gap-3 mb-2'>
                
              </div> */}
                <div className="form-group w-100">
                    <label className='pb-1' for="exampleFormControlSelect1" style={{fontSize: '14px'}}>Address</label>
                    <input type="text" className="form-control" id="" aria-describedby="emailHelp" value={address} placeholder="Enter Your Address" onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group mb-2">
                  <label className='pb-1' for="exampleFormControlTextarea1" style={{fontSize: '14px'}}>Bio</label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" rows="2" value={bio}  placeholder="Add Your Bio" onChange={(e) => setBio(e.target.value)}></textarea>
                </div>
                <div className="input-group mb-3">
                  <label className='p-0' for="exampleFormControlTextarea1" style={{fontSize: '14px'}}>Profile Image</label>
                  <div className="custom-file w-100 mt-1 p-1">
                  <input
                  type="file"
                  className="custom-file-input"
                  id="profileImage"
                  onChange={handleProfileImageChange}
                  />
                  </div>
                </div>
                <div className='d-flex justify-content-center'>
                  <button type='button' className='btn btn-primary graphiBtn' onClick={handleUpdateProfile}>
                     Update Profile
                  </button> 
                </div> 
            </form>

        </Modal.Body>

      </Modal>


    </section>
  );
};

export default Profile;
