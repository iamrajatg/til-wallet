import React, { createContext, useRef, useState } from "react";
import { Home } from "../screens";
import { COLORS, ROUTES } from "../constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SettingsNavigator from "./SettingsNavigator";
import { Pressable, View, StyleSheet } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import DIDNavigator from "./DIDNavigator";
import QRScanner from "../screens/home/Scanner";
import CredentialsHome from "../screens/home/CredentialsHome";

const Tab = createBottomTabNavigator();
export const BottomSheetContext = createContext();
export default function BottomTabNavigator(props) {
  const bottomSheetRef = useRef(null);

  const { navigation } = props;
  return (
    <BottomSheetContext.Provider value={{ bottomSheetRef }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: "left",
          headerLeft: (props) => (
            <Pressable
              {...props}
              onPress={() => {
                navigation.openDrawer();
              }}
            >
              <View style={styles.leftDrawerBtn}>
                <Icon name="menu" size={30} color={COLORS.primary} />
              </View>
            </Pressable>
          ),
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
        <Tab.Screen name={ROUTES.HOME_TAB} component={Home} />
        <Tab.Screen name={ROUTES.CREDENTIALS} component={CredentialsHome} />
        <Tab.Screen name={ROUTES.SCANNER} component={QRScanner} />
        <Tab.Screen
          name={ROUTES.DIDs}
          component={DIDNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name={ROUTES.SETTINGS_NAVIGATOR}
          component={SettingsNavigator}
          options={{ tabBarLabel: "Settings" }}
        />
      </Tab.Navigator>
    </BottomSheetContext.Provider>
  );
}

const styles = StyleSheet.create({
  leftDrawerBtn: { marginLeft: 8, marginTop: 5 },
  rightAddBtn: { marginRight: 10, marginTop: 5 },
});
