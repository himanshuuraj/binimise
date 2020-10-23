import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { View } from "./../ui-kit";
import garbageTruckImg from '../assets/car.png'
import { getDriverLocations } from "./../repo/repo";
import { distanceBetweenLatLong, sendPushNotification } from "./../global/notif";
import { useSelector, useDispatch } from "react-redux";
import { AsyncStorage } from 'react-native';
import { setData } from "./../redux/action";

export default props => {

    const [driverLocations, setDriverLocations] = useState({});
    let userCoords = useSelector(state => state.testReducer.coords) || {};

    const dispatch = useDispatch();
    const setDataAction = (arg) => dispatch(setData(arg));
    var soundObject = "";

    useEffect(() => {
        getLocations();
    }, [props.isDriver, props.userInfo.areaCode]);
    
    getLocations = async () => {
        if(!props.userInfo.areaCode)
            return;
        let driverRef = getDriverLocations(props.userInfo.areaCode);
        driverRef.on('value', (response) => {
            var data = response.val();
            if(!data)
                return;
            setDriverLocations(data);
            calculateDriverLocations(data);
        });
    }

    calculateDriverLocations = async (drivers) => {
        console.log(drivers, userCoords);
        if(!userCoords.longitude || !props.userInfo.firebaseToken)
            return;
        for(let key in drivers) {
            let value = drivers[key];
            let driverNotifReceived = await AsyncStorage.getItem("driverNotif");
            driverNotifReceived = JSON.parse(driverNotifReceived) || [];
            if(!driverNotifReceived.includes(key)){
                let distance = distanceBetweenLatLong(userCoords.latitude, userCoords.longitude, 
                    value.location.real_time.lat, value.location.real_time.long);
                if(distance < 0.3) {
                    setDataAction({confirmModalInfo:{
                        showModal : true,
                        title : "Show Audio",
                        primaryText : "Close",
                        primaryAction : async () => {
                            setDataAction({
                                confirmModalInfo:{ showModal: false}
                            });
                            await soundObject.unloadAsync();
                        },
                        secondaryText : "",
                        secondaryAction : ""
                    }});
                    let token = await AsyncStorage.getItem("firebaseToken");
                    sendPushNotification(token);
                    driverNotifReceived.push(key);
                    AsyncStorage.setItem("driverNotif", JSON.stringify(driverNotifReceived));
                }
            }
        }
    }

    if(driverLocations === null || Object.keys(driverLocations).length === 0)
        return null;

    return ( <View> 
        {
            Object.entries(driverLocations).filter(item => {
                console.log(item[1]?.status?.status);
                    return item[1]?.status?.status == true;
            }).map((item, index) => (
                <View key={index}>
                    <MapView.Marker
                        coordinate={{
                            latitude: item[1].location?.real_time?.lat,
                            longitude: item[1].location?.real_time?.long
                        }}
                        image={garbageTruckImg}
                        />
                </View>)
            )
        }
    </View>
    );
}