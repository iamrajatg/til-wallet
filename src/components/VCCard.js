import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants";
import { Divider, Menu, Provider } from "react-native-paper";

const VCCard = ({
  type = "Verifiable Credential",
  expiryDate = "01/22",
  issuanceDate = "01/23",
  issuer = "TIL",
  onShare,
  url = "https://www.twitter.com",
  setCurrentMenuPosition,
  setShowMenu,
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
      <View style={styles.buttons}>
        <Pressable
          onPress={onShare}
          style={({ pressed }) => [
            styles.btn,
            styles.shareBtn,
            pressed ? { opacity: 0.5 } : {},
          ]}
        >
          <Text style={{ color: "white" }}>Share</Text>
        </Pressable>
      </View>
      <Pressable
        ref={menuBtnRef}
        onPress={(e) => {
          // e.stopPropagation()
          if (menuBtnRef.current) {
            menuBtnRef.current.measure((fx, fy, width, height, px, py) => {
              setCurrentMenuPosition({ x: px, y: py - 80 });
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
          size={24}
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
    top: 0,
    right: 10,
    color: COLORS.primary,
  },
  btn: {
    padding: 10,
    width: "25%",
    borderRadius: 15,
    color: COLORS.white,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  shareBtn: {},
  copyBtn: {
    marginRight: 20,
  },
  buttons: {
    flexDirection: "row",
    // flex: 1,
    marginTop: 10,
  },
});
