import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { SvgProps, Path } from "react-native-svg"
import Blobsvg from './Blobsvg'
import SocialCreditCounter from './SocialCreditCounter';
export default function App(props: SvgProps) {
  return (
    <View>
      <SocialCreditCounter/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
