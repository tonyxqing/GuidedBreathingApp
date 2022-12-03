import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import GuidedBreathing from './GuidedBreathing';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
  const Stack = createNativeStackNavigator();
  const [screen, setScreen] = React.useState('Breathing');
  const [breaths, setBreaths] = React.useState(35);
  const [breathLength, setBreathLength] = React.useState(4);
  const [breathHoldTime, setBreathHoldTime] = React.useState(90);

  const Options = React.useCallback(() => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}>
        <View style={styles.container}>
          <Box flexDirection="row" alignItems="center">
          <Button title="+" onPress={() => setBreaths(breaths => breaths + 5)}/>
          <Text style={styles.text} textAlign="center">Breaths - {breaths}</Text>
          <Button title="-" onPress={() => setBreaths(breaths => breaths - 5)}/>
          </Box>
        </View>
        <View style={styles.container}>
          <Box alignItems="center" w="100%">
          <Button title="+" onPress={() => setBreathLength(breaths => breaths + 5)}/>
          
          <Text style={styles.text} textAlign="center">Breath Length - {breathLength} seconds</Text>
          <Button title="-" onPress={() => setBreathLength(length => length - 5)}/>

          </Box>
        </View>
        <View style={styles.container}>
          <Box alignItems="center" w="100%">
          <Button title="+" onPress={() => setBreathHoldTime(time => time + 5)}/>

          <Text textAlign="center">
            Breath Hold Time - {Math.floor(breathHoldTime / 60)}:
            {breathHoldTime % 60 < 10
              ? `0${breathHoldTime % 60}`
              : breathHoldTime % 60}
          </Text>
          <Button title="-" onPress={() => setBreathHoldTime(breaths => breaths - 5)}/>
        
          </Box>
        </View>
      </View>
    );
  }, [breaths, breathHoldTime, breathLength])


  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen
            name="Breathing"
            component={(props: any) => (
              <Freeze freeze={screen === 'Options'}>
                <GuidedBreathing breaths={breaths} breathLength={breathLength} breathHoldTime={breathHoldTime} {...props} />
              </Freeze>
            )}
            options={({ navigation }: any) => ({
              title: 'Guided Breathing',
              headerLeft: () => {
                setScreen('Breathing');
                return MenuButton(navigation);
              },
            })}
          />
          <Stack.Screen
            name="Options"
            component={Options}
            options={() => ({
              title: 'Options',
              headerLeft: () => {
                setScreen('Options');
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  text: {
    padding: "0px 10px"
  }
});
