import * as React from "react";
import { Text, View } from "react-native";
import Animated, { cancelAnimation, interpolate, runOnJS, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import Timer from "./Timer";



const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text)
const Blobsvg = () =>{ 
  const [textTimer, setTextTimer] = React.useState<number>(0)
  const breathsTillHold = React.useRef(35)
  const breathHoldTime = React.useRef(60000)
  const r = useSharedValue(20)
  const opacity = useSharedValue(1)
  const counter = useSharedValue(0)
  const animatedProps = useAnimatedProps(() => {
    return {
      r: r.value
    }
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(r.value, [20,200], [0, 1])
    }
  })
  
  React.useEffect(() => {
    // opacity.value = withRepeat(withTiming(0, {duration: 750}), 4, false)
    r.value = withSequence(withDelay(2000, withRepeat(
      withTiming(200, {
        duration: 3000,
      }, () => {
        counter.value += 1;
        runOnJS(setTextTimer)(Math.floor(counter.value / 2))
      }), breathsTillHold.current * 2, true
    )),  )
  }, [])
  
  return (
  <>
    {/* <AnimatedText style={[{position: 'absolute', top: "17%", fontWeight: "400", fontSize: 50, opacity: opacity.value}, animatedStyle]}>Beginning</AnimatedText> */}

    <Svg style={{zIndex: -1}} width={540} height={960} viewBox="0 0 540 960" xmlns="http://www.w3.org/2000/svg" >
      <AnimatedCircle
        cx={270}
        cy={480}
        r={r.value}
        fill="rgba(119, 178, 178, 0.8)"
        {...{animatedProps}}
        />
    </Svg>
    <AnimatedText style={[{position: 'absolute', bottom: "17%", fontWeight: "400", fontSize: 50}, animatedStyle]}>{textTimer}</AnimatedText>
  </> 
)};

export default Blobsvg;