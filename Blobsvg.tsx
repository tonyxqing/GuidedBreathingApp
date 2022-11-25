
import * as React from "react"
import type { TextProps as RNTextProps } from "react-native";
import { StyleSheet, TextInput } from "react-native"
import Svg, { SvgProps, Circle } from "react-native-svg"
import Animated, { useSharedValue, useAnimatedProps, useAnimatedStyle, interpolate, withTiming } from 'react-native-reanimated'
import { Text } from "react-native";

// implementation for animated text borrowed from react-native-redash by William Candillon 
const styles = StyleSheet.create({
  baseStyle: {
    color: 'black',
  }
});
Animated.addWhitelistedNativeProps({ text: true })

interface TextProps {
  style?: Animated.AnimateProps<RNTextProps>["style"];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);


const Blobsvg = (props: TextProps) => {
  const { style } = { style: {}, ...props };
  const text = useSharedValue("1");
  const opacity = useSharedValue(1);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: text.value
    } as any;
  })
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    }
  })

  React.useEffect(() => {
    text.value = withTiming("1000", {
      duration: 10000, 
    })
    
  }, [])
  
  return (
  <Animated.View style={{display: "flex", justifyContent: "center", alignSelf: "center", width: "100%", height: "100%" }}>
    <AnimatedTextInput 
    underlineColorAndroid="transparent"
    editable={false}
    value={text.value}
    style={[styles.baseStyle, style]}
    {...{ animatedProps }}/>
  </Animated.View>
)}

export default Blobsvg