import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import './Style_Css/Registation_form.css'
import NavBar from './layout_component/NavBar'
import Lodding from './layout_component/Lodding'

const Register = () => {
  const navigate = useNavigate()
  const [lodding, setlodding] = useState(false)
  const [error, seterror] = useState(null)
  const [ShowSubmitButton, setShowSubmitButton] = useState(false)
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    address: "",
    image: null,
    password: "",
    Cpassword: ""

  })

  const{userName, email, password, Cpassword} = userData
  useEffect(() => {
    if (userName !== '' && email !== '' && password !== '' && Cpassword !== '') {
      setShowSubmitButton(true);
    } else {
      setShowSubmitButton(false);
    }
  }, [userName, email, password, Cpassword]);

  const ifChange = (e)=>{
    const { name, value, files } = e.target;
    setUserData(prevState => ({
      ...prevState,[name]: files ? files[0] : value,
    }));
  }

  const createUser = async()=>{
    try {
        const formData = new FormData();
        formData.append('userName', userData.userName);
        formData.append('email', userData.email);
        formData.append('image', userData.image);
        formData.append('address', userData.address);
        formData.append('password', userData.password);
        formData.append('Cpassword', userData.Cpassword);

        const res = await axios.post('http://localhost:1000/api',formData)
        if(res.status === 201){
            navigate('/login')
        }
        console.log(formData)
    } catch (error) {
      seterror(error)
      setlodding(false)
    }
  
  }

  const submitAllData = (e)=>{
    e.preventDefault()
    createUser()
    console.log(userData)
    seterror(null)
    setlodding(true)
  }
  return (
    <> 
     <NavBar />
      <div className='signin-container'>
        <h1 className='pageName'>Register</h1>
        <div className='sign-loddingSet'>
          {
            lodding&&
            <div className='lodding-align'>
              <Lodding />
            </div> 
          }{    
            error &&
            <p className='sign-error-message'>{error.response.data.message}</p>
          }
        </div>
        <form onSubmit={submitAllData}>
          <div className='sig-form-group'>
            <input 
              type="text" 
              name="userName" 
              required 
              placeholder="User Name" 
              className='form-control'
              value={userData.userName} 
              onChange={ifChange} 
            />
          </div>
          <div className='sig-form-group'>
            <input 
              type="email" 
              name="email" 
              required
              placeholder="Email" 
              className='form-control'
              value={userData.email} 
              onChange={ifChange} 
            />
          </div>
          <div className='sig-form-group'>
            <input 
              type="text" 
              name="address" 
              placeholder="address" 
              className='form-control'
              value={userData.address} 
              onChange={ifChange} 
            />
          </div>
          <div className='sig-form-group'>
            <input 
              type='file' 
              name="image" 
              className='form-control-image'
              onChange={ifChange} 
            />
          </div>
          <div className='sig-form-group'>
            <input 
              type="password" 
              name="password" 
              required 
              minLength="6"
              placeholder="Password" 
              className='form-control'
              value={userData.password} 
              onChange={ifChange}
            />
          </div>
          <div className='sig-form-group'>
            <input 
              type="password" 
              name="Cpassword" 
              required 
              minLength="6"
              placeholder="confirm password" 
              className='form-control'
              value={userData.Cpassword} 
              onChange={ifChange}
            />
          </div> 
          <div className='sig-form-group form-control-password'>
            {
              ShowSubmitButton &&
              <button 
                type="submit" 
                className='submit-btn'>
                  Submit
              </button>  
            }
          </div>       

        </form>
      </div>
    </>
  )
}

export default Register