import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Dialog from "../../components/Dialog";
import { COLORS, ROUTES } from "../../constants";
import { useDispatch } from "react-redux";
import { addCredential } from "../../slices/walletSlice";

export default function QRScanner({navigation}) {
  
  const dispatch = useDispatch()

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [successBtnTitle, setSuccessBtnTitle] = useState("");
  const [cancelBtnTitle, setCancelBtnTitle] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [scannedData,setScannedData] = useState(null)

  const handleAgree = () => {
    setShowDialog(false);
    if(scannedData)
    dispatch(addCredential(scannedData))
    navigation.navigate(ROUTES.CREDENTIALS)
  };

  const handleDisagree = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    try {
      const parsedData = JSON.parse(data);
      if (parsedData?.type) {
        if (
          (Array.isArray(parsedData.type) &&
            parsedData.type.includes("VerifiableCredential")) ||
          parsedData.type === "VerifiableCredential"
        ) {
          setScannedData(parsedData)
          setShowDialog(true)
          setDialogTitle("Import VC");
          setDialogText("Do you want to import this VC?");
          setSuccessBtnTitle("YES");
          setCancelBtnTitle("NO");
        } else {    
          throw new Error("Invalid QR");
        }
      }
    } catch (error) {
        setShowDialog(true)
        setDialogTitle("Invalid QR!");
        setDialogText("QR code not supported");
        setSuccessBtnTitle("");
        setCancelBtnTitle("OK");
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No Access to Camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={
          StyleSheet.absoluteFillObject
    }
      />
      {scanned && (
        <Pressable
          style={({ pressed }) => [
            styles.scanNewBtn,
            pressed ? { opacity: 0.6 } : {},
          ]}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanNewBtnTxt}>Scan New QR Code</Text>
        </Pressable>
      )}
      <Dialog
        onAgree={handleAgree}
        onCancel={handleDisagree}
        visible={showDialog}
        dialogText={dialogText}
        title={dialogTitle}
        successBtnTitle={successBtnTitle}
        cancelBtnTitle={cancelBtnTitle}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    alignItems:"center",
    flexDirection: "column",
    justifyContent: "center",
  },
  scanNewBtn: {
    position:'absolute',
    zIndex:10,
    alignItems:'center',
    bottom:'10%',
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width:'100%',
  },
  scanNewBtnTxt:{
    fontWeight: "bold",
    fontSize: 17,
    color: COLORS.white,
  }
});
