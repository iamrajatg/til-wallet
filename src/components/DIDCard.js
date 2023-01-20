import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../constants";

const DIDCard = ({ name, did, onCopy, onShare,onRemove }) => {
  return (
    <View style={styles.didCard}>
      <Text style={styles.didName}>{name}</Text>
      <Text style={styles.did}>{did}</Text>
      <View style={styles.buttons}>
        <Pressable
          onPress={onCopy}
          style={({ pressed }) => [
            styles.btn,
            styles.copyBtn,
            pressed ? { opacity: 0.5 } : {},
          ]}
        >
          <Text style={{ color: "white" }}>Copy</Text>
        </Pressable>
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
        <Pressable
          onPress={onRemove}
          style={({ pressed }) => [
            styles.btn,
            styles.removeBtn,
            pressed ? { opacity: 0.5 } : {},
          ]}
        >
          <Text style={{ color: "white" }}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DIDCard;

const styles = StyleSheet.create({
  didCard: {
    width: "100%",
    marginVertical: 20,
    padding: 15,
    position: "relative",
    backgroundColor: COLORS.white,
    borderRadius: 15,
  },
  didName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  btn: {
    padding: 10,
    width: "25%",
    borderRadius: 15,
    color: COLORS.white,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  removeBtn:{
    marginLeft: 20,
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
