import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Switch,
} from 'react-native';
import GuidedBreathing from './GuidedBreathing';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFonts } from 'expo-font';

export default function App() {
  const Tab = createMaterialTopTabNavigator();
  const [fontsLoaded] = useFonts({
    Macondo: require('./assets/Macondo-Regular.ttf'),
  });
  const [breaths, setBreaths] = React.useState(30);
  const [breathLength, setBreathLength] = React.useState(2.2);
  const [breathHoldTime, setBreathHoldTime] = React.useState(90);
  const [backgroundImage, setBackgroundImage] = React.useState(0);
  const [enableInstruction, setEnableInstruction] = React.useState(true);
  const [enableMusic, setEnableMusic] = React.useState(true);
  const TreesBackground = require('./assets/trees.jpg');
  const LeavesBackground = require('./assets/leaves.jpg');

  const backgrounds = [TreesBackground, LeavesBackground];

  const Options = React.useCallback(() => {
    return (
      <View
        style={{
          display: 'flex',
          flex: 1,
          backgroundColor: '#3f3f3f',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.text}>Breaths - {breaths}</Text>
            <View style={styles.buttonSection}>
              <View style={styles.buttonContainer}>
                <Button title="Easy" onPress={() => setBreaths(20)} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Normal" onPress={() => setBreaths(30)} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Intense" onPress={() => setBreaths(45)} />
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <Text style={styles.text}>
              Breath Length - {breathLength.toFixed(2)} seconds
            </Text>
            <View style={styles.buttonSection}>
              <View style={styles.buttonContainer}>
                <Button title="Fast" onPress={() => setBreathLength(2)} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Medium" onPress={() => setBreathLength(2.4)} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Slow" onPress={() => setBreathLength(4)} />
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <Text style={styles.text}>
              Breath Hold Time - {Math.floor(breathHoldTime / 60)}:
              {breathHoldTime % 60 < 10
                ? `0${breathHoldTime % 60}`
                : breathHoldTime % 60}
            </Text>
            <View style={styles.buttonSection}>
               <View style={styles.buttonContainer}>
                <Button title="Simple" onPress={() => setBreathHoldTime(45)} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Short" onPress={() => setBreathHoldTime(90)} />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Long" onPress={() => setBreathHoldTime(120)} />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.changeBackgroundSection}>
          <View style={styles.switchSection}>
            <Switch
              style={{ flex: 0.2 }}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={enableInstruction ? '#333dff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setEnableInstruction((toggle) => !toggle)}
              value={enableInstruction}
            />
            <Text style={styles.switchText}>Enable Instructions</Text>
          </View>
          <View style={styles.switchSection}>
            <Switch
              style={{ flex: 0.2 }}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={enableMusic ? '#333dff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setEnableMusic((toggle) => !toggle)}
              value={enableMusic}
            />
            <Text style={styles.switchText}>Enable Music</Text>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: '#551155', padding: 16, borderRadius: 4 }}
            onPress={() => {
              setBackgroundImage((prev) => {
                if (prev >= backgrounds.length - 1) return 0;
                return prev + 1;
              });
            }}>
            <Text style={{ color: 'white', fontFamily: 'Macondo' }}>
              Restart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [breaths, breathHoldTime, breathLength, enableMusic, enableInstruction, backgrounds.length]);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarStyle: { display: 'none' } }}>
        <Tab.Screen
          name="Breathing"
          component={(props: any) => (
            <GuidedBreathing
              breaths={breaths}
              breathLength={breathLength}
              breathHoldTime={breathHoldTime}
              background={backgrounds[backgroundImage]}
              enableInstructions={enableInstruction}
              enableMusic={enableMusic}
              {...props}
            />
          )}
        />
        <Tab.Screen name="Options" component={Options} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    paddingTop: 50,
  },
  text: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    padding: 10,
    color: '#f8f8f8',
    fontFamily: 'Macondo',
    textAlign: 'center',
  },
  switchText: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 20,
    color: '#f8f8f8',
    fontFamily: 'Macondo',
  },
  buttonContainer: {
    flex: 1,
    fontSize: 24,
    margin: 4,
    fontWeight: 300,
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
  },
  changeBackgroundSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50,
    padding: 20,
  },
});
