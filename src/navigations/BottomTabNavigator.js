import React, { createContext, useEffect, useRef } from "react";
import { COLORS, ROUTES } from "../constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SettingsNavigator from "./SettingsNavigator";
import { StyleSheet } from "react-native";
import DIDNavigator from "./DIDNavigator";
import QRScanner from "../screens/home/Scanner";
import CredentialsHome from "../screens/home/CredentialsHome";
import * as Linking from 'expo-linking';
import { useDispatch } from "react-redux";
import { addCredential } from "../slices/walletSlice";
import { Base64 } from "../utils/utils";

const Tab = createBottomTabNavigator();
export const BottomSheetContext = createContext();
export default function BottomTabNavigator(props) {
  const dispatch = useDispatch()
  const bottomSheetRef = useRef(null);
  const navigationRef = useRef(null)


  const url = Linking.useURL();

  const handleURL = (url) => {
    const urlRcvd = Linking.parse(url);
    const {path,queryParams} =  urlRcvd
    console.log('url received -',urlRcvd)
      if(queryParams.vc && navigationRef.current?.navigate){
        try {
          const str = Base64.atob(queryParams.vc)
          if(str){
          dispatch(addCredential(JSON.parse(str)));
          navigationRef.current.navigate(ROUTES.CREDENTIALS)
          }
        } catch (error) {
          console.error(error)
        }
      }
}

  useEffect(() => {
    // Do something with URL
    if (url) {
        handleURL(url);
    } else {
        console.log('No URL');
    }
}, [url])

  return (
    <BottomSheetContext.Provider value={{ bottomSheetRef,navigationRef }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: "left",
          tabBarActiveTintColor: COLORS.primary,
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === ROUTES.HOME_TAB) {
              iconName = focused ? "ios-home" : "ios-home-outline";
            } else if (route.name === ROUTES.SETTINGS_NAVIGATOR) {
              iconName = focused ? "settings" : "settings-outline";
            } else if (route.name === ROUTES.CREDENTIALS) {
              iconName = focused ? "wallet" : "wallet-outline";
            } else if (route.name === ROUTES.SCANNER) {
              iconName = focused ? "qr-code-sharp" : "qr-code-outline";
            } 
            else if (route.name === ROUTES.DIDs) {
              iconName = focused ? "md-person-sharp" : "md-person-outline";
            }
            return <Ionicons name={iconName} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name={ROUTES.DIDs}
          component={DIDNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen name={ROUTES.CREDENTIALS} component={CredentialsHome} />
        <Tab.Screen name={ROUTES.SCANNER} component={QRScanner} />
       
        <Tab.Screen
          name={ROUTES.SETTINGS_NAVIGATOR}
          component={SettingsNavigator}
          options={{ tabBarLabel: "Settings",headerTitle:'Settings' }}
        />
      </Tab.Navigator>
    </BottomSheetContext.Provider>
  );
}

const styles = StyleSheet.create({
  leftDrawerBtn: { marginLeft: 8, marginTop: 5 },
  rightAddBtn: { marginRight: 10, marginTop: 5 },
});
