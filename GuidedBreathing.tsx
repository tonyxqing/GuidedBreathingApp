import * as React from 'react';
import { Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Audio } from 'expo-av';
type BreathDirection =
  | 'Breathe In'
  | 'Breathe Out'
  | 'Beginning'
  | 'Breath Hold'
  | '';

interface BreathingProps {
  navigation: any;
  route: any;
  breaths: number;
  breathLength: number;
  breathHoldTime: number;
  background: any;
  enableInstructions: boolean;
  enableMusic: boolean;
}

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

const GuidedBreathing = (props: BreathingProps) => {
  const {
    breaths,
    breathLength,
    breathHoldTime,
    background,
    enableInstructions,
    enableMusic,
  } = props;
  const [textTimer, setTextTimer] = React.useState<number>(1);
  const [breathDirection, setBreathDirection] =
    React.useState<BreathDirection>('');
  const [breathHold, setBreathHold] = React.useState<boolean>(false);
  const [beginSession, setBeginSession] = React.useState<boolean>(false);
  const r = useSharedValue(20);
  const opacity = useSharedValue(1);
  const counter = useSharedValue(2);
  const [binaural, setBinauralSounds] = React.useState<Audio.Sound>();
  const [directions, setDirectionSounds] = React.useState<Audio.Sound>();
  const [breathSound, setBreathSound] = React.useState<Audio.Sound>();
  async function playBinauralSounds() {
    console.log('Loading Sound');
    if (!enableMusic) return;
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/audiomass-output(2).mp3')
    );
    setBinauralSounds(sound);
    await sound.playAsync();
  }
  async function playBreatheIn() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/breatheIn.mp3')
    );
    setDirectionSounds(sound);
     await sound.playAsync();
  }
  async function playBreatheOut() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/breatheOut.mp3')
    );
    setDirectionSounds(sound);
    await sound.playAsync();
  }

  async function playGong() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/gonga.mp3')
    );
    setBreathSound(sound);
    await sound.playAsync();
  }
  
  async function playBreathIn() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/breathIn(3).mp3')
    );
    setBreathSound(sound)
     await sound.playAsync();
  }

  async function playBreathHold() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/breathHold.mp3')
    );
    setDirectionSounds(sound)
    await sound.playAsync();
  }
 async function playBreathOut() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/breathOut(2).mp3')
    );
    setBreathSound(sound)
     await sound.playAsync();
  }
  React.useEffect(() => {
    return binaural
      ? () => {
          binaural.unloadAsync();
        }
      : undefined;
  }, [binaural, enableMusic]);

  React.useEffect(() => {
    return directions
      ? () => {
          directions.unloadAsync();
        }
      : undefined;
  }, [directions]);

  React.useEffect(() => {
    return breathSound ?
    () => {
      breathSound.unloadAsync();
    } : undefined;
  }, [breathSound])

  const animatedProps = useAnimatedProps(() => {
    return {
      r: r.value,
    };
  });

  const animatedBackground = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(r.value, [20, 150], [1, 1.1]),
        },
      ],
    };
  });

  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(r.value, [20, 150], [0.3, 1]),
        },
      ],
      opacity: interpolate(r.value, [50, 120], [0, 1]),
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: beginSession && !breathHold
        ? interpolate(r.value, [20, 30, 130, 150], [0, 1, 1, 0])
        : opacity.value,
    };
  });


  React.useEffect(() => {
    // opacity.value = withRepeat(withTiming(0, {duration: 750}), 4, false)
    if (breathHold || !beginSession) {
      opacity.value = withRepeat(withTiming(0.2, { duration: 1000 }), -1, true);
      return;
    }

    playBinauralSounds();

    r.value = withSequence(
      withRepeat(
        withTiming(
          150,
          {
            duration: breathLength * 1000,
          },
          () => {
            if (counter.value === breaths * 2 + 1) {
              runOnJS(setBreathHold)(true);
              return;
            }

            if (counter.value % 2 === 0) {
              runOnJS(setBreathDirection)('Breathe Out');
            } else {
              runOnJS(setBreathDirection)('Breathe In');
            }
            counter.value += 1;
            runOnJS(setTextTimer)(Math.floor(counter.value / 2));
          }
        ),
        breaths * 2,
        true
      )
    );
  }, [breathHold, beginSession]);

  const [timer, setTimer] = React.useState(breathHoldTime);
  React.useEffect(() => {
    if (!breathHold) return;

    setBreathDirection('Breath Hold');

    opacity.value = withRepeat(withTiming(1, { duration: 5000 }), -1, true);

    let time = timer;
    const longBreathHold: any = setInterval(() => {
      time = time - 1;
      setTimer((prevTime) => prevTime - 1);
      if (time < 0) {
        clearInterval(longBreathHold);
        setBreathDirection('Breathe In');
        r.value = withTiming(150, { duration: breathLength * 1000 }, () => {
          runOnJS(setBreathDirection)('Breath Hold');
        });
        counter.value = 2;
        time = 15;
        setTimer(15);
        const shortBreathHold: any = setInterval(() => {
          time = time - 1;
          setTimer((prevTime) => prevTime - 1);
          if (time < 0) {
            clearInterval(shortBreathHold);
            setBreathDirection('Breathe Out');
            r.value = withTiming(20, { duration: breathLength * 1000 }, 
              () => {
                runOnJS(setBreathHold)(false);
                runOnJS(setTimer)(breathHoldTime);
                runOnJS(setBreathDirection)('Breathe In')
                
                runOnJS(setTextTimer)(1);
              }
            );
          }
        }, 1000);
      }
    }, 1000);
  }, [breathHold]);

  const countDown = (sec: number) => {
    if (sec < 0) return '0:00'
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (s <= 9) return `${m}:0${s}`;
    return `${m}:${s}`;
  };

  React.useEffect(() => {
    if (enableInstructions) {
      if (breathDirection === 'Breathe In') {playBreatheIn(); playBreathIn();}
      if (breathDirection === 'Breathe Out') {playBreatheOut(); playBreathOut();}
      if (breathDirection === 'Breath Hold'){playBreathHold(); playGong();}
    }
  }, [breathDirection, enableInstructions]);

  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#3f3f3f',
      }}>
      <AnimatedImageBackground
        style={[
          {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            zIndex: -1,
          },
          animatedBackground,
        ]}
        source={background}
      />
      {beginSession ? (
            <>
            <AnimatedText
              style={[
                {
                  position: 'absolute',
                  top: '17%',
                  fontWeight: '400',
                  fontSize: 50,
                  color: 'white',
                  fontFamily: 'Macondo',
                },
               animatedStyle,
              ]}>
              {breathDirection}
            </AnimatedText>

            <AnimatedText
              style={[
                {
                  position: 'absolute',
                  color: 'white',
                  bottom: '17%',
                  zIndex: 2,
                  fontWeight: '400',
                  fontSize: 50,
                  fontFamily: 'Macondo',
                },
                !breathHold && animatedText,
              ]}>
              {breathHold ? countDown(timer) : textTimer}
            </AnimatedText>
            <Svg
              style={{ zIndex: 1, position: 'absolute' }}
              width={540}
              height={960}
              viewBox="0 0 540 960">
              <AnimatedCircle
                cx={270}
                cy={480}
                r={r.value}
                fill="rgba(119, 178, 178, 0.8)"
                {...{ animatedProps }}
              />
            </Svg>
            </>
      ) : (
        <TouchableOpacity
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            setBreathDirection('Breathe In');
            setBeginSession(true);
          }}>
          <AnimatedText
            style={[
              {
                fontSize: 30,
                fontWeight: '600',
                color: 'white',
                fontFamily: 'Macondo',
              },
              animatedStyle,
            ]}>
            Tap to Begin Session
          </AnimatedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GuidedBreathing;
