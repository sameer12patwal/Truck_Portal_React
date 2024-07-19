import React from 'react';
import { useState, useEffect,useRef } from 'react';
import '../css/style.css';
import Loginlogo from '../images/Login-logo.svg';
import one from '../images/one.svg';
import two from '../images/two.svg';
import three from '../images/three.svg';
import four from '../images/four.svg';
import five from '../images/five.svg';
import six from '../images/six.svg';
import trip from '../images/trip.svg'
import userS from '../images/userS.svg'
import seven from '../images/seven.svg';
import hamburger from '../images/ham.png';
import tri from '../images/triline.svg';
import bell from '../images/bell.svg';
import profileImg from '../images/profileImg.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Profile from './profile';

const Layout = ({ children }) => {

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('UserId') !== null || undefined || "";
  
    if (!isAuthenticated) {

      window.location.href = '/';
    }
    const storedActiveLink = sessionStorage.getItem('activeLink');
    if (storedActiveLink) {
      setActiveLink(storedActiveLink);
    }

    if(sessionStorage.getItem('dropdownStatus') === 'one'){
      setIsReportDropdownOpen(true)
      setIsTripDropdownOpen(false)
    }else if(sessionStorage.getItem('dropdownStatus') === 'two'){
      setIsReportDropdownOpen(false)
      setIsTripDropdownOpen(true)
    }else{
      setIsReportDropdownOpen(true)
      setIsTripDropdownOpen(false)
    }

  }, []);

  const navigate = useNavigate();

  const [isNavMinimized, setIsNavMinimized] = useState(false);
  const [isProfilePopupVisible, setIsProfilePopupVisible] = useState(false);
  const profilePopupRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profilePopupRef.current && !profilePopupRef.current.contains(event.target)) {
        setIsProfilePopupVisible(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const toggleProfilePopup = () => {
    setIsProfilePopupVisible((prev) => !prev);
  };

  const toggleNavigation = () => {
    setIsNavMinimized(!isNavMinimized);
  };

  const [activeLink, setActiveLink] = useState('/Vehicle');

  const navigateTo = (link) => {
    setActiveLink(link);
    sessionStorage.setItem('activeLink', link);
  };

  const isLinkActive = (link) => link === activeLink;

  function logoutbtn(){
    sessionStorage.clear();
    navigate("/")
  }

  const [isReportDropdownOpen, setIsReportDropdownOpen] = useState();
  const toggleReportDropdown = () => {
    sessionStorage.setItem('dropdownStatus', 'one')
    setIsTripDropdownOpen(false)
    setIsReportDropdownOpen(!isReportDropdownOpen);
    setActiveLink(isReportDropdownOpen ? '' : `${sessionStorage.getItem('activeLink')}`);
  };

  const [isTripDropdownOpen, setIsTripDropdownOpen] = useState();
  const toggleTripDropdown = () => {
    setIsReportDropdownOpen(false)
    sessionStorage.setItem('dropdownStatus', 'two')
    setIsTripDropdownOpen(!isTripDropdownOpen);
    setActiveLink(isTripDropdownOpen ? '' : `${sessionStorage.getItem('activeLink')}`);
  };

 
  return (
    <div>
      
      <section className='section-dashboard d-flex'>
          <div className={`left-side-dash ${isNavMinimized ? 'nav-minimized' : ''}`}>
            <nav className='navigationBar'>
              <img src={hamburger} className='Humburger-header mobile' onClick={toggleNavigation}/>
              <div className='text-center p-4'>
                <img src={Loginlogo} className={`graphilogoNav ${isNavMinimized ? 'nav-minimizedImg' : ''}`} alt='login-logo'/>
              </div>
              <ul className='ul-nav'>             
              <li className='list-Nav'><Link onClick={toggleReportDropdown} className='anchorNav'><img src={six} className='nav-a-icon'></img><span className={`${isNavMinimized ? 'nav-minimizedSpan' : ''}`}>Master</span></Link></li>                             
              {isReportDropdownOpen && (
                <ul className='ul-drop'>
                  <li className='list-Nav'><Link to="/Vehicle" onClick={() => navigateTo('/Vehicle')} className={isLinkActive('/Vehicle') ? 'active' : 'anchorNav'}><Icon className='naviconify' icon="mdi:truck" /><span className={`${isNavMinimized ? 'nav-minimizedSpan' : ''}`}>Vehicle</span></Link></li>                
                  <li className='list-Nav'><Link to="/Driver" onClick={() => navigateTo('/Driver')} className={isLinkActive('/Driver') ? 'active' : 'anchorNav'}><Icon className='naviconify' icon="healthicons:truck-driver"/><span className={`${isNavMinimized ? 'nav-minimizedSpan' : ''}`}>Driver</span></Link></li>   
                  <li className='list-Nav'><Link to="/Route" onClick={() => navigateTo('/Route')} className={isLinkActive('/Route') ? 'active' : 'anchorNav'}><Icon className='naviconify' icon="gis:route-start" /><span className={`${isNavMinimized ? 'nav-minimizedSpan' : ''}`}>Route</span></Link></li>   
                  <li className='list-Nav'><Link to="/Costing" onClick={() => navigateTo('/Costing')} className={isLinkActive('/Costing') ? 'active' : 'anchorNav'}><Icon className='naviconify' icon="mdi:rupee" /><span className={`${isNavMinimized ? 'nav-minimizedSpan' : ''}`}>Costing</span></Link></li>                             
                </ul>
              )}

              <li className='list-Nav'><Link onClick={toggleTripDropdown} className='anchorNav'><img src={trip} className='nav-a-icon' style={{width: '24px'}}></img><span className={`${isNavMinimized ? 'nav-minimizedSpan' : ''}`}>Trip</span></Link></li>                             
              {isTripDropdownOpen && (
                <ul className='ul-drop'>
                  <li className='list-Nav'><Link to="/Trip/StartTrip" onClick={() => navigateTo('/Trip/StartTrip')} className={isLinkActive('/Trip/StartTrip') ? 'active' : 'anchorNav'}><Icon className='naviconify' icon="mdi:truck" /><span className={`${isNavMinimized ? 'nav-minimizedSpan' : ''}`}>Start Trip</span></Link></li>                
                  <li className='list-Nav'><Link to="/Trip/Moving" onClick={() => navigateTo('/Trip/Moving')} className={isLinkActive('/Trip/Moving') ? 'active' : 'anchorNav'}><Icon className='naviconify' icon="healthicons:truck-driver"/><span className={`${isNavMinimized ? 'nav-minimizedSpan' : ''}`}>Moving</span></Link></li>   
                  <li className='list-Nav'><Link to="/Trip/Completed" onClick={() => navigateTo('/Trip/Completed')} className={isLinkActive('/Trip/Completed') ? 'active' : 'anchorNav'}><Icon className='naviconify' icon="gis:route-start" /><span className={`${isNavMinimized ? 'nav-minimizedSpan' : ''}`}>Completed</span></Link></li>                                
                  {/* <li className='list-Nav'><Link to="/Trip/Report" onClick={() => navigateTo('/Trip/Report')} className={isLinkActive('/Trip/Report') ? 'active' : 'anchorNav'}><Icon className='naviconify' icon="mdi:rupee" /><span className={`${isNavMinimized ? 'nav-minimizedSpan' : ''}`}>Reports</span></Link></li>  */}
                </ul>
              )}

              </ul>
            </nav> 
        </div>
          <div className={`right-side-dash ${isNavMinimized ? 'right-maximized' : ''}`}>
              <header className='Header-main'>
                  <div className='parent-header'>
                      <div className='left-side-head'>
                          {/* <img src={hamburger} className='Humburger-header' onClick={toggleNavigation}/> */}
                      </div>
                      <div className='right-side-head'>
                          {/* <img src={tri} className='right-head-img' /> */}
                          {/* <img src={bell} className='right-head-img' /> */}
                          <div className='profile-img-container'>
                            <img src={sessionStorage.getItem('picture') || profileImg} className='right-head-img-profile' onClick={toggleProfilePopup}/>
                            {isProfilePopupVisible && (
                              <div className='profile-popup' ref={profilePopupRef}>
                                <div className='p-3 text-center'>
                                  <div className='profileDropdownImg'>
                                     <img src={sessionStorage.getItem('picture') || profileImg} className='right-head-img-profileBig' />
                                  </div>                                  
                                  <h6 className='m-0 pt-2'>{sessionStorage.getItem('username')}</h6>
                                  <h6 className='m-0 pt-1' style={{fontSize:'12px'}}>{sessionStorage.getItem('designation')}</h6>
                                </div>
                                <div>
                                  {/* <div className='focusLogout d-flex border-bottom border-top p-2 align-items-center gap-2 custom-pointer' onClick={profilebtn}>
                                    <Icon icon="ri:edit-box-line" className='layoutPopup' />
                                    <p className='paralog m-0' style={{fontSize:'14px', color:'#9b9b9b', fontWeight:'500'}}>View Profile</p>
                                  </div> */}
                                  <div className='focusLogout d-flex align-items-center p-2 gap-2 custom-pointer' onClick={logoutbtn}>
                                    <Icon icon="material-symbols:logout" className='layoutPopup' />
                                    <p className='paralog m-0' style={{fontSize:'14px', color:'#9b9b9b', fontWeight:'500'}}>Log Out</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                      </div>
                  </div>
              </header>
              <div className='main-dashboard'>
                {children}
              </div>
          </div>
      </section>
    </div>
  );
};

export default Layout;