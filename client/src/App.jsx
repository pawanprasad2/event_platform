import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

import UserProtectedwrapper from './pages/UserProtectedwrapper'

import HomePage from './pages/HomePage'
import Dashboard from './pages/DashboardPage'
import CreateEventPage from "./pages/CreateEventPage"

import EditEventPage from './pages/EditEventPage'
function App() {
  return (
<>

<Routes>
  <Route path="/signup" element={<SignupPage/>}/>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/" element={
    <UserProtectedwrapper>
      <HomePage/>
    </UserProtectedwrapper>
    }/>
    <Route path="/dashboard" element={
      <UserProtectedwrapper>

        <Dashboard/> 
      </UserProtectedwrapper>}/>
      <Route path='/create' element={
        <UserProtectedwrapper>
        <CreateEventPage/>
        </UserProtectedwrapper>
        } />
<Route path="/events/:id/edit" element={<EditEventPage />} />

        
</Routes>
</>  )
}

export default App