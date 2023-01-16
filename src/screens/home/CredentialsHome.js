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
import { loadCredentials, setSnackMsg } from "../../slices/walletSlice";
import { setError, setLoader } from "../../slices/commonSlice";
import Loader from "../../components/Loader";
import QRModal from "../../components/QRModal";
import { Menu, Provider, Snackbar } from "react-native-paper";
import VCCard from "../../components/VCCard";

const CredentialsHome = () => {
  const dispatch = useDispatch();
  const credentials = useSelector((state) => state.wallet.credentials);
  const snackMsg = useSelector((state) => state.wallet.snackMsg);
  const [QRCredential, setQRCredential] = useState("");
  const isLoading = useSelector((state) => state.common.isLoading);
  const [showMenu, setShowMenu] = useState(false);
  const [currentMenuPosition, setCurrentMenuPosition] = useState(null);

  useEffect(() => {
    async function getValueFor(key) {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        return result;
      }
      return null;
    }
    dispatch(setLoader(true));
    getValueFor("credentials")
      .then((res) => {
        if (!res) {
          dispatch(setLoader(false));
          dispatch(loadCredentials([]));
          return;
        }

        dispatch(loadCredentials(JSON.parse(res)));
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
              anchor={currentMenuPosition}
            >
              <Menu.Item onPress={() => {}} title="Item 1" />
              <Menu.Item onPress={() => {}} title="Item 2" />
              <Menu.Item onPress={() => {}} title="Item 3" />
            </Menu>
            {credentials?.length ? (
              credentials.map((vc, i) => (
                <VCCard
                  key={vc.key}
                  type={vc.type}
                  issuer={vc.issuer}
                  onShare={() => setQRCredential(vc.vcJson)}
                  setCurrentMenuPosition={setCurrentMenuPosition}
                  setShowMenu={setShowMenu}
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
          duration={3000}
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
