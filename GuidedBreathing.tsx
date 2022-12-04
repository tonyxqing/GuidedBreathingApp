import * as React from 'react';
import { Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Audio } from 'expo-av';
import { Freeze } from 'react-freeze';
type BreathDirection =
  | 'Breathe In'
  | 'Breathe Out'
  | 'Beginning'
  | 'Breath Hold';

interface BreathingProps {
  navigation: any;
  route: any;
  breaths: number;
  breathLength: number;
  breathHoldTime: number;
  background: any;
}

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

const GuidedBreathing = (props: BreathingProps) => {
  const { breaths, breathLength, breathHoldTime, background } = props;
  const [textTimer, setTextTimer] = React.useState<number>(0);
  const [breathDirection, setBreathDirection] =
    React.useState<BreathDirection>('Beginning');
  const [breathHold, setBreathHold] = React.useState<boolean>(false);
  const [beginSession, setBeginSession] = React.useState<boolean>(false);
  const r = useSharedValue(150);
  const opacity = useSharedValue(1);
  const counter = useSharedValue(0);
  const [binaural, setBinauralSounds] = React.useState<any>();
  const [directions, setDirectionSounds] = React.useState<any>();
  const [freeze, setFreeze] = React.useState<boolean>(false);
  async function playBinauralSounds() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/audiomass-output.mp3')
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
    setDirectionSounds(sound);
    await sound.playAsync();
  }

  React.useEffect(() => {
    return binaural
      ? () => {
          binaural.unloadAsync();
        }
      : undefined;
  }, [binaural]);

  React.useEffect(() => {
    return directions
      ? () => {
          directions.unloadAsync();
        }
      : undefined;
  }, [directions]);

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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: beginSession
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
          20,
          {
            duration: breathLength * 1000,
          },
          () => {
            if (counter.value === breaths * 2) {
              runOnJS(setBreathHold)(true);
              return;
            }

            if (counter.value % 2 === 0) {
              runOnJS(setBreathDirection)('Breathe In');
            } else {
              runOnJS(setBreathDirection)('Breathe Out');
            }

            counter.value += 1;
            runOnJS(setTextTimer)(Math.floor(counter.value / 2));
          }
        ),
        breaths * 2 + 1,
        true
      )
    );
  }, [breathHold, beginSession]);

  const [timer, setTimer] = React.useState(0);
  React.useEffect(() => {
    if (!breathHold) return;
    setBreathDirection('Breath Hold');
    opacity.value = withRepeat(withTiming(1, { duration: 5000 }), -1, true);
    const longBreathHold: any = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
    setTimeout(() => {
      setBreathDirection('Breathe In');
      r.value = withTiming(150, { duration: 2000 }, () => {
        runOnJS(setBreathDirection)('Breath Hold');
      });
      counter.value = 0;
      setTimer(0);
      setTextTimer(0);
      const shortBreathHold: any = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
      setTimeout(() => {
        setBreathHold(false);
        setBreathDirection('Breathe Out');
        setTimer(0);
        return clearInterval(shortBreathHold);
      }, 15000);
      return clearInterval(longBreathHold);
    }, breathHoldTime * 1000 + 500);
  }, [breathHold]);
  const countDown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (s <= 9) return `${m}:0${s}`;
    return `${m}:${s}`;
  };

  React.useEffect(() => {
    if (breathDirection === 'Breathe In') playBreatheIn();
    if (breathDirection === 'Breathe Out') playBreatheOut();
    if (breathDirection === 'Breath Hold') playGong();
  }, [breathDirection]);

  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
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
        <TouchableOpacity
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setFreeze((prev) => !prev)}>
          <Freeze freeze={freeze}>
            <AnimatedText
              style={[
                {
                  position: 'absolute',
                  top: '17%',
                  fontWeight: '400',
                  fontSize: 50,
                  color: 'white',

                  opacity: opacity.value,
                },
                breathHold ? { opacity: 0.2 } : animatedStyle,
              ]}>
              {breathDirection}
            </AnimatedText>

            <Svg
              style={{ zIndex: 1, position: 'absolute' }}
              width={540}
              height={960}
              viewBox="0 0 540 960"
              xmlns="http://www.w3.org/2000/svg">
              <AnimatedCircle
                cx={270}
                cy={480}
                r={r.value}
                fill="rgba(119, 178, 178, 0.8)"
                {...{ animatedProps }}
              />
            </Svg>
            <AnimatedText
              style={{
                position: 'absolute',
                bottom: '17%',
                color: 'white',

                fontWeight: '400',
                fontSize: 50,
              }}>
              {breathHold ? countDown(timer) : textTimer}
            </AnimatedText>
          </Freeze>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setBeginSession(true)}>
          <AnimatedText
            style={[
              { fontSize: 30, fontWeight: '600', color: 'white' },
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
