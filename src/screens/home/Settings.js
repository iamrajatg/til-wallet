import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
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
import { Switch } from "react-native-paper";

import {
  loadCredentials,
  loadDids,
  saveLoadDataConfirmation,
  setSnackMsg,
} from "../../slices/walletSlice";
import Loader from "../../components/Loader";
import { Snackbar } from "react-native-paper";
import colors from "../../constants/colors";

const Settings = ({ navigation, route }) => {
  const { bottomSheetRef } = useContext(BottomSheetContext);
  const { user } = useAuthentication();
  const dispatch = useDispatch();
  const snackMsg = useSelector((state) => state.wallet.snackMsg);
  const isLoading = useSelector((state) => state.common.isLoading);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogFirstLoad, setShowDialogFirstLoad] = useState(false);
  const loadSendDataConfirmation = useSelector(
    (state) => state.wallet.sendDataConfirmation
  );
  const onToggleSwitch = () => {
    dispatch(saveLoadDataConfirmation(!loadSendDataConfirmation));
  };

  const credentials = useSelector((state) => state.wallet.credentials);
  const checkFirstLoad = async () => {
    const alreadyLoaded = await SecureStore.getItemAsync("alreadyLoaded");
    if (!alreadyLoaded) {
      setShowDialogFirstLoad(true);
      await SecureStore.setItemAsync("alreadyLoaded", "true");
    }
  };
  useEffect(() => {
    bottomSheetRef?.current?.close();
    checkFirstLoad();
  }, []);

  useEffect(() => {
    if (loadSendDataConfirmation && credentials?.length) {
      sendDataToTIL().then((_) => {
        console.log("Subscripiton Data uploaded to TIL");
      });
    }
  }, [loadSendDataConfirmation, credentials]);

  const sendDataToTIL = async () => {
    try {
      const data = credentials.map((cred) => {
        const {
          type,
          issuer,
          expirationDate,
          issuanceDate,
          credentialSubject,
        } = cred;
        return {
          type,
          issuer,
          expirationDate,
          issuanceDate,
          holderDID: credentialSubject.id,
          url: credentialSubject.url,
          holderName: credentialSubject.name,
        };
      });
      await setDoc(doc(db, "userSubscriptionData", user?.uid), { data });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user?.email && (
        <View style={{ flexDirection: "row", marginTop: 20, marginBottom: 40 }}>
          <Text style={styles.hi}>Hi, </Text>
          <Text style={styles.name}>{user.email}</Text>
        </View>
      )}
      <View style={styles.toggleWrapper}>
        <Text style={styles.toggleText}>Send Subscription Data to TIL</Text>
        <Switch
          value={loadSendDataConfirmation}
          onValueChange={onToggleSwitch}
        />
      </View>

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
            const creds =
              typeof credentials === "string"
                ? JSON.parse(credentials)
                : credentials;
            if (!JSON.parse(dids)?.length && !creds?.length) {
              dispatch(setLoader(false));
              return dispatch(setSnackMsg("Nothing to backup!"));
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
                credentials: dataToRestore.credentials
                  ? JSON.parse(dataToRestore.credentials)
                  : [],
                dids: dataToRestore.dids || [],
                keypairs: dataToRestore.keypairs || [],
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
          setShowDialog(true);
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

      <Dialog
        onAgree={() => {
          dispatch(saveLoadDataConfirmation(true));
          setShowDialogFirstLoad(false)
        }}
        onCancel={() => setShowDialogFirstLoad(false)}
        visible={showDialogFirstLoad}
        dialogText={
          "Send Subscription Data to TIL for better recommendation and Offers?You can enable/disable it anytime time from Settings"
        }
        title={"Confirm Subscription Data Sharing?"}
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
  hi: {
    fontSize: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  toggleWrapper: {
    flexDirection: "row",
    marginBottom: 30,
  },
  toggleText: {
    marginRight: 20,
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
});
