import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { setError, setLoader } from "../slices/commonSlice";
import * as SecureStore from "expo-secure-store";
import { API_URL_GENERATE_DID } from "../constants/config";
import {
  addCredential,
  generateDid,
  generateDidFail,
  generateDidSuccess,
  removeDid,
  removeDidFail,
  removeDidSuccess,
  removeCredentialSuccess,
  removeCredential,
  removeCredentialFail,
  addCredentialSuccess,
  addCredentialFail,
} from "../slices/walletSlice";
import { generateKeyPair } from "../utils/utils";
import { ROUTES } from "../constants";
import * as ed from "../utils/eddsa";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONSTANTS } from "../screens/home/constants";
export const clearStore = async () => {
  await SecureStore.deleteItemAsync("keypairs");
  await SecureStore.deleteItemAsync("dids");
  await SecureStore.deleteItemAsync("credentials");
};

const { LOCAL_STORE_KEYS } = CONSTANTS;

function* generateDidSaga(action) {
  try {
    const { didMethod, didName, navigation } = action.payload;
    yield put(setLoader(true));
    yield put(setError(false));
    const { privateKey, publicKey } = yield call(generateKeyPair);
    const response = yield call(() =>
      axios.post(API_URL_GENERATE_DID, {
        method: didMethod,
        publicKey,
      })
    );
    // yield call(clearStore);
    const didResponse = {
      did: response.data[`did_${didMethod}`],
      name: didName,
      method: didMethod,
    };
    const keypairs = yield call(SecureStore.getItemAsync, "keypairs");
    if (!keypairs) {
      const keyPairObj = { [publicKey]: privateKey };
      yield call(
        SecureStore.setItemAsync,
        "keypairs",
        JSON.stringify(keyPairObj)
      );
    } else {
      const keyPairsParsed = JSON.parse(keypairs);
      keyPairsParsed[publicKey] = privateKey;
      yield call(
        SecureStore.setItemAsync,
        "keypairs",
        JSON.stringify(keyPairsParsed)
      );
    }
    const dids = yield call(SecureStore.getItemAsync, "dids");
    if (!dids) {
      const didArray = [didResponse];
      yield call(SecureStore.setItemAsync, "dids", JSON.stringify(didArray));
    } else {
      let didsParsed = JSON.parse(dids);
      didsParsed = [didResponse, ...didsParsed];
      yield call(SecureStore.setItemAsync, "dids", JSON.stringify(didsParsed));
    }
    if (response.data) {
      yield call(navigation.navigate, ROUTES.DID_LIST);
      yield put(generateDidSuccess(didResponse));
    }
  } catch (error) {
    console.error(error);
    yield put(generateDidFail(error));
    yield put(setError(true));
  } finally {
    yield put(setLoader(false));
  }
}

function* addCredentialSaga(action) {
  try {
    let credentialData = action.payload;
    const credential = {
      ...credentialData,
      vcJson: JSON.stringify(credentialData),
    };
    if (Array.isArray(credentialData.type)) {
      if (credentialData.type.length > 1) {
        credential.type = credentialData.type[1];
      } else {
        credential.type = credentialData.type[0];
      }
    } else if (typeof credentialData.type === "string") {
      credential.type = credentialData.type;
    }
    if (credentialData?.issuer?.id) {
      credential.issuer = credentialData.issuer.id;
    } else if (
      credentialData?.issuer &&
      typeof credentialData.issuer === "string"
    ) {
      credential.issuer = credentialData.issuer;
    }

    credential.key = ed.utils.bytesToHex(ed.utils.randomPrivateKey());
    if (Array.isArray(credential.type)) {
      cren;
    }
    yield put(setLoader(true));
    yield put(setError(false));
    // yield call(clearStore);
    yield call(
      AsyncStorage.setItem,
      `${LOCAL_STORE_KEYS.CREDENTIAL_PREFIX}${credential.key}`,
      JSON.stringify(credential)
    );
    yield put(addCredentialSuccess(credential));
  } catch (error) {
    console.error(error);
    yield put(addCredentialFail());
    yield put(setError(true));
  } finally {
    yield put(setLoader(false));
  }
}

function* removeDidSaga(action) {
  const index = action.payload;
  yield put(setLoader(true));
  yield put(setError(false));
  if (!(index >= 0)) throw new Error("Invalid Index To Remove");
  try {
    const dids = yield call(SecureStore.getItemAsync, "dids");
    if (!dids) {
      throw new Error("No Credential to remove");
    }
    let didsParsed = JSON.parse(dids);
    didsParsed.splice(index);
    yield call(SecureStore.setItemAsync, "dids", JSON.stringify(didsParsed));
    yield put(removeDidSuccess(index));
  } catch (error) {
    console.error(error);
    yield put(removeDidFail(error));
    yield put(setError(true));
  } finally {
    yield put(setLoader(false));
  }
}

function* removeCredentialSaga(action) {
  const { key, index } = action.payload;
  yield put(setLoader(true));
  yield put(setError(false));
  try {
    if (!key || !(index >= 0))
      throw new Error("Invalid credential key or index passed");
    const res = yield call(AsyncStorage.removeItem, `${LOCAL_STORE_KEYS.CREDENTIAL_PREFIX}${key}`);
    yield put(removeCredentialSuccess(index));
  } catch (error) {
    console.error(error);
    yield put(removeCredentialFail(error));
    yield put(setError(true));
  } finally {
    yield put(setLoader(false));
  }
}

function* walletSaga() {
  yield takeLatest(generateDid, generateDidSaga);
  yield takeLatest(addCredential, addCredentialSaga);
  yield takeLatest(removeDid, removeDidSaga);
  yield takeLatest(removeCredential, removeCredentialSaga);
}

export default walletSaga;
