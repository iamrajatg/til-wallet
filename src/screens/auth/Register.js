import React,{useState} from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, ROUTES } from "../../constants";
import Logo from "../../assets/icons/LOGO.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { setError, setLoader } from "../../slices/commonSlice";
import { setSnackMsg } from "../../slices/walletSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { Snackbar } from "react-native-paper";

const Register = (props) => {
  const dispatch = useDispatch()
  const { navigation } = props;
  const [value, setValue] = useState({
    email: '',
    password: '',
    error: ''
  })
  const snackMsg = useSelector((state) => state.wallet.snackMsg);
  const isLoading = useSelector((state) => state.common.isLoading);

  async function signUp() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      dispatch(setSnackMsg("Email and Password are required"))
      return;
    }
    if(value.password.trim().length<6){
      dispatch(setSnackMsg("Password should be atleast 6 characters"))
      return;
    }
    dispatch(setLoader(true))
    dispatch(setError(false))
    try {
      await createUserWithEmailAndPassword(auth, value.email, value.password);
      dispatch(setLoader(false))
    } catch (error) {
      console.error(error)
      dispatch(setLoader(false))
      dispatch(setError(true))
      dispatch(setSnackMsg('Error When Signing Up,Please try again.'))
      setValue({
        ...value,
        error: error.message || "Some Error Occured",
      });
    }
  }
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.wFull}>
          <View style={styles.row}>
            <Logo width={55} height={55} style={styles.mr7} />
            <Text style={styles.brandName}>Times Wallet</Text>
          </View>

          <Text style={styles.loginContinueTxt}>Sign up to continue</Text>
          <TextInput
            style={styles.input}
            value={value.email}
            onChangeText={(text) => setValue({ ...value, email: text })}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={value.password}
            secureTextEntry
            onChangeText={(text) => setValue({ ...value, password: text })}
            placeholder="Password"
            textContentType="password"
          />

          <View style={styles.loginBtnWrapper}>
            <LinearGradient
              colors={[COLORS.gradientForm, COLORS.primary]}
              style={styles.linearGradient}
              start={{ y: 0.0, x: 0.0 }}
              end={{ y: 1.0, x: 0.0 }}
            >
              <TouchableOpacity
                onPress={signUp}
                activeOpacity={0.7}
                style={styles.loginBtn}
              >
                <Text style={styles.loginText}>Sign Up</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
          >
            <Text style={styles.signupBtn}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Loader isLoading={isLoading} />
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

export default Register;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    padding: 15,
    width: "100%",
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 42,
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.primary,
    opacity: 0.9,
  },
  loginContinueTxt: {
    fontSize: 21,
    textAlign: "center",
    color: COLORS.gray,
    marginBottom: 16,
    fontWeight: "bold",
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
  // Login Btn Styles
  loginBtnWrapper: {
    height: 55,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  loginBtn: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 55,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "400",
  },
  // footer
  footer: {
    position: "absolute",
    bottom: 20,
    textAlign: "center",
    flexDirection: "row",
  },
  footerText: {
    color: COLORS.gray,
    fontWeight: "bold",
  },
  signupBtn: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  // utils
  wFull: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  mr7: {
    marginRight: 7,
  },
});
