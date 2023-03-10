import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants";
import { Base64 } from "../utils/utils";
import { useDispatch } from "react-redux";
import { clearPresentation, generatePresentation } from "../slices/walletSlice";
import { useEffect } from "react";

const VCCard = ({
  type = "Verifiable Credential",
  expirationDate,
  issuanceDate,
  issuer,
  setCurrentCardData,
  setShowMenu,
  index,
  vcId,
  vcJson,
  // presentationMode,
  presentation
}) => {
  const menuBtnRef = useRef();
  const vcData = JSON.parse(vcJson)
  const dispatch = useDispatch()
  const [urlToOpen,setUrlToOpen] = useState(false)
  
  useEffect(() => {
    if(presentation && urlToOpen){
      try {
      if(!urlToOpen)
      return
        let newUrl = `${urlToOpen}?vp=${Base64.btoa(presentation)}`
        Linking.openURL(newUrl).catch((err) => {
        console.error("Failed to open url: ", err);
      });
      setUrlToOpen("")
      dispatch(clearPresentation())
      setUrlToOpen("")
      } catch (error) {
        dispatch(clearPresentation())
        setUrlToOpen("")
        console.error(error)
      }
    }
  }, [presentation,urlToOpen])

  const isTILVC = issuer.replace('dids').includes('ipuresults.co.in:til')
  
  return (
    <Pressable
      onPress={() => { 
          if(!isTILVC)
          return
          const vcData = JSON.parse(vcJson)
          let url = vcData?.credentialSubject?.url
          if(url)
          setUrlToOpen(url)
          dispatch(generatePresentation({credential:vcJson,holderDid:vcData?.credentialSubject?.id,mode:"url"}))
      }}
      style={styles.vcCard}
    >
      <Text style={styles.vcType}>{type}</Text>
      {issuer && <Text style={styles.issuer}>Issued By : {isTILVC?"TIL":issuer}</Text>}
      {issuanceDate && <Text style={styles.issuanceDate}>Issued On : {issuanceDate}</Text>}
      {expirationDate && <Text style={styles.expiryDate}>Expiring On : {expirationDate}</Text>}
      <Pressable
        ref={menuBtnRef}
        onPress={(e) => {
          if (menuBtnRef.current) {
            menuBtnRef.current.measure((fx, fy, width, height, px, py) => {
              setCurrentCardData({ x: px, y: py - 70,index,key:vcId,vcJson, holderDid:vcData?.credentialSubject?.id,isTILVC});
            });
          }
          setShowMenu(true);
        }}
        style={({ pressed }) => [
          styles.menuicon,
          pressed ? { opacity: 0.5 } : {},
        ]}
      >
        <MaterialCommunityIcons
          name="dots-vertical-circle"
          size={35}
          color={COLORS.primary}
        />
      </Pressable>
    </Pressable>
  );
};

export default VCCard;

const styles = StyleSheet.create({
  vcCard: {
    width: "100%",
    marginVertical: 20,
    padding: 15,
    position: "relative",
    backgroundColor: COLORS.white,
    borderRadius: 15,
  },
  vcType: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuicon: {
    position: "absolute",
    top: 10,
    right: 10,
    color: COLORS.primary,
  },

});
