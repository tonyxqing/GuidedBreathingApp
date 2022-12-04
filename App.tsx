import React from 'react';
import { Button, StyleSheet, View, TouchableOpacity } from 'react-native';
import GuidedBreathing from './GuidedBreathing';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Box, IconButton, NativeBaseProvider, Slider, Text } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Freeze } from 'react-freeze';

const MenuButton = (navigation: any) => (
  <IconButton
    onPress={() => navigation.navigate('Options')}
    title="Options"
    _icon={{
      as: MaterialIcons,
      name: 'menu',
    }}
  />
);
export default function App() {
  const Tab = createMaterialTopTabNavigator();
  const [breaths, setBreaths] = React.useState(30);
  const [breathLength, setBreathLength] = React.useState(4);
  const [breathHoldTime, setBreathHoldTime] = React.useState(90);
  const [backgroundImage, setBackgroundImage] = React.useState(0);

  const TreesBackground = require('./assets/trees.jpg');
  const LeavesBackground = require('./assets/leaves.jpg');

  const backgrounds = [TreesBackground, LeavesBackground];

  const Options = React.useCallback(() => {
    return (
      <View
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <Box flexDirection="row" alignItems="center">
              <Box style={styles.buttonContainer}>
                <Button
                  title="-"
                  onPress={() => {
                    if (breaths > 10) setBreaths((breaths) => breaths - 5);
                  }}
                />
              </Box>
              <Text style={styles.text} textAlign="center">
                Breaths - {breaths}
              </Text>
              <Box style={styles.buttonContainer}>
                <Button
                  title="+"
                  onPress={() => {
                    if (breaths < 50) setBreaths((breaths) => breaths + 5);
                  }}
                />
              </Box>
            </Box>
          </View>
          <View style={styles.container}>
            <Box alignItems="center" flexDirection="row">
              <Box style={styles.buttonContainer}>
                <Button
                  title="-"
                  onPress={() => {
                    if (breathLength > 0)
                      setBreathLength((length) => length - 1);
                  }}
                />
              </Box>
              <Text style={styles.text} textAlign="center">
                Breath Length - {breathLength} seconds
              </Text>
              <Box style={styles.buttonContainer}>
                <Button
                  title="+"
                  onPress={() => {
                    if (breathLength < 10)
                      setBreathLength((breaths) => breaths + 1);
                  }}
                />
              </Box>
            </Box>
          </View>
          <View style={styles.container}>
            <Box
              alignItems="center"
              flexDirection="row"
              justifyContent="space-evenly">
              <Box style={styles.buttonContainer}>
                <Button
                  title="-"
                  onPress={() => {
                    if (breathHoldTime > 15)
                      setBreathHoldTime((breaths) => breaths - 5);
                  }}
                />
              </Box>
              <Text style={styles.text} textAlign="center">
                Breath Hold Time - {Math.floor(breathHoldTime / 60)}:
                {breathHoldTime % 60 < 10
                  ? `0${breathHoldTime % 60}`
                  : breathHoldTime % 60}
              </Text>
              <Box style={styles.buttonContainer}>
                <Button
                  title="+"
                  onPress={() => {
                    if (breathHoldTime < 180)
                      setBreathHoldTime((time) => time + 5);
                  }}
                />
              </Box>
            </Box>
          </View>
        </View>
        <Box flex={1} justifyContent="center" alignItems="center">
          <TouchableOpacity
            style={{ backgroundColor: '#551155', padding: 16, borderRadius: 4 }}
            onPress={() => {
              setBackgroundImage((prev) => {
                if (prev >= backgrounds.length - 1) return 0;
                return prev + 1;
              });
            }}>
            <Text style={{ color: 'white' }}>Change BackgroundImage</Text>
          </TouchableOpacity>
        </Box>
      </View>
    );
  }, [breaths, breathHoldTime, breathLength]);

  return (
    <NativeBaseProvider>
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
                {...props}
              />
            )}
          />
          <Tab.Screen name="Options" component={Options} />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    wdith: '100%',
    alignItems: 'center',
    paddingTop: 50,
  },
  text: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    padding: '0px 10px',
  },
  buttonContainer: {
    flex: 0.2,
    fontSize: 24,
    fontWeight: 300,
    margin: 12,
    backgroundColor: '#eeeeee',
    borderRadius: 4,
  },
});
