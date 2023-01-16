import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { CredentialsHome } from "../screens";
import { COLORS, ROUTES } from "../constants";
import BottomTabNavigator from "./BottomTabNavigator";
import { Ionicons as Icon } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        // headerTitle:"",
        drawerActiveBackgroundColor: COLORS.primary,
        drawerActiveTintColor: COLORS.white,
        drawerLabelStyle: {
          marginLeft: -20,
        },
      }}
    >
      <Drawer.Screen
        name={ROUTES.HOME_DRAWER}
        component={BottomTabNavigator}
        options={{
          title: "Home",
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="home-sharp" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={ROUTES.WALLET_DRAWER}
        component={CredentialsHome}
        options={{
          title: "Credentials",
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="wallet" size={18} color={color} />
          ),
        }}
      />

      {/* <Drawer.Screen
        name={ROUTES.NOTIFICATIONS_DRAWER}
        component={Notifications}
        options={{
          title: "Notifications",
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="notifications" size={18} color={color} />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
}
