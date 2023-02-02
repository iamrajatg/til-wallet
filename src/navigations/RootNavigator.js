import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadSendDataConfirmation } from '../slices/walletSlice';
import { useAuthentication } from '../utils/useAuthentication';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';


export default function RootNavigation() {
  const { user } = useAuthentication();
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(loadSendDataConfirmation())
  },[])

  return user ? <BottomTabNavigator /> : <AuthNavigator />;
}