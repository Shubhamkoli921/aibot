import React from 'react'
import AuthService from '../authentication/authservice'
import { Outlet } from 'react-router-dom'

const Hello = () => {
  AuthService.isAuthenticated ? <div>hello broooo</div> : <div>nooo brooo</div>
}

export default Hello