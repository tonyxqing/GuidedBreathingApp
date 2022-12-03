import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
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
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

const GuidedBreathing = (props: BreathingProps) => {
  const { breaths, breathLength, breathHoldTime } = props;
  const [textTimer, setTextTimer] = React.useState<number>(0);
  const [breathDirection, setBreathDirection] =
    React.useState<BreathDirection>('Beginning');
  const [breathHold, setBreathHold] = React.useState<boolean>(false);
  const [beginSession, setBeginSession] = React.useState<boolean>(false);
  const r = useSharedValue(150);
  const opacity = useSharedValue(1);
  const counter = useSharedValue(0);
  const animatedProps = useAnimatedProps(() => {
    return {
      r: r.value,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(r.value, [20, 110, 110, 200], [0, 1, 1, 0]),
    };
  });

  React.useEffect(() => {
    // opacity.value = withRepeat(withTiming(0, {duration: 750}), 4, false)
    if (breathHold || !beginSession) return;
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

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:
          'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
      }}>
      {beginSession ? (
        <>
          <AnimatedText
            style={[
              {
                position: 'absolute',
                top: '17%',
                fontWeight: '400',
                fontSize: 50,
                opacity: opacity.value,
              },
              breathHold ? { opacity: 0.2 } : animatedStyle,
            ]}>
            {breathDirection}
          </AnimatedText>

          <Svg
            style={{ zIndex: -1 }}
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
              fontWeight: '400',
              fontSize: 50,
            }}>
            {breathHold ? countDown(timer) : textTimer}
          </AnimatedText>
        </>
      ) : (
        <View>
          <TouchableOpacity onPress={() => setBeginSession(true)}>
            <Text style={{ fontSize: 30 }}>Tap to Begin Session</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default GuidedBreathing;
