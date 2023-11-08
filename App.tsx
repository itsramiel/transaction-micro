import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, View } from "react-native";

import { COLORS } from "./constants";
import { LoadingIndicator } from "./components";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function App() {
  const [loading, setLoading] = useState(true);
  const rLoading = useSharedValue(true);

  useEffect(() => {
    rLoading.value = loading;
  }, [loading]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        rLoading.value ? COLORS.lightBlue : COLORS.lightGreen
      ),
    };
  }, []);

  const textStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(rLoading.value ? COLORS.darkBlue : COLORS.green),
    };
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedPressable
        onPress={() => setLoading((prev) => !prev)}
        layout={Layout.springify().damping(14)}
        style={[
          {
            padding: 16,
            borderRadius: 100,
            flexDirection: "row",
          },
          containerStyle,
        ]}
      >
        <Animated.View style={{ marginRight: 8 }} entering={FadeIn}>
          <LoadingIndicator enabled={loading} />
        </Animated.View>
        {loading ? (
          <Animated.Text
            style={[styles.txt, textStyle]}
            entering={FadeInLeft.delay(150).duration(150)}
            exiting={FadeOutLeft.duration(100)}
          >
            Analyzing
          </Animated.Text>
        ) : null}
        <Animated.Text layout={Layout} style={[styles.txt, textStyle]}>
          {" "}
          Transaction{" "}
        </Animated.Text>
        {!loading ? (
          <Animated.Text
            style={[styles.txt, textStyle]}
            entering={FadeInRight.delay(150).duration(150)}
            exiting={FadeOutRight.duration(100)}
          >
            Safe
          </Animated.Text>
        ) : null}
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkBlue,
  },
});
