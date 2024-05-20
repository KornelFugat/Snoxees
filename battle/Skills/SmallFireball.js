import React, {useEffect} from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { Image, StyleSheet } from 'react-native';

const SmallFireball = ({playerTurn, triggerEnemyEffect, triggerPlayerEffect, isFireballActive, setIsFireballActive}) => {
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

    const triggerFireball = (playerTurn = true) => {
        fireballOpacity.value = 1; // Make fireball visible
        fireballX.value = playerTurn ? 100 : 350; // Reset to starting position
        fireballY.value = 500;

        // Animate the fireball towards the enemy
        fireballX.value = withTiming(playerTurn ? 350 : 100, { duration: 1000, easing: Easing.out(Easing.ease) });
        fireballY.value = withTiming(499, { duration: 1000, easing: Easing.out(Easing.ease) }, () => {
            if (playerTurn) {
                runOnJS(triggerEnemyEffect)(); // Trigger the player effect after animation
            } else {
                runOnJS(triggerPlayerEffect)(); // Trigger the enemy effect after animation
            }
            fireballOpacity.value = 0; // Hide the fireball after hitting the target
        });
    };

    useEffect(() => {
        if (isFireballActive) {
            triggerFireball(playerTurn);
            setIsFireballActive(false);            
        }
    }, [isFireballActive])


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

  export default SmallFireball