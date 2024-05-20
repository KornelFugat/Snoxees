// CharacterCard.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
    width: '65%',
    top: '70%',
    left: '40%', // Center it horizontally
  },
  characterImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  level: {
    position: 'absolute',
    top: 50,
    left: 60,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#000',
    borderRadius:10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    top: '15%',
    left: '40%',
    position: 'absolute',
  },
  typeIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
  },
  typeIcon: {
    width: 50,
    height: 50,
  },
});

export default CharacterCard;
