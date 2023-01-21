import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import {
  loadCredentials,
  removeCredential,
  setSnackMsg,
} from "../../slices/walletSlice";
import { setError, setLoader } from "../../slices/commonSlice";
import Loader from "../../components/Loader";
import QRModal from "../../components/QRModal";
import { Menu, Provider, Snackbar } from "react-native-paper";
import VCCard from "../../components/VCCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONSTANTS } from "./constants";

export async function getCredentials() {
  let keys = await AsyncStorage.getAllKeys();
  let credentials = null;
  if (Array.isArray(keys)) {
    keys = keys?.filter((key) =>
      key.includes(CONSTANTS.LOCAL_STORE_KEYS.CREDENTIAL_PREFIX)
    );
    if (keys?.length) {
      credentials = await AsyncStorage.multiGet(keys);
      if (credentials) {
        credentials = credentials.map(([key, value]) => JSON.parse(value));
      }
    }
  }
  return credentials;
}
export async function setCredentials({ credentials, keypairs, dids }) { 
  let keys = await AsyncStorage.getAllKeys();
  if (Array.isArray(keys)) {
    keys = keys?.filter((key) =>
      key.includes(CONSTANTS.LOCAL_STORE_KEYS.CREDENTIAL_PREFIX)
    );
    if (keys?.length) {
      await AsyncStorage.multiRemove(keys);
    }
  }
  let credentialsToStore = credentials.map((cred) => {
    return [`${CONSTANTS.LOCAL_STORE_KEYS.CREDENTIAL_PREFIX}${cred.key}`, JSON.stringify(cred)];
  });
  if(credentialsToStore?.length)
  await AsyncStorage.multiSet(credentialsToStore);
  // console.log('dids',dids)
  // console.log('keypairs',keypairs)
  await SecureStore.setItemAsync("keypairs",keypairs);
  await SecureStore.setItemAsync("dids", dids);
}

const CredentialsHome = () => {
  const dispatch = useDispatch();
  const credentials = useSelector((state) => state.wallet.credentials);
  const snackMsg = useSelector((state) => state.wallet.snackMsg);
  const [QRCredential, setQRCredential] = useState("");
  const isLoading = useSelector((state) => state.common.isLoading);
  const [showMenu, setShowMenu] = useState(false);
  const [currentCardData, setCurrentCardData] = useState({});
  const { x, y, index, key, vcJson } = currentCardData;

  useEffect(() => {
    dispatch(setLoader(true));
    getCredentials()
      .then((res) => {
        if (!res) {
          dispatch(setLoader(false));
          dispatch(loadCredentials([]));
          return;
        }

        dispatch(loadCredentials(res));
        dispatch(setLoader(false));
        dispatch(setError(false));
      })
      .catch((e) => {
        console.error(e);
        dispatch(loadCredentials([]));
        dispatch(setLoader(false));
        dispatch(setError(true));
      });
  }, []);

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollview}>
          <Pressable
            style={styles.container}
            // onPress={(evt) => {
            //   if (evt.target !== evt.currentTarget) return;
            //   bottomSheetRef.current.close();
            //}}
          >
            <Menu
              visible={showMenu}
              onDismiss={() => {
                setShowMenu(false);
              }}
              anchor={x && y ? { x, y } : null}
            >
              <Menu.Item
                onPress={() => {
                  setQRCredential(vcJson);
                  setShowMenu(false);
                }}
                title="Share"
              />
              <Menu.Item
                onPress={() => {
                  dispatch(removeCredential({ index, key }));
                  setShowMenu(false);
                }}
                title="Remove"
              />
            </Menu>
            {credentials?.length ? (
              credentials.map((vc, i) => (
                <VCCard
                  key={vc.key}
                  vcId={vc.key}
                  index={i}
                  type={vc.type}
                  issuer={vc.issuer}
                  expirationDate={vc.expirationDate}
                  issuanceDate={vc.issuanceDate}
                  setCurrentCardData={setCurrentCardData}
                  setShowMenu={setShowMenu}
                  vcJson={vc.vcJson}
                />
              ))
            ) : (
              <Text style={{ marginTop: "50%" }}>
                No Credentials Yet.Add One Now!
              </Text>
            )}
          </Pressable>
        </ScrollView>
        <Loader isLoading={isLoading} />
        <QRModal value={QRCredential} onClose={() => setQRCredential("")} />
        <Snackbar
          visible={snackMsg}
          onDismiss={() => dispatch(setSnackMsg(""))}
          duration={1500}
        >
          {snackMsg}
        </Snackbar>
      </SafeAreaView>
    </Provider>
  );
};

export default CredentialsHome;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  scrollview: {
    paddingHorizontal: 15,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
  },
  headingText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
