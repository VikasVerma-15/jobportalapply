import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import axios from "axios";

import store from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { setUser } from "./redux/authSlice";
import { USER_API_ENDPOINT } from "./utils/data";

const persistor = persistStore(store);

const syncSessionWithServer = () =>
  axios
    .get(`${USER_API_ENDPOINT}/me`, { withCredentials: true })
    .then((res) => {
      if (res.data?.success && res.data.user) {
        store.dispatch(setUser(res.data.user));
      }
    })
    .catch((err) => {
      if (err.response?.status === 401 || err.response?.status === 403) {
        store.dispatch(setUser(null));
      }
    });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={syncSessionWithServer}
      >
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </StrictMode>
);
