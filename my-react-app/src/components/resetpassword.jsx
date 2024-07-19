import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/style.css'
import Loginlogo from '../images/Login-logo.png'
import LoginBG from '../images/Login_bg.png'
import Dashboard from './layout';
import Loader from './loader';
import { useApi } from '../APIConfig/ApiContext';
import { Icon } from '@iconify/react';
import * as jwt from 'jsonwebtoken-esm';



function Login(){

    const { emailid, token } = useParams();

    console.log(emailid)
    console.log(token)

    const baseUrl = useApi();

    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [success , setSucess] = useState(false);

    const [confirmPass, setconfirmPass] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

     const navigate = useNavigate();

     function goLogin(){
        setSucess(false);
        setPassword('');
        setconfirmPass('');
        window.location.href = 'http://samify.xyz/'
     }
      
        const Resetbtn = async () => {
          try {
            setLoading(true);
            let newemail = emailid;
            newemail = newemail.replace(/^'|'$/g, '');
            const response = await axios.post(`${baseUrl}/api/auth/changepassword`, {
              email: newemail,
              password: password,
            });

            console.log(newemail)
            console.log(password)

            console.log('Password reset successfully:', response.data);
            setSucess(true)

          } catch (error) {
            console.error('Login failed', error);
            setLoading(false);
            setShowErrorPopup(true);
          }finally {
            setLoading(false);
          }
        }

        function ForgotPassBtn(){
           let loginScreen = document.getElementById('login-screen');
           let forgotScreen = document.getElementById('forgot-screen');
           loginScreen.style.display = 'none';
           forgotScreen.style.display = 'block';
        }

        const loginScreenRef = useRef(null);
        const handleScrollToLogin = () => {
            if (loginScreenRef.current) {
              loginScreenRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          };
          

    return(
    <>
    {loading && <Loader />}
        {showErrorPopup && (
            <div className="error-popup">
                <Icon icon="material-symbols:error-outline" className='error-login' />
                <p className='projectDetailsp redp mt-3 mb-0'>Issue while Login you in, try after sometime</p>
                <p className='projectDetailsp'>if problem persist, Contact Admin </p>
                <button className='btn btn-primary' onClick={() => setShowErrorPopup(false)}>OK</button>
            </div>
        )}

        {success &&(
            <div className='box-full-popup'>
                <div className="error-popup">
                    <Icon icon="ep:success-filled" className='error-login' />
                    <p className='projectDetailsp redp mt-3 mb-0'>Success</p>
                    <p className='projectDetailsp'>You Have Successfully Reset your Password </p>
                    <button className='btn btn-primary' onClick={goLogin}>Login</button>
                </div>
            </div>
        )}
        <section className='login-page'>
            <div className='row d-flex m-0'>
                <div className='login-bg-area col-lg-6 col-12 col-sm-12 col-xs-12 p-0 align-items-center d-flex justify-content-end' style={{backgroundImage:` url(${LoginBG})`}}>
                     <div className='textual-area-box'>
                        <h1 className='text-white'>Welcome to</h1>
                        <h1 className='text-white'>Task Tracker</h1>
                        <p className='text-white'>
                            Today is a new day. It's your day. You shape it. 
                            Sign in to start managing your projects.</p>
                     </div>
                </div>
                <p className='ptagscroll' onClick={handleScrollToLogin}>tap to Reset <Icon icon="mingcute:down-fill" /></p>
                <div className='col-lg-6 col-12 col-sm-12 col-xs-12 mobileloginDownScreen' ref={loginScreenRef}>
                    <div className='align-items-center d-flex justify-content-center p-4'>
                        <div className='text-center'>
                            <img src={Loginlogo} className='loginlogo' alt='login-logo'/>
                            {/* <h1 className='text-black'>Graphi</h1> */}
                        </div>
                    </div>
                    <div className='form-login' id='login-screen'>

                        <h3 className='Login-Head'>
                            Reset Password
                        </h3>
                        <p>Reset your Account Credentials</p>
                        <form>
                            <div className="form-group login-page pb-4">
                                <label className='label-login' for="exampleInputPassword1">New Password</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Confirm Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button type="button" className="btn btn-primary login-btn w-100" onClick={Resetbtn}>{loading ? 'Reseting ...' : 'Reset'}</button>
                            
                            <div className='d-flex justify-content-center mt-3' onClick={ForgotPassBtn}>
                               <p className='forgot-pass'>Forgot Password ?</p>
                            </div>
                        </form>

                    </div>

                </div>
            </div>
        </section>
    </>
   )
}

export default Login