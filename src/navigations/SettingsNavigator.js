import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Settings, SettingsDetail } from "../screens";
import { ROUTES } from "../constants";

const Stack = createNativeStackNavigator();

function SettingsNavigator() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.SETTINGS} screenOptions={
      {
        headerTitle:'Settings'
      }
    }>
      <Stack.Screen name={ROUTES.SETTINGS} component={Settings} options={{ headerShown: false }}/>
      <Stack.Screen name={ROUTES.SETTINGS_DETAIL} component={SettingsDetail} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
