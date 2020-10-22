import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';

import firebaseSetup from "./repo/firebaseSetup";

export default function App() {

  const {auth} = firebaseSetup();
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  const signInWithPhoeNumber = async phoneNumber => {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    alert(JSON.stringify(confirmation));
    setConfirm(confirmation);
  }

  const confirmCode = async () => {
    try {
        await confirm.confirm(code);
        alert("SignedIn successfully");
    }catch(err){
      alert(JSON.stringify(err));
    }
  }

  return <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="Notconfirm" />
      <Button title="SignIn" onPress={() => {
        signInWithPhoeNumber('+917022623975');
        Alert.alert('Simple Button pressed')
      }} />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => setCode(text)}
        value={code}
      />
      <Button title="Confirm" onPress={() => {
        confirmCode();
      }} />
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
