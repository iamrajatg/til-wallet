import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigations/AuthNavigator";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./src/slices/walletSlice";
import commonReducer from "./src/slices/commonSlice";
import walletSaga from "./src/sagas/walletSaga.js";

const saga = createSagaMiddleware();
const store = configureStore({
  reducer: { wallet: walletReducer, common: commonReducer },
  middleware: [saga]
});
saga.run(walletSaga);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
