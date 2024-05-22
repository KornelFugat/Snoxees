// CharacterCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import HealthBar from './HealthBar';

const CharacterCard = ({ character, getCharacterTypeIcon, customStyles = {}, isActive }) => {
  const styles = { ...defaultStyles, ...customStyles };

  return (
    <View style={[defaultStyles.card, styles.card, isActive && defaultStyles.activeCard]}>
      <Image source={character.currentImages.head} style={[defaultStyles.characterImage, styles.characterImage]} />
      <Text style={[defaultStyles.level, styles.level]}>{character.level}</Text>
      <Text style={[defaultStyles.name, styles.name]}>{character.name}</Text>
      <HealthBar currentHealth={character.currentHealth} maxHealth={character.baseStats.maxHealth} style={[defaultStyles.healthBar, styles.healthBar]} />
      <View style={[defaultStyles.typeIconContainer, styles.typeIconContainer]}>
        <Image source={getCharacterTypeIcon(character.type)} style={[defaultStyles.typeIcon, styles.typeIcon]} />
      </View>
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  card: {
    width: '95%',
    padding: 10,
    backgroundColor: '#C7CED8',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    position: 'relative',
    height: '40%'
  },
  activeCard: {
    backgroundColor: '#B8FF9A', // Green background for active card
  },
  healthBar: {
    position: 'absolute',
    width: '100%',
    top: '90%',
    left: '5%', // Center it horizontally
  },
  characterImage: {
    width: '30%',
    height: '70%',
    borderRadius: 3,
    borderWidth: 3, // Bold border
    borderColor: '#000',
  },
  level: {
    position: 'absolute',
    top: '60%',
    left: '5%',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#000',
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    top: '45%',
    left: '40%',
    position: 'absolute',
  },
  typeIconContainer: {
    width: '23%',
    height: '50%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'white',
  },
  typeIcon: {
    width: '100%',
    height: '120%',
  },
});

export default CharacterCard;
