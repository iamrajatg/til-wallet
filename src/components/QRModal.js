import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import QRCode from "react-qr-code";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

const QRModal = ({ value,onClose }) => {
  return (
    <Modal transparent={false} visible={!!value}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <View style={{
                width:350,
                height:350,
                backgroundColor:COLORS.white,
                borderRadius:20,
                justifyContent:'center',
                alignItems:'center'
            }}>
          <QRCode
            size={300}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={value}
            viewBox={`0 0 300 300`}
          />
          </View>
        </View>
        <Pressable
          style={{
            position: "absolute",
            top: 60,
            right: 20,
          }}
          onPress={onClose}
        >
          <Ionicons name="close" size={50} color={COLORS.white} />
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

export default QRModal;

const styles = StyleSheet.create({});
