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
  const translateXPlayer = useSharedValue(0);
  const translateXEnemy = useSharedValue(0);
  const zIndexPlayer = useSharedValue(0);
  const zIndexEnemy = useSharedValue(0);

  const punchPlayerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXPlayer.value }],
      zIndex: zIndexPlayer.value,
    };
  });

  const punchEnemyAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXEnemy.value }, { scaleX: -1 }],
      zIndex: zIndexEnemy.value,
    };
  });
//S
  const triggerPunchPlayer = () => {
    zIndexPlayer.value = 1;
    translateXPlayer.value = withSequence(
      withTiming(200, { duration: 400, easing: Easing.back(3) }),
      withTiming(0, { duration: 600, easing: Easing.cubic }, () => {
        zIndexPlayer.value = 0;
        runOnJS(applyDamageEffects)();
      }),
    );
  };
//S
  const triggerPunchEnemy = () => {
    zIndexEnemy.value = 1;
      translateXEnemy.value = withSequence(
        withTiming(-200, { duration: 400, easing: Easing.back(3) }),
        withTiming(0, { duration: 600, easing: Easing.cubic }, () => {
          zIndexEnemy.value = 0;
          runOnJS(applyDamageEffects)();
        }),
      );    
  };

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
        triggerPunchPlayer();
      }
      if (currentTurn === 'enemy' && !isEnemyAsleep) {
        triggerPunchEnemy();
      }
    }
  }, [isPunchActive]);

  return (
    <>
      <Animated.Image
        source={{uri: playerImage}}
        style={[styles.attacker, punchPlayerAnimatedStyle]}
      />
      <Animated.Image
        source={{uri: enemyImage}}
        style={[styles.enemy, punchEnemyAnimatedStyle]} // The original enemy image
      />
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
