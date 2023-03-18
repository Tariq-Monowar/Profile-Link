import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaPenNib } from 'react-icons/fa'
import './Style_Css/profile.css'
import NavBar from './layout_component/NavBar';


const Profile = () => {

  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState(null);
  const token = localStorage.getItem('token');

  const getUserProfile = async () => {
    if (!token) {
      console.log('Token not present or expired');
      navigate('/login')
      return;
    }
    try {
      const response = await axios.get('http://localhost:1000/api/profile', {
        headers: {
          Authorization: token,
        },
      });
      const userData = response.data;
      console.log(userData);
      setUserProfile(userData);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(userProfile);

  useEffect(() => {
    getUserProfile();
  }, []);

  const logOut =()=>{
    // localStorage.removeItem('token')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const ifClickForDelete = async(_id)=>{
    try {
      const response = await axios.delete(`http://localhost:1000/api/${_id}`);
      console.log(response)
      if(response.status == 200){
        navigate('/')
      }
    } catch (error) {
      
    }
  }

  //update
  const ifClickForUpdate = (_id)=>{
    console.log(_id)
    navigate('/update', { state: { userProfile } })
  }

  return (
    <>

      <div className='profile-element'> 
      
        {userProfile ? (
          <div>
            <div className='prifile-image-bg'>
            <NavBar/> 
              <div className='prifile-image-bg-in'>
                <div className='prifile-image-outside'>

                  <span
                   className='update'
                   onClick={()=>ifClickForUpdate()}
                   state={{userProfile}} 
                  >
                    <FaPenNib className='update-icon'/>
                  </span>
                  
                  {userProfile.image ? (
                  <img 
                    className='prifile-image'
                    src={`data:image/png;base64,${Buffer.from(userProfile.image.data).toString('base64')}`}
                  /> 
                  ) : (
                    <img
                     className='prifile-image'
                     src='https://t3.ftcdn.net/jpg/03/91/19/22/240_F_391192211_2w5pQpFV1aozYQhcIw3FqA35vuTxJKrB.jpg'
                    />
                  )}

                </div>
                <div className='prifile-name-info'>
                  <h1>{userProfile.userName}</h1>
                  <p>profile ID: {(userProfile.userName).replace(/ /g, "-")}</p>
                  <p className='profile-address'>Address: {userProfile.address}</p>
                  <div>
                    <button className='log-btn' onClick={logOut}>LogOut</button>
                    <button className='log-btn' onClick={()=>ifClickForDelete(userProfile._id)}>DeleteUser</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </>
  );
  
};

export default Profile;



// {userProfile && (
//   <div key={userProfile._id}>
//     <h1>{userProfile?.userName}</h1>
//   </div>
// )}