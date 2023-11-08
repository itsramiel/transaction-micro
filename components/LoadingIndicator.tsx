import { StyleSheet } from "react-native";
import {
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { COLORS } from "../constants";
import {
  Easing,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const SIZE = 24;
const center = vec(SIZE / 2, SIZE / 2);

const STROKE_WIDTH = 4;
interface LoadingIndicatorProps {
  enabled: boolean;
}
export function LoadingIndicator({ enabled }: LoadingIndicatorProps) {
  const progress = useSharedValue(0);
  const loading = useSharedValue(0);

  const successOpacity = useDerivedValue(() => {
    return 1 - loading.value;
  }, []);

  useEffect(() => {
    loading.value = withTiming(enabled ? 1 : 0, { easing: Easing.linear });
  }, [enabled]);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(5, {
        duration: 2500,
        easing: Easing.bezier(0.45, 0.05, 0.55, 0.95),
      }),
      -1,
      false
    );
  }, []);

  const path = Skia.Path.Make();
  path.addArc(
    {
      x: STROKE_WIDTH / 2,
      y: STROKE_WIDTH / 2,
      width: SIZE - STROKE_WIDTH,
      height: SIZE - STROKE_WIDTH,
    },
    0,
    90
  );

  const transform = useDerivedValue(() => {
    return [{ rotate: progress.value * 2 * Math.PI }];
  }, []);

  const scale = useDerivedValue(() => {
    return [{ scale: interpolate(loading.value, [0, 0.5, 1], [1, 0.8, 1]) }];
  }, []);

  return (
    <Canvas style={styles.canvas}>
      <Group transform={scale}>
        <Group opacity={successOpacity}>
          <Circle c={center} r={SIZE / 2} style={"fill"} color={COLORS.green} />
          <Group
            transform={[
              { translateX: (SIZE - checkmarkBounds.width) / 2 },
              { translateY: (SIZE - checkmarkBounds.height) / 2 },
            ]}
          >
            <Path path={checkmarkPath} color={"white"} />
          </Group>
        </Group>
        <Group opacity={loading}>
          <Circle
            c={center}
            r={SIZE / 2 - STROKE_WIDTH / 2}
            style={"stroke"}
            strokeWidth={STROKE_WIDTH}
            color={COLORS.blue}
          />
          <Group origin={center} transform={transform}>
            <Path
              path={path}
              color={COLORS.darkBlue}
              style={"stroke"}
              strokeWidth={STROKE_WIDTH}
            />
          </Group>
        </Group>
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: SIZE,
    height: SIZE,
  },
});

const checkmarkPath = Skia.Path.MakeFromSVGString(
  "M10.3556 0.446509C10.2748 0.484113 10.1003 0.670567 7.46203 3.53633L4.65501 6.58541L3.19812 4.99349C1.55661 3.20102 1.67489 3.31384 1.45563 3.31697C1.26235 3.31854 1.26811 3.31227 0.636318 3.99541C-0.00990255 4.69423 -0.0012478 4.68169 0.000194657 4.91358C0.000194657 5.09377 0.0261589 5.14861 0.199254 5.3476C0.269934 5.42751 1.23782 6.4867 2.34852 7.701C3.89339 9.38693 4.38671 9.91652 4.44152 9.94786C4.50211 9.98389 4.5324 9.99016 4.63625 9.99016C4.87137 9.99016 4.48335 10.3881 8.41261 6.12162C11.3826 2.89705 11.9279 2.30009 11.9611 2.22644C11.9942 2.15124 12 2.12147 12 1.99925C11.9986 1.88331 11.9928 1.8457 11.9654 1.78773C11.9437 1.74072 11.7461 1.5151 11.374 1.10928C10.7479 0.42614 10.7451 0.423006 10.5518 0.413605C10.4595 0.408904 10.4292 0.413605 10.3556 0.446509Z"
)!;

const checkmarkBounds = checkmarkPath.getBounds();
