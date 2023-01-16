import { View, Modal,ActivityIndicator } from "react-native";
import React from "react";
import { COLORS } from "../constants";

const Loader = ({ isLoading }) => {
  return (
    <Modal transparent={true} visible={isLoading}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent:'center',
          alignItems:'center'
        }}
      >
        <ActivityIndicator
          size="large"
          color={COLORS.green}
        />
      </View>
    </Modal>
  );
};

export default Loader;
