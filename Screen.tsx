import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import TeamModal from './modals/TeamModal';
import CharacterModal from './modals/CharacterModal';
import { characters } from './charactersData';
import DraggableMap from './DraggableMap';
import LoadingComponent from './LoadingComponent';
import { checkBattleRequirements } from 'api/battleApi';
import { Character } from 'types';
import { addCharacterToOwned, fetchAccountDetails, resetCurrentHealth } from 'api/accountApi';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

type ScreenProps = {
  onStartGame: () => void;
  onTeamUI: () => void;
  onCharactersUI: () => void;
  onBattleEnd: () => void;
};

const Screen: React.FC<ScreenProps> = ({ onStartGame, onBattleEnd, onTeamUI, onCharactersUI }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [team, setTeam] = React.useState<Character[]>([]);
  const [ownedCharacters, setOwnedCharacters] = React.useState<Character[]>([]);


  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const result = await fetchAccountDetails();
        setOwnedCharacters(result.ownedCharacters);
        setTeam(result.team);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch account:', error);
      }
    }
    fetchAccount();
  }, [])
  // useEffect(() => {
  //   const minimumLoadingTime = 3000; 
  //   const timer = setTimeout(() => {
  //     setIsReady(true);
  //   }, minimumLoadingTime);

  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   if (isReady) {
  //     setIsLoading(false);
  //   }
  // }, [isReady]);


  const addCharactersG = async () => {
    try{
      addCharacterToOwned('Glimmbear');
      const result = await fetchAccountDetails();
      setOwnedCharacters(result.ownedCharacters);
    } catch (error) {
      console.error('Failed to add character:', error);
    }
  };
  const addCharactersT = async () => {
    try{
      addCharacterToOwned('Tigravine');
      const result = await fetchAccountDetails();
        setOwnedCharacters(result.ownedCharacters);
    } catch (error) {
      console.error('Failed to add character:', error);
    }
  };
  const addCharactersF = async () => {
    try{
      addCharacterToOwned('Fruigle');
      const result = await fetchAccountDetails();
        setOwnedCharacters(result.ownedCharacters);
    } catch (error) {
      console.error('Failed to add character:', error);
    }
  };

  const resetCharactersHealth = async () => {
    try{
      const result = await resetCurrentHealth();
      setOwnedCharacters(result.ownedCharacters);
    } catch (error) {
      console.error('Failed to reset characters health:', error);
    }
  }

  const handleOpenTeamModal = () => {
    onTeamUI()
  }

  const handleOpenCharactersModal = () => {
    onCharactersUI()
  }

  const handleStartGame = () => {
    if (team.length === 0) {
      Alert.alert('No Team', 'Please add at least one character to your team before starting the game.');
    } else {
      checkBattleRequirements();
      onStartGame();
    }
  };

  const handleBattleEnd = () => {
    onBattleEnd();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.absoluteButtonContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={addCharactersT} style={styles.button}>
            <Text style={styles.buttonText}>ADD TIGRAVINE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addCharactersG} style={styles.button}>
            <Text style={styles.buttonText}>ADD GLIMMBEAR</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addCharactersF} style={styles.button}>
            <Text style={styles.buttonText}>ADD FRUIGLE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resetCharactersHealth}>
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
      <DraggableMap onStartGame={handleStartGame} team={team}/>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0208', // Dark background
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: responsiveFontSize(18),
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
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
