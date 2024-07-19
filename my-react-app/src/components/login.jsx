import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/style.css'
import Loginlogo from '../images/Login-logo.png'
import LoginBG from '../images/Bg_img.jpeg'
import Dashboard from './layout';
import Loader from './loader';
import { useApi } from '../APIConfig/ApiContext';
import { Icon } from '@iconify/react';
import * as jwt from 'jsonwebtoken-esm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';



function Login(){

    const baseUrl = useApi();

    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [success , setSucess] = useState(false);
    const [messageAPI , setmessageAPI] = useState('');

    const [email, setEmail] = useState('');
    const [Forgetemail, setForgetEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // const [Username, setUsername] = useState('');
    // const [License, setLicense] = useState('');
     const navigate = useNavigate();

     
      
        const loginbtn = async (e) => {
          e.preventDefault();
          try {

            if (!email) {
              setEmailError('Oops!!!, You have left Email id empty...')
              return;
            }

            if(!password){
              setPassError('Oops!!!, You have left Password Empty...')
              return;
            }
        
            setLoading(true);
            const response = await axios.post(`${baseUrl}/api/Login`, {
              Username: email,
              Password: password,
            });

            // console.log(response.data.data)

            if(response.data.status === true){

              const StoreCode  = response.data.data.store_Code;
              const StoreName =response.data.data.store_Name;
              const username = response.data.data.user_Name;
              const UserId = response.data.data.userID;


              sessionStorage.setItem('StoreCode', StoreCode);
              sessionStorage.setItem('StoreName', StoreName);
              sessionStorage.setItem('username', username);
              sessionStorage.setItem('UserId', UserId);

              navigate("/Vehicle")
            }else{
              setmessageAPI(response.data.message)
              setLoading(false);
              setShowErrorPopup(true);
            }

          } catch (error) {
            console.error('Login failed', error);
            // setLoading(false);
            // setShowErrorPopup(true);
          }finally {
            setLoading(false);
          }
        }

        useEffect(()=>{
            if(sessionStorage.getItem('UserId'))
            {
                // loaderGet();
                navigate("/Vehicle")
            }
            else if(!sessionStorage.getItem('UserId'))
            {
                navigate("/")
            }
            // navigate("/Dashboard")  
        },[])

        function ForgotPassBtn(){
           let loginScreen = document.getElementById('login-screen');
           let forgotScreen = document.getElementById('forgot-screen');
           loginScreen.style.display = 'none';
           forgotScreen.style.display = 'block';
        }

        function loginScreenBtn(){
            let loginScreen = document.getElementById('login-screen');
           let forgotScreen = document.getElementById('forgot-screen');
           loginScreen.style.display = 'block';
           forgotScreen.style.display = 'none';
        }

        const loginScreenRef = useRef(null);
        const handleScrollToLogin = () => {
            if (loginScreenRef.current) {
              loginScreenRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          };

          function generateToken() {
            const currentTimestamp = Date.now();
            const expirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds
          
            const tokenPayload = {
              timestamp: currentTimestamp + expirationTime,
            };
          
            const token = btoa(JSON.stringify(tokenPayload));
            return token;
          }
          

        const forgotPassword = async () => {
            try {

              if (!Forgetemail) {
                setEmailError('Oops!!!, You have left Email id empty...')
                return;
              }

                setLoading(true);

                const resetToken = generateToken();

              const emailBody = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Password Reset</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;background-color:#f4f4f4}.container{max-width:600px;margin:20px auto;padding:20px;background-color:#fff;box-shadow:0 0 10px rgba(0,0,0,.1);border-radius:5px}h2{color:#333}p{color:#666}a{color:#007bff;text-decoration:none}.button{display:inline-block;padding:10px 20px;font-size:16px;font-weight:700;text-align:center;text-decoration:none;background-color:#007bff;color:#fff;border-radius:5px}</style></head><body><div class='container'><h2>Password Reset</h2><p>Hello '"+ Forgetemail +"',</p><p>We received a request to reset your password. Click the button below to reset it:</p><a class='button' href=http://samify.xyz/reset-password/'"+Forgetemail+"'/'"+resetToken+"'>Reset Password</a><p>If you didn't request a password reset, you can ignore this email.</p><p>Thanks,<br>Task Tracker Team</p></div></body></html>";
           
              const response = await axios.post(`${baseUrl}/api/auth/resetpassword`, {
                email: Forgetemail,
                body: emailBody,
                subject: 'Reset Password Task Tracker App',
              });

            //   console.log(personalizedEmailBody)
              console.log(Forgetemail)
        
              console.log('Password reset email sent successfully:', response.data);
              setSucess(true);
              // window.location.href = 'http://127.0.0.1:5173/'

            } catch (error) {
              console.error('Error sending password reset email:', error);
            } finally {
              setLoading(false);
            }
          };

          function goBack(){
              setSucess(false);
              window.location.href = 'http://samify.xyz/'
          }

          const [emailError, setEmailError] = useState('');
          const [passError, setPassError] = useState('');
          const [passwordVisible, setPasswordVisible] = useState(false);

          const togglePasswordVisibility = () => {
            setPasswordVisible(!passwordVisible);
          };

          const validateEmail = (inputEmail) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!inputEmail) {
              setEmailError('Email is required');
            } else if (!emailRegex.test(inputEmail)) {
              setEmailError('Enter a valid email address');
            } else {
              setEmailError('');
            }
          };
          

    return(
    <>
    {loading && <Loader />}
        {showErrorPopup && (
            <div className="error-popup">
                <Icon icon="material-symbols:error-outline" className='error-login' />
                <p className='projectDetailsp redp mt-3 mb-0'>{messageAPI}</p>
                <p className='projectDetailsp'>if problem persist, Contact Admin </p>
                <button className='btn btn-primary graphiBtn' onClick={() => setShowErrorPopup(false)}>OK</button>
            </div>
        )}
        {success &&(
            <div className='box-full-popup'>
                <div className="error-popup">
                    <Icon icon="ep:success-filled" className='error-login' />
                    <p className='projectDetailsp redp mt-3 mb-0'>Success</p>
                    <p className='projectDetailsp'>Password Reset Link Sent to your Email </p>
                    <button className='btn btn-primary graphiBtn' onClick={goBack}>Ok</button>
                </div>
            </div>
        )}
        <section className='login-page' style={{backgroundImage:` url(${LoginBG})`}}>
            <div className='row d-flex m-0'>
                <div className='login-bg-area col-lg-6 col-12 col-sm-12 col-xs-12 p-0 align-items-center d-flex justify-content-end'>
                     
                </div>
                <p className='ptagscroll' onClick={handleScrollToLogin}>tap to sign in <Icon icon="mingcute:down-fill" /></p>
                <div className='col-lg-6 col-12 col-sm-12 col-xs-12 mobileloginDownScreen' ref={loginScreenRef}>


                  <div className='align-items-center d-flex justify-content-center p-4'>
                      <div className='text-center'>
                          <img src={Loginlogo} className='loginlogo' alt='login-logo'/>
                          {/* <h1 className='text-black'>Task Tracker</h1> */}
                      </div>
                  </div>

                  <div className='login_Area'>

                      <div className='form-login' id='login-screen'>
                        <div className='text-center'>
                          <h3 className='Login-Head'>
                              Login
                          </h3>
                          <p style={{color:'grey', fontSize:'13px'}}>Welcome to V2 Vehicle Master. Login to access your account. </p>
                        </div>
                          
                          <form onSubmit={loginbtn}>
                              <div className="form-group login-page pb-4">
                                  <input type="email" className={`form-control formLogin ${emailError ? 'is-invalid' : ''}`} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e) => {setEmail(e.target.value); setEmailError(''); validateEmail(e.target.value);}} maxLength={40}/>
                                  {emailError && <p className="error-message loginerror">{emailError}</p>}
                              </div>
                              <div className="form-group login-page pb-4">
                                  <input type={passwordVisible ? 'text' : 'password'} className={`form-control formLogin ${passError ? 'is-invalid' : ''}`} id="exampleInputPassword1" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={20}/>
                                  <div className="input-group-append login">
                                    <span className="input-group-text login" onClick={togglePasswordVisibility}>
                                      <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                                    </span>
                                  </div>
                                  {passError && <p className="error-message loginerror">{passError}</p>}
                              </div>
                              <button type="submit" className="btn btn-primary login-btn w-100"  >{loading ? 'Loging In...' : 'Login'}</button>
                              
                              <div className='d-flex justify-content-center mt-3' onClick={ForgotPassBtn}>
                                <p className='forgot-pass'>Forgot Password ?</p>
                              </div>
                          </form>

                      </div>

                      <div className='form-login' id='forgot-screen' style={{display:'none'}}>

                          <h3 className='Login-Head'>
                              Forgot Password
                          </h3>
                          <p>Don’t worry, happens to all of us. Enter your email below to recover your password</p>
                          <form>
                              <div className="form-group login-page pb-4">
                                  <label className='label-login' for="exampleInputEmail1">Email address</label>
                                  <input type="email" className={`form-control ${emailError ? 'is-invalid' : ''}`} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={Forgetemail} onChange={(e) => {setForgetEmail(e.target.value); setEmailError(''); validateEmail(e.target.value);}} />
                                  {emailError && <p className="error-message loginerror">{emailError}</p>}
                              </div>
                              <button type="button" className="btn btn-primary login-btn w-100" onClick={forgotPassword} >{loading ? 'Sending Link...' : 'Reset'}</button>
                              
                              <div className='d-flex justify-content-center mt-3' onClick={loginScreenBtn}>
                                <p className='forgot-pass'>Back to Login</p>
                              </div>
                          </form>

                      </div>

                  </div>
                    
                </div>
            </div>
        </section>
    </>
   )
}

export default Login