import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import Animated from 'react-native-reanimated';
import { useMainStore } from '../stores/useMainStore';
import HealthBar from '../HealthBar';
import CharacterCard from '../CharacterCard';
import { Image } from 'expo-image';
import TeamCharacterCard from './TeamCharacterCard';
import { LinearGradient } from 'expo-linear-gradient';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import OwnedCharacterCard from './OwnedCharacterCard';
import { Character } from '../types'; // Ensure the types are correctly imported

const { width, height } = Dimensions.get('screen');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface TeamModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ isVisible, onClose }) => {
  const { team, ownedCharacters, addToTeam, removeCharacterFromTeam } = useMainStore();

  const handleRemoveFromTeam = (characterId: number) => {
    removeCharacterFromTeam(characterId);
  };

  const getCharacterTypeIcon = (type: string) => {
    const typeIconMap: { [key: string]: any } = {
      fire: require('../assets/fireskill.png'),
      grass: require('../assets/grassskill.png'),
      // Add other types as necessary
    };

    return typeIconMap[type] || null;
  };

  const getCharacterTypeColor = (type: string) => {
    const typeColorMap: { [key: string]: string } = {
      fire: '#D50B0B',
      grass: '#00A400',
      // Add other types as necessary
    };

    return typeColorMap[type] || 'white';
  };

  const renderTeamSlot = (char: Character | undefined, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.teamCharacterContainer}
      onPress={() => char && handleRemoveFromTeam(char.id)}
    >
      {char ? (
        <>
          <Image source={char.currentImages.full} style={styles.fullCharacterImage} contentFit='cover'/>
          <Image source={getCharacterTypeIcon(char.type)} style={styles.typeIcon} contentFit='cover'/>
          <TeamCharacterCard character={char} getCharacterTypeIcon={getCharacterTypeIcon} getCharacterTypeColor={getCharacterTypeColor} />
        </>
      ) : (
        <LinearGradient style={styles.emptySlot} colors={['#ffffff', '#9DA3AB']} start={{ x: 0.5, y: 0.5 }} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal} deviceHeight={height} statusBarTranslucent>
      <LinearGradient style={styles.modalContent} colors={['#E5E7E9', '#949BA4']}>
        <View style={{ marginBottom: 20 }}>
          <StrokeText
            text="MANAGE YOUR TEAM"
            fontSize={responsiveFontSize(15)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={4}
            fontFamily='Nunito-Black'
            align='center'
            numberOfLines={1}
          />
        </View>

        <LinearGradient style={styles.teamSection} colors={['#333333','#6D6D6D', '#333333','#6D6D6D']} start={{ x: 0, y: 0 }}>
          <View style={styles.teamGrid}>
            {Array.from({ length: 4 }).map((_, index) => renderTeamSlot(team[index], index))}
          </View>
        </LinearGradient>

        <View style={styles.ownedSection}>
          <ScrollView horizontal={false} contentContainerStyle={styles.charactersGrid}>
            {ownedCharacters.map((char, index) => (
              <TouchableOpacity
                key={index}
                style={styles.characterContainer}
                onPress={() => addToTeam(char.id)}
              >
                <OwnedCharacterCard character={char} getCharacterTypeIcon={getCharacterTypeIcon} getCharacterTypeColor={getCharacterTypeColor} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity onPress={onClose} style={styles.button}>
          <Text style={styles.buttonText}>Save & Close</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: width * 0.98,
    height: height * 0.95,
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  teamSection: {
    flex: 1.5,
    width: '100%',
    height: '50%',
    backgroundColor: '#333',
    marginBottom: 20,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 10,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 10,
    width: '100%',
    height: '50%', // Adjusted to fit two rows of larger characters
  },
  teamCharacterContainer: {
    width: '45%', // Adjusted to fit two columns
    height: '95%', // Adjusted to fit within the container
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 11,
    margin: 5,
    backgroundColor: 'white',
  },
  fullCharacterImage: {
    width: '50%',
    height: '50%',
  },
  typeIcon: {
    position: 'absolute',
    top: '1%',
    right: '1%',
    width: '25%',
    height: '20%',
    maxHeight: 50,
    maxWidth: 50,
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  ownedSection: {
    flex: 1,
    width: '100%',
    height: '0%',
    backgroundColor: '#333',
    borderRadius: 10,
  },
  charactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  characterContainer: {
    margin: 5,
    width: '30%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  characterName: {
    fontFamily: 'Nunito-Black',
  },
  grayTint: {
    tintColor: 'rgba(128, 128, 128, 0.5)',
  },
  button: {
    backgroundColor: '#1F1F1F',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6C541E',
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  typeIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
  },
});

export default TeamModal;
