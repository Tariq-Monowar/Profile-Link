import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BiHide, BiShowAlt } from "react-icons/bi";



import './Style_Css/login.css'
import Lodding from './layout_component/Lodding';
import NavBar from './layout_component/NavBar';

const Login = () => {
  const navigate = useNavigate();
  const [passwordShow, setpasswordShow] = useState(true)
  const [error, seterror] = useState(null)
  const [lodding, setlodding] = useState(false)
  const [ShowSubmitButton, setShowSubmitButton] = useState(false)
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  
  const{email, password} = userData
    useEffect(() => {
      if (email !== '' && password !== '') {
        setShowSubmitButton(true);
      } else {
        setShowSubmitButton(false);
      }
    }, [email, password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const loginUser = async () => {
    try {
      const res = await axios.post('http://localhost:1000/api/login', userData);
      if (res.status === 200) {
        const token = res.data.token;
        localStorage.setItem('token', token);
        console.log(res.data.token);
        navigate('/profile');
      }
      console.log(res);
    } catch (error) {
      seterror(error);
      setlodding(false)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
    console.log(userData);
    setlodding(true)
  };

  const checkPassword = ()=>{
    setpasswordShow(!passwordShow)
  }

  return (
    <> 
     <NavBar />
      <div className="container">
        <h1>Login Profile</h1>
        <div className='loddingSet'>
          {
            lodding &&
            <Lodding /> 
          }
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              required
              className="form-control"
              placeholder='Email'
              value={userData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group form-control-password">
            <input
              type={passwordShow?"password":"text"}
              id="password"
              name="password"
              required
              className="form-control"
              placeholder='Password'
              value={userData.password}
              onChange={handleChange}
            />
            <div className='password-show' onClick={checkPassword}>
              {
                passwordShow?<BiShowAlt />:<BiHide />
              }
            </div>
          </div>
          <div className='form-group form-control-password'>
            {
              ShowSubmitButton && 
              <button type="submit" className="submit-btn">
                Submit
              </button>
            }
            <div className='login-message'>
              {
                error&&
                <p>Invalid email or password</p>
              }
            </div>
          </div>
           
        </form>
      </div>
    </>
  );
};

export default Login;
