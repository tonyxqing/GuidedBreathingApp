import React from 'react';
import { StyleSheet, View } from 'react-native';
import GuidedBreathing from './GuidedBreathing'
export default function App() {

  return (
    <View style={styles.container}>
      <GuidedBreathing/>
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
