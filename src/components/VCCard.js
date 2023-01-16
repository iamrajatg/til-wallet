import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants";

const VCCard = ({
  type = "Verifiable Credential",
  expiryDate = "01/22",
  issuanceDate = "01/23",
  issuer = "TIL",
  url = "https://www.twitter.com",
  setCurrentCardData,
  setShowMenu,
  index,
  vcId,
  vcJson
}) => {
  const menuBtnRef = useRef();
  return (
    <Pressable
      onPress={() => {
        Linking.openURL(url).catch((err) => {
          console.error("Failed to open url: ", err);
        });
      }}
      style={styles.vcCard}
    >
      <Text style={styles.vcType}>{type}</Text>
      <Text style={styles.issuer}>{issuer}</Text>
      <Text style={styles.issuanceDate}>{issuanceDate}</Text>
      <Text style={styles.expiryDate}>{expiryDate}</Text>
      <Pressable
        ref={menuBtnRef}
        onPress={(e) => {
          if (menuBtnRef.current) {
            menuBtnRef.current.measure((fx, fy, width, height, px, py) => {
              setCurrentCardData({ x: px, y: py - 70,index,key:vcId,vcJson});
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
