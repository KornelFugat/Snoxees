// TeamModal.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import Animated from 'react-native-reanimated';
import { useMainStore } from '../stores/useMainStore';
import HealthBar from '../HealthBar';
import CharacterCard from '../CharacterCard';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const TeamModal = ({ isVisible, onClose }) => {
  const { team, ownedCharacters, addToTeam, removeCharacterFromTeam } = useMainStore();

  const handleRemoveFromTeam = (characterId) => {
    removeCharacterFromTeam(characterId);
  };

  const isCharacterInTeam = (characterId) => {
    return team.some(teamChar => teamChar.id === characterId);
  };

  const getCharacterTypeIcon = (type) => {
    const typeIconMap = {
      fire: require('../assets/fireskill.png'),
      grass: require('../assets/grassskill.png'),
      // Add other types as necessary
    };

    return typeIconMap[type] || null;
  };

  const renderTeamSlot = (char, index) => (
    <TouchableOpacity
      key={index}
      style={styles.teamCharacterContainer}
      onPress={() => char && handleRemoveFromTeam(char.id)}
    >
      {char ? (
        <>
          <Image source={char.currentImages.full} style={styles.fullCharacterImage} />
          <CharacterCard character={char} getCharacterTypeIcon={getCharacterTypeIcon} />
        </>
      ) : (
        <View style={styles.emptySlot} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.header}>Manage Your Team</Text>

        <View style={styles.teamSection}>
          <Text style={styles.subHeader}>Your Team</Text>
          <View style={styles.teamGrid}>
            {Array.from({ length: 4 }).map((_, index) => renderTeamSlot(team[index], index))}
          </View>
        </View>

        <View style={styles.ownedSection}>
          <Text style={styles.subHeader}>Available Characters</Text>
          <ScrollView horizontal={false} contentContainerStyle={styles.charactersGrid}>
            {ownedCharacters.map((char, index) => (
              <TouchableOpacity
                key={index}
                style={styles.characterContainer}
                onPress={() => addToTeam(char.id)}
              >
                <Animated.Image
                  source={char.currentImages.portrait}
                  style={[
                    styles.characterImage,
                    isCharacterInTeam(char.id) && styles.grayTint,
                  ]}
                />
                <View style={styles.characterInfo}>
                  <Text style={styles.characterName}>{char.name}</Text>
                  <Text style={styles.characterLevel}>Lv. {char.level}</Text>
                </View>
                <HealthBar currentHealth={char.currentHealth} maxHealth={char.baseStats.maxHealth} />
                <View style={styles.typeIconContainer}>
                  <Image source={getCharacterTypeIcon(char.type)} style={styles.typeIcon} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity onPress={onClose} style={styles.button}>
          <Text style={styles.buttonText}>Save & Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.95,
    height: height * 0.95,
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Black',
  },
  characterName: {
    fontFamily: 'Nunito-Black',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Black',

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
    height: '90%', // Adjusted to fit within the container
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 5,
  },
  fullCharacterImage: {
    width: '100%',
    height: '60%',
    contentFit: 'contain',
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    backgroundColor: 'lightgray',
    borderRadius: 8,
  },
  charactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  characterContainer: {
    margin: 15,
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  characterImage: {
    width: '100%',
    height: '50%',
    contentFit: 'contain',
  },
  grayTint: {
    tintColor: 'rgba(128, 128, 128, 0.5)',
  },
  teamSection: {
    marginBottom: 20,
    width: '100%',
  },
  ownedSection: {
    flex: 1,
    width: '100%',
    height: '40%',
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
  typeIcon: {
    width: 30,
    height: 30,
    contentFit: 'contain',
  },
});

export default TeamModal;
