import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';


interface JoystickProps {
  onMove: (dx: number, dy: number) => void;
}

const Joystick: React.FC<JoystickProps> = ({ onMove }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.5);
  const radius = 40; // Maximum radius of movement
  const moveInterval = useRef<number | null>(null);

  const updateMovement = useCallback((x: number, y: number) => {
    const distance = Math.sqrt(x ** 2 + y ** 2);
    const angle = Math.atan2(y, x);
    onMove(distance * Math.cos(angle), distance * Math.sin(angle));
  }, [onMove]);

  const startContinuousMove = (x: number, y: number) => {
    if (moveInterval.current !== null) {
      cancelAnimationFrame(moveInterval.current);
    }
    const move = () => {
      updateMovement(x, y);
      moveInterval.current = requestAnimationFrame(move);
    };
    moveInterval.current = requestAnimationFrame(move);
  };

  const stopContinuousMove = () => {
    if (moveInterval.current !== null) {
      cancelAnimationFrame(moveInterval.current);
      moveInterval.current = null;
    }
    onMove(0, 0); // Stop movement
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      translateX.value = 0;
      translateY.value = 0;
      opacity.value = withTiming(1, { duration: 100 });
    })
    .onUpdate((event) => {
      const x = event.translationX;
      const y = event.translationY;
      const distance = Math.sqrt(x ** 2 + y ** 2);
      const angle = Math.atan2(y, x);

      if (distance > radius) {
        translateX.value = radius * Math.cos(angle);
        translateY.value = radius * Math.sin(angle);
      } else {
        translateX.value = x;
        translateY.value = y;
      }

      runOnJS(onMove)(distance * Math.cos(angle), distance * Math.sin(angle));

      // Start or update continuous movement
      runOnJS(startContinuousMove)(distance * Math.cos(angle), distance * Math.sin(angle));
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { damping: 20 }); // Reduced damping for faster snap-back
      translateY.value = withSpring(0, { damping: 20 }); // Reduced damping for faster snap-back
      runOnJS(stopContinuousMove)();
      opacity.value = withTiming(0.5, { duration: 100 }); // Reduced from 200ms to 100ms
    });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.joystick, animatedStyle]} />
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    top: 220,
  },
  joystick: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
  },
});

export default Joystick;
