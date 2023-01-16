import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Pressable,
  Keyboard,
} from "react-native";
import { unwrapResult } from "@reduxjs/toolkit";
import BottomSheet from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import { COLORS, ROUTES } from "../../constants";
import { BottomSheetContext } from "../../navigations/BottomTabNavigator";
import { Ionicons as Icon } from "@expo/vector-icons";
import { CONSTANTS } from "./constants";
import { useSelector, useDispatch } from "react-redux";
import { generateDid } from "../../slices/walletSlice";
import Loader from "../../components/Loader";

const DROPDOWN_LABEL = "Select DID Type";
const CreateDID = ({ navigation }) => {
  const { DID_TYPES } = CONSTANTS;
  const { bottomSheetRef } = useContext(BottomSheetContext);
  const didTypeBottomSheet = useRef(null);
  const snapPoints = useMemo(() => [200], []);
  const [method, setMethod] = useState("");
  const [didName, onChangeDIDName] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.common.isLoading);
  const isError = useSelector((state) => state.common.isError);

  const disabled = !didName.length || !method;
  useEffect(() => {
    bottomSheetRef.current.close();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setIsBottomSheetOpen(false);
    } else {
      setIsBottomSheetOpen(true);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.container}
        onPress={(evt) => {
          Keyboard.dismiss();
          if (evt.target !== evt.currentTarget) return;
          didTypeBottomSheet.current.close();
        }}
      >
        <View style={styles.formControl}>
          <Text style={styles.inputLabel}>DID Name</Text>
          <TextInput
            style={styles.input}
            value={didName}
            onChangeText={onChangeDIDName}
            placeholder="Enter DID Name"
            onFocus={() => {
              didTypeBottomSheet.current.close();
            }}
          />
          <Text style={styles.didNameMessage}>
            (Give a name to your DID for easy reference)
          </Text>
        </View>
        <Pressable
          style={[styles.formControl, styles.didTypeSelection]}
          onPress={() => {
            Keyboard.dismiss();
            didTypeBottomSheet.current.expand();
          }}
        >
          <Text style={styles.buttonText}>
            {method ? `did:${method}` : DROPDOWN_LABEL}
          </Text>
          <Icon
            name={
              isBottomSheetOpen ? "chevron-up-circle" : "chevron-down-circle"
            }
            size={24}
            color={COLORS.primary}
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.formControl,
            styles.didCreateBtn,
            pressed && !disabled
              ? {
                  backgroundColor: COLORS.primaryLight,
                }
              : null,
            disabled ? { opacity: 0.5 } : null,
          ]}
          onPress={async () => {
            if (disabled) return;
            Keyboard.dismiss();
            didTypeBottomSheet.current.close();
            dispatch(generateDid({ didMethod: method, didName ,navigation}));
          }}
        >
          <Text style={styles.didCreateText}>CREATE</Text>
        </Pressable>
        <BottomSheet
          ref={didTypeBottomSheet}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          animateOnMount={false}
          onChange={handleSheetChanges}
          style={styles.bottomSheet}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.handleStyle}
        >
          <View style={styles.contentContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.didTypeBtn,
                pressed
                  ? {
                      backgroundColor: COLORS.primaryLight,
                    }
                  : null,
              ]}
              onPress={() => {
                setMethod(DID_TYPES.key);
                didTypeBottomSheet.current.close();
              }}
            >
              <Text style={styles.didTypeText}>did:key</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.didTypeBtn,
                pressed
                  ? {
                      backgroundColor: COLORS.primaryLight,
                    }
                  : null,
              ]}
              onPress={() => {
                setMethod(DID_TYPES.web);
                didTypeBottomSheet.current.close();
              }}
            >
              <Text style={styles.didTypeText}>did:web</Text>
            </Pressable>
          </View>
        </BottomSheet>
      </Pressable>
      <Loader isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default CreateDID;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    // justifyContent: "center",
    // alignItems: "center",
  },
  didNameMessage: {
    fontSize: 13,
  },
  inputLabel: {
    fontWeight: "bold",
  },
  formControl: {
    marginVertical: 15,
    marginHorizontal: 10,
  },
  bottomSheet: {},
  bottomSheetBackground: {
    backgroundColor: COLORS.primary,
  },
  handleStyle: {
    backgroundColor: COLORS.white,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    height: 55,
    paddingVertical: 0,
  },
  didTypeSelection: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 4,
  },
  didTypeBtn: {
    marginHorizontal: 8,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
  },
  buttonText: {
    color: COLORS.gray,
  },
  didTypeText: {
    fontSize: 15,
    color: COLORS.white,
  },
  didCreateBtn: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 35,
  },
  didCreateText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 17,
  },
});
