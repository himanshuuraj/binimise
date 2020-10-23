import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import Loading from "./components/loading";
import ConfirmModal from "./components/confirmModal";
import ErrorModal from "./components/ErrorModal";
import { Provider } from "react-redux";
import store from "./store";
import PhoneVerification from "./pages/PhoneVerification";
import MapPage from "./pages/MapView";
import UserDetail from "./pages/userDetails";
import HowItWorks from "./pages/howItWorks";
import AboutUs from "./pages/aboutUs";
import Complaint from "./pages/complaint";
import ContactUs from "./pages/contactUs";
import History from "./pages/history";
import Share from "./pages/share";
import Sidebar from "./components/sidebar";
import { getCurrentDate } from "./global/util";

import { Scene, Router, Stack } from "react-native-router-flux";

export default function App() {

  const [screenType, setScreenType] = useState("");

  useEffect(() => {
    getUserInfo();      
    clearDriverNotif();
  }, []);

  getNowTime = () => {
    return (new Date().getTime()).toString();
  }

  clearDriverNotif = async () => {
      driverNotifdate = await AsyncStorage.getItem("driverNotifdate");
      if(!driverNotifdate || ((getNowTime() - driverNotifdate) > 600000)) {
        AsyncStorage.removeItem("driverNotif");
      }
      AsyncStorage.setItem("driverNotifdate", getNowTime());
  }

  getUserInfo = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    if(userInfo){
      setScreenType("mapView")
    }
  }

  return (
    <Provider store={store}>
      <Router>
        <Stack key="root">
        <Scene
          type="reset"
          hideNavBar={true}
          key="loginPage"
          component={PhoneVerification}
          title="LoginPage"
          initial={screenType != 'mapView'}
        />
        <Scene
          type="reset"
          hideNavBar={true}
          key="MapView"
          component={MapPage}
          title="MapView"
          initial={screenType == 'mapView'}
        />
        <Scene
          type="reset"
          hideNavBar={true}
          key="UserDetail"
          component={UserDetail}
          title="UserDetail"
        />
        </Stack>
      </Router>
      <Loading />
      <ConfirmModal />
      <ErrorModal />
      <Sidebar />
    </Provider>
  );
}
