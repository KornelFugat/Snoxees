// SmallFireball.tsx
import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { Image, StyleSheet } from 'react-native';
import { CurrentTurn } from "types";

interface SmallFireballProps {
  triggerEnemyEffect: (repeats: number, damage: (number | 'miss' | '')[]) => void;
  triggerPlayerEffect: (repeats: number, damage: (number | 'miss' | '')[]) => void;
  isFireballActive: boolean;
  setIsFireballActive: (active: boolean) => void;
  damageResults: (number | 'miss' | '')[];
  currentTurn: 'start' | 'player' | 'enemy' | 'end';
}

const SmallFireball: React.FC<SmallFireballProps> = ({ triggerEnemyEffect, triggerPlayerEffect, isFireballActive, setIsFireballActive, damageResults, currentTurn }) => {
  const fireballX = useSharedValue(0);
  const fireballY = useSharedValue(0);
  const fireballOpacity = useSharedValue(0);


  const fireballAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: fireballX.value },
      { translateY: fireballY.value }
    ],
    opacity: fireballOpacity.value,
    zIndex: 1
  }));
//S
  const triggerFireball = (currentTurn: CurrentTurn) => {
    fireballOpacity.value = 1; // Make fireball visible
    fireballX.value = currentTurn === 'player' ? 100 : 350; // Reset to starting position
    fireballY.value = 500;

    // Animate the fireball towards the enemy
    fireballX.value = withTiming(currentTurn === 'player' ? 350 : 100, { duration: 1000, easing: Easing.out(Easing.ease) });
    fireballY.value = withTiming(499, { duration: 1000, easing: Easing.out(Easing.ease) }, () => {
          if (currentTurn === 'player') {
            runOnJS(triggerEnemyEffect)(damageResults.length, damageResults);
          } else {
            runOnJS(triggerPlayerEffect)(damageResults.length, damageResults);
          }
      fireballOpacity.value = 0; // Hide the fireball after hitting the target
    });
  };
//S
  useEffect(() => {
    if (isFireballActive) {
      triggerFireball(currentTurn);
      setIsFireballActive(false);
    }
  }, [isFireballActive]);

  return (
    <Animated.Image
      source={require('../../assets/fireball.png')}
      style={[styles.fireball, fireballAnimatedStyle]} // Fireball animation style
    />
  );
};

const styles = StyleSheet.create({
  fireball: {
    position: 'absolute',
    width: 50,
    height: 50,
    left: 50, // Adjust starting position
    top: 50,
  },
});

export default SmallFireball;
