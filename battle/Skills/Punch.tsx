// Punch.tsx
import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import attacksData from '../../attacks.json';
import { useMainStore } from "../../stores/useMainStore";
import { Character } from '../../types';
import { ImageSourcePropType } from 'react-native';

interface PunchProps {
  playerTurn: boolean;
  isPunchActive: boolean;
  setIsPunchActive: (active: boolean) => void;
  triggerEnemyEffect: (repeats: number, damage: number) => void;
  triggerPlayerEffect: (repeats: number, damage: number) => void;
  playerImage: ImageSourcePropType;
  enemyImage: ImageSourcePropType;
  currentPlayerIndex: number;
}

const Punch: React.FC<PunchProps> = ({ playerTurn, isPunchActive, setIsPunchActive, triggerEnemyEffect, triggerPlayerEffect, playerImage, enemyImage, currentPlayerIndex }) => {
  const translateXPlayer = useSharedValue(0);
  const translateXEnemy = useSharedValue(0);
  const zIndexPlayer = useSharedValue(0);
  const zIndexEnemy = useSharedValue(0);

  const attack = attacksData.find(a => a.name === "Punch");

  const { team, enemy } = useMainStore(state => ({
    team: state.team as Character[],
    enemy: state.enemy as Character
  }));

  const calculateDamage = (baseDamage: number, attackType: string, characterStats: any, multiplier: number) => {
    return attackType === 'normal'
      ? baseDamage * characterStats.normalDamage * multiplier
      : baseDamage * characterStats.elementalDamage * multiplier;
  };

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

  const triggerPunchPlayer = () => {
    zIndexPlayer.value = 1;
    const actualDamage = calculateDamage(attack!.damage, attack!.type, team[currentPlayerIndex].temporaryStats, attack!.multiplier);
    console.log(attack, actualDamage, team[currentPlayerIndex].temporaryStats);
    translateXPlayer.value = withSequence(
      withTiming(200, { duration: 400, easing: Easing.back(3) }),
      withTiming(0, { duration: 600, easing: Easing.cubic }, () => {
        zIndexPlayer.value = 0;
        runOnJS(triggerEnemyEffect)(2, actualDamage);
        runOnJS(setIsPunchActive)(false);
      }),
    );
  };

  const triggerPunchEnemy = () => {
    zIndexEnemy.value = 1;
    const actualDamage = calculateDamage(attack!.damage, attack!.type, enemy.temporaryStats, attack!.multiplier);
    translateXEnemy.value = withSequence(
      withTiming(-200, { duration: 400, easing: Easing.back(3) }),
      withTiming(0, { duration: 600, easing: Easing.cubic }, () => {
        zIndexEnemy.value = 0;
        runOnJS(triggerPlayerEffect)(2, actualDamage);
        runOnJS(setIsPunchActive)(false);
      }),
    );
  };

  useEffect(() => {
    if (isPunchActive) {
      if (playerTurn) {
        triggerPunchPlayer();
      }
      if (!playerTurn) {
        triggerPunchEnemy();
      }
    }
  }, [isPunchActive]);

  return (
    <>
      <Animated.Image
        source={playerImage}
        style={[styles.attacker, punchPlayerAnimatedStyle]}
      />
      <Animated.Image
        source={enemyImage}
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
