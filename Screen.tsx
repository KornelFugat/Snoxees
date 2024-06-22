import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useMainStore } from './stores/useMainStore';
import TeamModal from './modals/TeamModal';
import CharacterModal from './modals/CharacterModal';
import { characters } from './charactersData';
import DraggableMap from './DraggableMap';
import LoadingComponent from './LoadingComponent';

type ScreenProps = {
  onStartGame: () => void;
  onBattleEnd: () => void;
};

const Screen: React.FC<ScreenProps> = ({ onStartGame, onBattleEnd }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isTeamModalVisible, setTeamModalVisible] = useState(false);
  const [isCharacterModalVisible, setCharacterModalVisible] = useState(false);

  const { playerName, team, updatePlayerName, ownedCharacters, enemy, addCharacterToOwned, setEnemy, resetCurrentHealth } = useMainStore();

  useEffect(() => {
    console.log("HOME", team);

    const minimumLoadingTime = 3000; // 10 seconds delay
    const timer = setTimeout(() => {
      setIsReady(true);
    }, minimumLoadingTime);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady) {
      setIsLoading(false);
    }
  }, [isReady]);

  const addCharactersG = () => {
    addCharacterToOwned('Glimmbear');
  };
  const addCharactersT = () => {
    addCharacterToOwned('Tigravine');
  };
  const addCharactersF = () => {
    addCharacterToOwned('Fruigle');
  };

  const handleSetEnemy = () => {
    const allCharacters = Object.values(characters); // Ensure characters is an object where keys are character names
    const randomEnemy = allCharacters[Math.floor(Math.random() * allCharacters.length)];
    setEnemy({ ...randomEnemy, currentHealth: randomEnemy.baseStats.maxHealth });
  };

  const handleStartGame = () => {
    if (team.length === 0) {
      Alert.alert('No Team', 'Please add at least one character to your team before starting the game.');
    } else {
      handleSetEnemy();
      onStartGame();
    }
  };

  const handleBattleEnd = () => {
    onBattleEnd();
  };

  // if (isLoading) {
  //   return <LoadingComponent duration={3000} />;
  // }

  return (
    <View style={styles.container}>
      <View style={styles.absoluteButtonContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setTeamModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>TEAM</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCharacterModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>CHARACTERS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addCharactersT} style={styles.button}>
            <Text style={styles.buttonText}>ADD TIGRAVINE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addCharactersG} style={styles.button}>
            <Text style={styles.buttonText}>ADD GLIMMBEAR</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addCharactersF} style={styles.button}>
            <Text style={styles.buttonText}>ADD FRUIGLE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resetCurrentHealth}>
            <Text style={styles.buttonText}>Reset HP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Start the Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleBattleEnd}>
            <Text style={styles.buttonText}>Ending</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TeamModal isVisible={isTeamModalVisible} onClose={() => setTeamModalVisible(false)} />
      <CharacterModal isVisible={isCharacterModalVisible} onClose={() => setCharacterModalVisible(false)} />
      <DraggableMap onStartGame={handleStartGame} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0D0208',
  },
  absoluteButtonContainer: {
    position: 'absolute',
    top: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '90%', // Adjust as needed for padding
  },
  button: {
    backgroundColor: '#1F1F1F',
    padding: 10,
    marginHorizontal: 10, // Space between buttons
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#6C541E',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    minWidth: 100, // Ensure all buttons have at least this width
    zIndex: 1,
  },
  buttonText: {
    color: '#4A7729',
    fontSize: 18,
    fontFamily: 'Nunito-Black',
  },
});

export default Screen;
