import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import Header from './components/Header'
import "../scss/main.scss";

import axios from 'axios';
function App() {

const [user, setUser] = useState(null)
  
  
  useEffect(() => {
    const getUser = () => {
      axios.get('/api/user/login')
      .then(res => {
          setUser(res.data.user)
        })
    }
  
  getUser()
  }, [])
  

  return (
  
    <BrowserRouter>
      
      <main className=''>

        <Header user={user} setUserCallback={setUser} />

        <Routes>
          <Route path='/' element={<HomePage seshUser={user} />}/>
          <Route path='/login' element={<LoginPage seshUser={user} setUserCallback={setUser} />} />
          <Route path='/chat' element={<ChatPage userData={user} setUserCallback={setUser} />} />
        </Routes>


      </main>
      </BrowserRouter>
      
  )
}

export default App
  