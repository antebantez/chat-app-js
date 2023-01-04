import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage'
import "../scss/main.scss";
function App() {
  

  return (
  
    <BrowserRouter>
      
      <main className='container-fluid'>

        {/*HEADER GOES HERE*/}

        <Routes>
          <Route path='/' element={<HomePage/>}/>

          
        </Routes>


      </main>
      </BrowserRouter>
      
  )
}

export default App
  