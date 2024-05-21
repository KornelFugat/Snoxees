// CharacterCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import HealthBar from './HealthBar';

const CharacterCard = ({ character, getCharacterTypeIcon }) => {
  return (
    <View style={styles.card}>
      <Image source={character.currentImages.head} style={styles.characterImage} />
      <Text style={styles.level}>{character.level}</Text>
      <Text style={styles.name}>{character.name}</Text>
      <HealthBar currentHealth={character.currentHealth} maxHealth={character.baseStats.maxHealth} style={styles.healthBar} />
      <View style={styles.typeIconContainer}>
        <Image source={getCharacterTypeIcon(character.type)} style={styles.typeIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '95%',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: -10,
    position: 'relative',
    height: "40%"
  },
  healthBar: {
    position: 'absolute',
    width: '100%',
    top: '90%',
    left: '10%', // Center it horizontally
  },
  characterImage: {
    width: '30%',
    height: '70%',
    borderRadius: 8,
  },
  level: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#000',
    borderRadius:10,
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
