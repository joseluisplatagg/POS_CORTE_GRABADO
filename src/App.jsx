import React, { useState, useEffect } from "react";
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AOS from 'aos';
import "aos/dist/aos.css"
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHouse, faEnvelope, faUserPen, faUserAstronaut,
  faTooth, faBullseye,faEye, faTrophy,faHospital, faClock,
faEarthAmericas, faPhoneVolume } from '@fortawesome/free-solid-svg-icons'; // Import specific solid icons
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'; // Import specific brand icons

library.add(faEarthAmericas,faPhoneVolume,
  faHouse, faTrophy, faEnvelope,faUserPen,
  faClock, faHospital, faTooth, faTwitter, 
  faUserAstronaut, faBullseye, faEye, faFacebook); // Add icons to the library



function App() {
  useEffect(() =>{
    AOS.init({
      duration:800,
      once:true
    });
  },[])
    

  return (
    <>
    
    </>
  )
}

export default App
