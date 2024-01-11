import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { updateAccessToken } from '../app/chatSlice';

const Protected = () => {
  const dispatch=useDispatch()
  const session=sessionStorage.getItem('token');
  dispatch(updateAccessToken(session))
  const token=useSelector(state=>state.accessToken)
  
  return (
    token !=="" ? <Outlet />:<Navigate to="/login" />
  )
}

export default Protected
