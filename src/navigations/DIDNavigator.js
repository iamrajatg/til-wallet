import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS, ROUTES } from "../constants";
import DIDHome from "../screens/home/DIDHome";
import { BottomSheetContext } from "./BottomTabNavigator";
import { Ionicons as Icon, MaterialIcons } from "@expo/vector-icons";
import CreateDID from "../screens/home/CreateDID";

const Stack = createNativeStackNavigator();
const DIDNavigator = ({ navigation }) => {
  const { bottomSheetRef } = useContext(BottomSheetContext);
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.DID}
    >
      <Stack.Screen
        name={ROUTES.DID_LIST}
        component={DIDHome}
        options={()=>({
          headerTitleAlign:'center',
          headerTitle:"DIDs",
          headerTitleStyle:{
            fontWeight:'bold'
          },
          headerRight: (props) => (
            <Pressable
              {...props}
              onPress={() => {
                bottomSheetRef.current.expand();
              }}
            >
              <View style={styles.rightAddBtn}>
                <MaterialIcons
                  name="add-box"
                  size={24}
                  color={COLORS.primary}
                />
              </View>
            </Pressable>
          ),
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
        })}
      />
      <Stack.Screen
        name={ROUTES.DID_CREATE_FORM}
        component={CreateDID}
        options={{ headerTitle: "Create DID", headerBackTitleVisible: false }}
      />
    </Stack.Navigator>
  );
};

export default DIDNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  bottomSheet: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
  },
  createDidBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    marginTop: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.primary,
  },
  headingText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
  },
  btnLabel: {
    marginLeft: 20,
    fontSize: 17,
    fontWeight: "500",
  },
  leftDrawerBtn: { marginLeft: 8, marginTop: 5 },
  rightAddBtn: { marginRight: 10, marginTop: 5 },
});
