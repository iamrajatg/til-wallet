import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants";
import { BottomSheetContext } from "../../navigations/BottomTabNavigator";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthentication } from "../../utils/useAuthentication";
import * as SecureStore from "expo-secure-store";
import { getCredentials, setCredentials } from "./CredentialsHome";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoader } from "../../slices/commonSlice";
import Dialog from "../../components/Dialog";
import {
  loadCredentials,
  loadDids,
  setSnackMsg,
} from "../../slices/walletSlice";
import Loader from "../../components/Loader";
import { Snackbar } from "react-native-paper";

const Settings = ({ navigation, route }) => {
  const { bottomSheetRef } = useContext(BottomSheetContext);
  const { user } = useAuthentication();
  const dispatch = useDispatch();
  const snackMsg = useSelector((state) => state.wallet.snackMsg);
  const isLoading = useSelector((state) => state.common.isLoading);
  const [showDialog,setShowDialog] = useState(false)

  useEffect(() => {
    bottomSheetRef?.current?.close();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={async () => {
          if (!user?.uid) {
            return;
          }
          dispatch(setLoader(true));
          dispatch(setError(false));
          const keypairs = await SecureStore.getItemAsync("keypairs");
          const dids = await SecureStore.getItemAsync("dids");
          const credentials = await getCredentials();

          

          const backup = {
            keypairs: keypairs ? keypairs : null,
            dids: dids ? dids : null,
            credentials: credentials ? JSON.stringify(credentials) : null,
          };
          try {
            if(!JSON.parse(dids)?.length && !JSON.parse(credentials)?.length){
              dispatch(setLoader(false));
              return  dispatch(setSnackMsg("Nothing to backup!"));
            }
            await setDoc(doc(db, "walletBackups", user.uid), backup);
            // const docRef = await addDoc(collection(db, `walletBackups/${user.id}`),backup);
            dispatch(setLoader(false));
            dispatch(setSnackMsg("Backup Successful!"));
          } catch (e) {
            dispatch(setLoader(false));
            dispatch(setError(true));
            dispatch(setSnackMsg("Error Backing Up"));
            console.error("Error adding document: ", e);
          }
          // navigation.navigate(ROUTES.SETTINGS_DETAIL);
        }}
      >
        <Text style={styles.buttonText}>BACKUP</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={async () => {
          if (!user?.uid) {
            return;
          }
          dispatch(setLoader(true));
          dispatch(setError(false));
          const docRef = doc(db, "walletBackups", user.uid);
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              let rawData = docSnap.data();
              let dataToRestore = JSON.parse(JSON.stringify(rawData));
              await setCredentials({
                credentials: dataToRestore.credentials?JSON.parse(dataToRestore.credentials):[],
                dids: dataToRestore.dids||[],
                keypairs: dataToRestore.keypairs||[],
              });
              dispatch(loadCredentials(JSON.parse(dataToRestore.credentials)));
              dispatch(loadDids(JSON.parse(dataToRestore.dids)));
              dispatch(setLoader(false));
              dispatch(setSnackMsg("Restore Successful!"));
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
              dispatch(setLoader(false));
              dispatch(setSnackMsg("No Backup Found"));
            }
          } catch (error) {
            console.error("Error Restoring", error);
            dispatch(setSnackMsg("Error Restoring Data"));
            dispatch(setLoader(false));
            dispatch(setError(true));
          }
        }}
      >
        <Text style={styles.buttonText}>RESTORE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => {
          setShowDialog(true)
        }}
      >
        <Text style={styles.buttonText}>LOG OUT</Text>
      </TouchableOpacity>
      <Loader isLoading={isLoading} />
      <Snackbar
        visible={snackMsg}
        onDismiss={() => dispatch(setSnackMsg(""))}
        duration={1500}
      >
        {snackMsg}
      </Snackbar>
      <Dialog
        onAgree={() => {
          dispatch({ type: "CLEAR_STORE" });
          signOut(auth);
        }}
        onCancel={() => setShowDialog(false)}
        visible={showDialog}
        dialogText={
          "Are you sure to log out?You will lose all saved DIDs and Credentials.Consider Backing up if not done already."
        }
        title={"Confirm Logout?"}
        successBtnTitle={"CONFIRM"}
        cancelBtnTitle={"CANCEL"}
      />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 17,
    margin: 10,
    borderRadius: 5,
    fontSize: 18,
    width: 180,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
