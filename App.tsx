import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { SvgProps, Path } from "react-native-svg"
import Blobsvg from './Blobsvg'
import SocialCreditCounter from './SocialCreditCounter';
export default function App(props: SvgProps) {

  return (
    <View style={styles.container}>
      <Blobsvg/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
  },
});
