
//https://nextbigtechnology.com/mern-stack-development-company/


import React from 'react'
import NavBar from './layout_component/NavBar'
import Web_Name from './layout_component/Web-Name'
import './Style_Css/home.style.css'

const Home = () => {
  return (
    <>
      <div className='nav'>
        <NavBar />
      </div>
      <div className='home-page'>
        <Web_Name />
        <div className='home-paragraphs'>
          <p>My name is Tariq Monowar Hossain, and I am a highly motivated and passionate full-stack web developer. With a strong foundation in computer science principles and a deep love for creating visually stunning and intuitive software development(web and mobile applications) , I am eager to contribute my skills and expertise to innovative projects.</p>
        </div>
      </div>
    </>
  )
}

export default Home