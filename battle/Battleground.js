import React, {useEffect, useState} from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing, runOnJS, withSpring } from 'react-native-reanimated';
import { View, Text, StyleSheet, Button, TouchableOpacity, ImageBackground, Image } from 'react-native';
import SmallFireball from "./Skills/SmallFireball";
import Punch from "./Skills/Punch";
import { useMainStore } from "../stores/useMainStore";
import HealthBar from "../HealthBar";
import CharacterCard from "../CharacterCard";


const Battleground = ({ triggerAttack, currentTurn, playerImage, enemyImage, currentPlayerIndex  }) => {
    const enemyOpacity = useSharedValue(0);
    const playerOpacity = useSharedValue(0);
    const enemyDamageText = useSharedValue('');
    const playerDamageText = useSharedValue('');
    const enemyDamageY = useSharedValue(0);
    const playerDamageY = useSharedValue(0);
    const enemyTextOpacity = useSharedValue(0);
    const playerTextOpacity = useSharedValue(0);
    const [turn, setTurn] = useState(currentTurn === 'player');
    const [isPunchActive, setIsPunchActive] = useState(false);
    const [isFireballActive, setIsFireballActive] = useState(false);
    const { enemy, team  } = useMainStore(state => ({
      enemy: state.enemy,
      team: state.team,
    }));

    //ENEMY GOT HIT

    const triggerEnemyEffect = (repeats = 1, damage = 0) => {
      const animations = [];
      const textAnimations = [];
      for (let i = 0; i < repeats; i++) {
        animations.push(
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 500 })
        );
        textAnimations.push(
          withSpring(0, { duration: 500 }),
          withSpring(-40, { duration: 500 }),
        );
      }
      enemyOpacity.value = 0;
      enemyTextOpacity.value = 0;
      enemyDamageText.value = (damage/repeats).toString();
      enemyDamageY.value = 0;
  
      setTimeout(() => {
        enemyOpacity.value = withSequence(...animations);
        enemyTextOpacity.value = withSequence(...animations);
        enemyDamageY.value = withSequence(...textAnimations);
      }, 50); // Ensure a small delay to allow the reset to take effect
    };

    const enemyDamageTaken = useAnimatedStyle(() => ({
      opacity: enemyOpacity.value,
      tintColor: 'red',
    }));

    const enemyDamageTakenText = useAnimatedStyle(() => ({
      opacity: enemyTextOpacity.value,
      transform: [{ translateY: enemyDamageY.value }],
    }))
      
      //PLAYER GOT HIT

    const triggerPlayerEffect = (repeats = 1, damage = 0) => {
      const animations = [];
      const textAnimations = [];
      for (let i = 0; i < repeats; i++) {
        animations.push(
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 500 })
        );
        textAnimations.push(
          withSpring(0, { duration: 500 }),
          withSpring(-40, { duration: 500 }),
        );
      }
      playerOpacity.value = 0;
      playerTextOpacity.value = 0;
      playerDamageText.value = (damage/repeats).toString();
      playerDamageY.value = 0;
  
      setTimeout(() => {
        playerOpacity.value = withSequence(...animations);
        playerTextOpacity.value = withSequence(...animations);
        playerDamageY.value = withSequence(...textAnimations);
      }, 50); // Ensure a small delay to allow the reset to take effect
    }

    const playerDamageTaken = useAnimatedStyle(() => ({
      opacity: playerOpacity.value,
      tintColor: 'red',
    }));

    const playerDamageTakenText = useAnimatedStyle(() => ({
      opacity: playerTextOpacity.value,
      transform: [{ translateY: playerDamageY.value }],
    }))


    //TURN ANNOUNCEMENT

    useEffect(() => {
      console.log(`Turn: ${turn ? "player" : "enemy"}`);
    }, [turn, playerImage])

    //HANDLING ATTACKS BEING USED


    const handleAttack = async (attackName) => {
      switch (attackName) {
        case "Small Fireball":
            setIsFireballActive(true);
            console.log("uses Fireball");
            await new Promise(resolve => setTimeout(resolve, 2000));
            setTurn(!turn);
            break;
        case "Thorns":
            console.log("uses Thorns");
            setTurn(!turn);
            break;
        case "Punch":
            setIsPunchActive(true);
            console.log("uses Punch");
            await new Promise(resolve => setTimeout(resolve, 2000));
            setTurn(!turn);
            break;
        default:
            console.log("No specific animation for this attack");
      }
    };

    triggerAttack(handleAttack);

    useEffect(() => {
      setTurn(currentTurn === 'player');
    }, [currentTurn]);

    const getCharacterTypeIcon = (type) => {
      const typeIconMap = {
          fire: require('../assets/fireskill.png'),
          grass: require('../assets/grassskill.png'),
          // Add other types as necessary
      };
      return typeIconMap[type] || null;
  };

  return (
    <View
        style={styles.topPart}>
        <View style={styles.playerContainer}>
          <CharacterCard
            character={team[currentPlayerIndex]}
            getCharacterTypeIcon={getCharacterTypeIcon}
          />
        </View>
        <View style={styles.enemyContainer}>
          <CharacterCard
            character={enemy}
            getCharacterTypeIcon={getCharacterTypeIcon}
            style={styles.reversedCard}
          />
        </View>


        {/* PLAYER MODEL */}
        {!isPunchActive && (
        <Image 
          source={playerImage} 
          style={[styles.attacker]} // The original enemy image
        />
        )}

        {/* ATTACKS */}

        <Punch playerTurn={turn} triggerEnemyEffect={triggerEnemyEffect} triggerPlayerEffect={triggerPlayerEffect} isPunchActive={isPunchActive} setIsPunchActive={setIsPunchActive} playerImage={playerImage} enemyImage={enemyImage} currentPlayerIndex={currentPlayerIndex} />

        <SmallFireball playerTurn={turn} triggerEnemyEffect={triggerEnemyEffect} triggerPlayerEffect={triggerPlayerEffect} isFireballActive={isFireballActive} setIsFireballActive={setIsFireballActive} />



        {/* PLAYER MODEL ANIMATION */}
        <Animated.Image 
          source={playerImage} 
          style={[styles.attacker, playerDamageTaken]} 
        />
        
        {/* ENEMY MODEL */}
        {!isPunchActive && (
          <Image
            source={enemyImage}
            style={styles.enemy} // The original enemy image
          />
        )}

        {/* ENEMY MODEL ANIMATION */}
        <Animated.Image 
          source={enemyImage} 
          style={[styles.enemy, enemyDamageTaken]} // Apply the animated style
        />

      <Animated.Text style={[styles.damageEnemyText, enemyDamageTakenText]}>
        {enemyDamageText.value}
      </Animated.Text>
      <Animated.Text style={[styles.damagePlayerText, playerDamageTakenText]}>
        {playerDamageText.value}
      </Animated.Text>
        
      </View>
  );
};

const styles = StyleSheet.create({
    topPart: {
      flex: 7, // 60% of the screen
      justifyContent: 'top',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'transparent'
    },
    playerContainer: {
      flex:1,
      position: 'absolute',
      top: '5%',
      left: '2%',
      width: '40%',
      height:'40%'
    },
    damageEnemyText: {
      position: 'absolute',
      top: '65%',
      right: '20%',
      fontSize: 40,
      color: 'white',
    },
    damagePlayerText: {
      position: 'absolute',
      top: '65%',
      left: '20%',
      fontSize: 40,
      color: 'white',
    },
    enemyContainer: {
      position: 'absolute',
      top: '5%',
      right: '0%',
      width: '40%',
      height:'40%'
    },
    reversedCard: {
      transform: [{ rotateX: '180deg' }],
    },
    placeholderPlayerUI: {
      flex: 1,
      width: '30%',
      top: '20%',
      right: '66%',
      position: 'absolute',
      justifyContent: 'center',
    },
    placeholderimage: {
      flex: 1,
      width: '100%',
      height: '100%',
      contentFit: 'cover',
    },
    healthBar: {
      width: '100%',
      position: 'absolute',
      bottom: 0,
      backgroundColor: '#000000', // Black background
      borderRadius: 10, // Add a border radius for a better look
      justifyContent: 'center', // Center the text
      alignItems: 'center', // Center the text
    },
    healthText: {
      flex: 1,
      textAlign: 'center',
      color: '#FFFFFF', // White text for visibility
      fontSize: 30, // Adjust the font size as needed
      width: '100%', // Cover the full width of the button
      textShadowColor:'#000000',
      textShadowOffset:{width: 2, height: 2},
      textShadowRadius:3,
      position: 'absolute',
    },
    placeholderEnemyUI: {
      flex: 1,
      width: '30%',
      top: '20%',
      right: '3%',
      position: 'absolute',
      justifyContent: 'center',
    },
    attacker: {
      width: '30%',
      height: '25%',
      top: '65%',
      left: '10%',
      position: 'absolute',
    },
    enemy: {
      width: '30%',
      height: '25%',
      top: '65%',
      right: '10%',
      position: 'absolute',
      transform: [{ scaleX: -1 }]
    },
  });

export default Battleground;