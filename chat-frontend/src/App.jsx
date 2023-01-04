import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage'
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm'
import "../scss/main.scss";
function App() {
  

  return (
  
    <BrowserRouter>
      
      <main className='container-fluid'>

        {/*HEADER GOES HERE*/}

        <Routes>
          <Route path='/' element={<HomePage/>}/>
          {/* <Route path='/register' element={<RegisterForm/>}></Route> */}
          
        </Routes>


      </main>
      </BrowserRouter>
      
  )
}

export default App
  