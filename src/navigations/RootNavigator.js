import React from 'react';
import { useAuthentication } from '../utils/useAuthentication';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';


export default function RootNavigation() {
  const { user } = useAuthentication();

  return user ? <BottomTabNavigator /> : <AuthNavigator />;
}