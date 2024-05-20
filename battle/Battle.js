// Battle.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useBattleLogic } from './BattleLogic';
import Battleground from './Battleground';
import BattleUI from './BattleUI';
import { useMainStore } from '../stores/useMainStore';

const Battle = ({ onGoBack, onBattleEnd }) => {
  const {
    handleAttackRef,
    currentTurn,
    skillsDisabled,
    currentPlayerIndex,
    captureChance,
    handlePlayerAttack,
    handleCatchEnemy,
    handleCharacterSwitch,
  } = useBattleLogic(onBattleEnd);

  const { team, enemy } = useMainStore(state => ({
    team: state.team,
    enemy: state.enemy,
  }));

  return (
    <View style={styles.container}>
      <Battleground 
        currentTurn={currentTurn} 
        triggerAttack={(func) => handleAttackRef.current = func} 
        playerImage={team.length > 0 ? team[currentPlayerIndex].currentImages.full : 'paper.png'} 
        enemyImage={enemy.currentImages.full}
        currentPlayerIndex={currentPlayerIndex}
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
      />
      <TouchableOpacity style={styles.catchButton} onPress={handleCatchEnemy}>
        <Text style={styles.text}>Catch Enemy</Text>
        <Text style={styles.captureChanceText}>{`Capture Chance: ${(captureChance * 100).toFixed(0)}%`}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
        <Text style={styles.text}>Back to Home</Text>
      </TouchableOpacity>
    </View>
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
  catchButton: {
    position: 'absolute',
    top: 40, // Adjust based on your UI needs
    left: 20, // Adjust based on your UI needs
    backgroundColor: '#1F1F1F', // Dark button background
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6C541E', // Bronze border
  },
  text: {
    color: '#FFFFFF', // White text
    fontSize: 24, // Adjust font size as needed
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default Battle;
