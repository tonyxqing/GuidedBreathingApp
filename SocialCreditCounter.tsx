import * as React from "react"
import { TextProps as RNTextProps, View } from "react-native";
import { StyleSheet, TextInput } from "react-native"
import Svg, { SvgProps, Circle } from "react-native-svg"
import Animated, { useSharedValue, useAnimatedProps, useAnimatedStyle, interpolate, withTiming, Easing } from 'react-native-reanimated'
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

const updateSocialCredit = (creditRequest: number) => {

}

const SocialCreditCounter = (props: TextProps) => {
  const { style } = { style: {}, ...props };
  const text = useSharedValue("1");
  const opacity = useSharedValue(1);
  const regex = /\.\d*/gm
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
        duration: 3000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, () => {
        return text.value.replace(regex, "")
    })
  }, [])
  

  
  return (
    <View>
    <Animated.View style={{display: "flex", justifyContent: "center", alignSelf: "center"}}>
        <AnimatedTextInput 
        underlineColorAndroid="transparent"
        editable={false}
        value={text.value.replace(regex, "")}
        style={[styles.baseStyle, style]}
        {...{ animatedProps }}/>
    </Animated.View>
  </View>
)}

export default SocialCreditCounter