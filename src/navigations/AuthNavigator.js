import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login, ForgotPassword, Register } from "../screens";
import { COLORS, ROUTES } from "../constants";
import DrawerNavigator from "./DrawerNavigator";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
        }}
        initialRouteName={ROUTES.LOGIN}
      >
        <Stack.Screen
          name={ROUTES.LOGIN}
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          options={({ route }) => ({
            title: route.params.userid,
          })}
          name={ROUTES.FORGOT_PASSWORD}
          component={ForgotPassword}
        />
        <Stack.Screen name={ROUTES.REGISTER} component={Register} />
        <Stack.Screen
          name={ROUTES.HOME}
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
}

export default AuthNavigator;
