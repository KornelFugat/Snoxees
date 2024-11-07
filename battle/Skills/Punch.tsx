// Punch.tsx
import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';


interface PunchProps {
  isPunchActive: boolean;
  setIsPunchActive: (active: boolean) => void;
  triggerEnemyEffect: (repeats: number, damage: (number | 'miss' | '')[]) => void;
  triggerPlayerEffect: (repeats: number, damage: (number | 'miss' | '')[]) => void;
  playerImage: string;
  enemyImage: string;
  damageResults: (number | 'miss' | '')[];
  currentTurn: 'start' | 'player' | 'enemy' | 'end';
  isEnemyAsleep: boolean;
  isPlayerAsleep: boolean;
}

const Punch: React.FC<PunchProps> = ({ isPunchActive, setIsPunchActive, triggerEnemyEffect, triggerPlayerEffect, playerImage, enemyImage, damageResults, currentTurn, isEnemyAsleep, isPlayerAsleep }) => {
  const playerScale = useSharedValue(1);
  const enemyScale = useSharedValue(1);

  const punchPlayerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: playerScale.value }],
    };
  });

  const punchEnemyAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: enemyScale.value }, { scaleX: -1 }],
    };
  });
//S
const triggerPunch = (targetScale: typeof playerScale) => {
  targetScale.value = withSequence(
    withTiming(1.1, { duration: 200, easing: Easing.ease }), // Scale up slightly to show punch
    withTiming(1, { duration: 200, easing: Easing.ease }, () => {
      runOnJS(applyDamageEffects)(); // After the animation, apply damage
    })
  );
};
//S

  const applyDamageEffects = async () => {
        if (currentTurn === 'player') {
          triggerEnemyEffect(damageResults.length, damageResults);
        } else {
          triggerPlayerEffect(damageResults.length, damageResults);
        }
    runOnJS(setIsPunchActive)(false);
  };
//S
useEffect(() => {
  if (isPunchActive) {
    if (currentTurn === 'player' && !isPlayerAsleep) {
      triggerPunch(playerScale);
    } else if (currentTurn === 'enemy' && !isEnemyAsleep) {
      triggerPunch(enemyScale);
    }
  }
}, [isPunchActive]);

  return (
    <>
      {/* <Animated.Image
        source={{uri: playerImage}}
        style={[styles.attacker, punchPlayerAnimatedStyle]}
      />
      <Animated.Image
        source={{uri: enemyImage}}
        style={[styles.enemy, punchEnemyAnimatedStyle]} // The original enemy image
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  attacker: {
    width: '30%',
    height: '25%',
    top: '63%',
    left: '10%',
    position: 'absolute',
  },
  enemy: {
    width: '30%',
    height: '25%',
    top: '63%',
    right: '10%',
    position: 'absolute',
    transform: [{ scaleX: -1 }]
  },
});

export default Punch;
