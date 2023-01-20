import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./src/slices/walletSlice";
import commonReducer from "./src/slices/commonSlice";
import walletSaga from "./src/sagas/walletSaga.js";
import RootNavigation from "./src/navigations/RootNavigator";

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
      <RootNavigation />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
