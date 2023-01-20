import { Pressable, SafeAreaView, StyleSheet, Text, View ,ScrollView} from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetContext } from "../../navigations/BottomTabNavigator";
import { COLORS, ROUTES } from "../../constants";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { loadDids, removeDid, setSnackMsg } from "../../slices/walletSlice";
import { setError, setLoader } from "../../slices/commonSlice";
import Loader from "../../components/Loader";
import DIDCard from "../../components/DIDCard";
import QRModal from "../../components/QRModal";
import { Snackbar } from "react-native-paper";
import * as Clipboard from "expo-clipboard";

const DIDHome = ({ navigation }) => {
  const { bottomSheetRef,navigationRef } = useContext(BottomSheetContext);
  const snapPoints = useMemo(() => [400], []);
  const dispatch = useDispatch();
  const dids = useSelector((state) => state.wallet.dids);
  const snackMsg = useSelector((state)=>state.wallet.snackMsg)
  const [QRDid, setQRDid] = useState("");
  const isLoading = useSelector((state) => state.common.isLoading);
  // const [snackMsg, setSnackMsg] = useState("");

  useEffect(() => {
    navigationRef.current = navigation
    async function getValueFor(key) {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        return result;
      }
      return null;
    }
    // dispatch({type:'CLEAR_STORE'})
    dispatch(setLoader(true));
    getValueFor("dids")
      .then((res) => {
        if (!res) {
          dispatch(loadDids([]));
          dispatch(setLoader(false));
          return
        }
        dispatch(loadDids(JSON.parse(res)));
        dispatch(setLoader(false));
        dispatch(setError(false));
      })
      .catch((e) => {
        console.error(e);
        dispatch(loadDids([]));
        dispatch(setLoader(false));
        dispatch(setError(true));
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollview}>
        <Pressable
        style={styles.container}
        onPress={(evt) => {
          if (evt.target !== evt.currentTarget) return;
          bottomSheetRef.current.close();
        }}>
        {dids?.length ? (
          // <Text>{dids}</Text>
          // <Text>TEST</Text>
          dids.map((did,i) => (
            <DIDCard
              key={did.did}
              {...did}
              onShare={() => setQRDid(did.did)}
              onCopy={async () => {
                try {
                  await Clipboard.setStringAsync(did.did);
                  dispatch(setSnackMsg("DID Copied to Clipboard!"));
                } catch (error) {
                  dispatch(setSnackMsg("Error Copying"));
                }
              }}
              onRemove={()=>dispatch(removeDid(i))}
            />
          ))
        ) : (
          <Text style={{marginTop:'50%'}} >No DIDs Created Yet.Create One Now!</Text>
        )}
        </Pressable>
        </ScrollView>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          style={styles.bottomSheet}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.headingText}>Add DIDs</Text>
            <Pressable
              style={({ pressed }) => [
                styles.createDidBtn,
                pressed ? { opacity: 0.6 } : {},
              ]}
              onPress={() => {
                navigation.navigate(ROUTES.DID_CREATE_FORM);
              }}
            >
              <MaterialIcons name="add-box" size={24} color={COLORS.primary} />
              <Text style={styles.btnLabel}>Create New DID</Text>
            </Pressable>
          </View>
        </BottomSheet>
      <Loader isLoading={isLoading} />
      <QRModal value={QRDid} onClose={() => setQRDid("")} />
      <Snackbar
        visible={snackMsg}
        onDismiss={() => dispatch(setSnackMsg(""))}
        duration={1500}
      >
        {snackMsg}
      </Snackbar>
    </SafeAreaView>
  );
};

export default DIDHome;

const styles = StyleSheet.create({
  container: {
    paddingTop:10,
    flex: 1,
    alignItems:'center'
  },
  scrollview:{
    paddingHorizontal: 15,
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
});
