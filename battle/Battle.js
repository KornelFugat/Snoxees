// Battle.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useBattleLogic } from './BattleLogic';
import Battleground from './Battleground';
import BattleUI from './BattleUI';
import { useMainStore } from '../stores/useMainStore';
import {Image} from 'expo-image';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => Math.round((size * width) / 375);

const Battle = ({ onGoBack, onBattleEnd }) => {
  const triggerStartAnimation = useRef(false);
  const triggerEndAnimation = useRef(null)

  useEffect(() => {
    console.log(4, triggerEndAnimation)
  }, [triggerEndAnimation.current]);

  const {
    handleAttackRef,
    currentTurn,
    skillsDisabled,
    currentPlayerIndex,
    captureChance,
    announcement,
    handlePlayerAttack,
    handleCatchEnemy,
    handleCharacterSwitch,
  } = useBattleLogic(onBattleEnd, triggerStartAnimation, triggerEndAnimation);

  const { team, enemy } = useMainStore(state => ({
    team: state.team,
    enemy: state.enemy,
  }));

  return (
    <ImageBackground
        source={require('../assets/backgroundtoptest.png')}
        resizeMode="cover"
        style={styles.container}>
      <Battleground 
        currentTurn={currentTurn} 
        triggerAttack={(func) => handleAttackRef.current = func} 
        playerImage={team.length > 0 ? team[currentPlayerIndex].currentImages.full : 'paper.png'} 
        enemyImage={enemy.currentImages.full}
        currentPlayerIndex={currentPlayerIndex}
        triggerStartAnimation={triggerStartAnimation}
        triggerEndAnimation={triggerEndAnimation}
      />
      <BattleUI
        onAttackPress={handlePlayerAttack}
        skills={team.length > 0 ? team[currentPlayerIndex].skills.filter(skill => skill.level <= team[currentPlayerIndex].level) : []}
        team={team}
        currentPlayerIndex={currentPlayerIndex}
        onCharacterSwitch={handleCharacterSwitch}
        disabled={skillsDisabled}
        captureChance={captureChance}
        handleCatchEnemy={handleCatchEnemy}
        announcement={announcement}
      />
      <Image source={require('../assets/catch-book.png')} style={styles.catchBook} contentFit="cover"/>
      <TouchableOpacity style={styles.catchButton} onPress={handleCatchEnemy}>
        <StrokeText
          text="Capture!"
          fontSize={responsiveFontSize(15)}
          color="#FFFFFF"
          strokeColor="#333000"
          strokeWidth={3}
          fontFamily='Nunito-Black'
          align='center'
          numberOfLines={1}
          width={width*0.2}
          />
      </TouchableOpacity>
      <Text style={styles.captureChanceText}>{`${(captureChance * 100).toFixed(0)}%`}</Text>
      
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0208', // Dark background
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust based on your UI needs
    right: 20, // Adjust based on your UI needs
    backgroundColor: '#1F1F1F', // Dark button background
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6C541E', // Bronze border
  },
  catchBook: {
    position: 'absolute',
    top: '2%',
    width: '20%',
    height: '13%',
  },
  catchButton: {
    position: 'absolute',
    top: '14%', // Adjust based on your UI needs
    backgroundColor: '#20293F', // Dark button background
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6C541E', // Bronze border
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureChanceText: {
    position: 'absolute',
    color: '#FFFFFF', // White text
    fontSize: responsiveFontSize(10), // Adjust font size as needed
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
    backgroundColor: '#20293F',
    borderRadius: 5,
    padding: 5,
    top: '17.5%',
  },
  text: {
    color: '#FFFFFF', // White text
    fontSize: 10, // Adjust font size as needed
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Nunito-Black',
  },
});

export default Battle;
