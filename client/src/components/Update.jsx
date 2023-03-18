import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Lodding from './layout_component/Lodding';
import NavBar from './layout_component/NavBar';

const Update = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [updateData, setUpdateData] = useState(location.state.userProfile);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setUpdateData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('userName', updateData.userName);
    formData.append('image', updateData.image);
    formData.append('address', updateData.address);
    formData.append('password', updateData.password);
    try {
      const res = await axios.patch(`http://localhost:1000/api/${updateData._id}`, formData);
      if (res.status === 201) {
        navigate('/profile');
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="signin-container">
        <h1 className="pageName">Update User</h1>
        <div className="sign-loddingSet">
          {loading && (
            <div className="lodding-align">
              <Lodding />
            </div>
          )}
          {error && (
            <p className="sign-error-message">{error.message}</p>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="sig-form-group">
            <input
              type="text"
              name="userName"
              placeholder="User Name"
              className="form-control"
              value={updateData.userName}
              onChange={handleChange}
            />
          </div>
          <div className="sig-form-group">
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="form-control"
              value={updateData.address}
              onChange={handleChange}
            />
          </div>
          <div className="sig-form-group">
            <input
              type="file"
              name="image"
              className="form-control-image"
              onChange={handleChange}
            />
          </div>
          <div className="sig-form-group">
            <input
              type="password"
              name="password"
              minLength="6"
              placeholder="Password"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="sig-form-group form-control-password">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            
            <button 
             onClick={()=>{navigate('/profile')}}
             className="submit-btn"
            >
              don't update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Update;
