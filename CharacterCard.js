// CharacterCard.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import HealthBar from './HealthBar';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => Math.round((size * width) / 375); // Assuming 375 is the base screen width

const CharacterCard = ({ character, getCharacterTypeIcon, customStyles = {}, isActive }) => {
  const styles = { ...defaultStyles, ...customStyles };


  return (
    <View style={[defaultStyles.card, styles.card, isActive && defaultStyles.activeCard]}>
      <View style={styles.imageContainer}>
      <Image source={character.currentImages.head} style={[defaultStyles.characterImage, styles.characterImage]} contentFit='cover'/>
      {character.level !== undefined && (
        <View style={styles.levelContainer}>
          <Text style={[defaultStyles.level, styles.level]}>{character.level}</Text>
          
        </View>
      )}
      </View>
      <StrokeText
          text={character.name}
          fontSize={responsiveFontSize(14)}
          color="#FFFFFF"
          strokeColor="#333000"
          strokeWidth={3}
          style={[defaultStyles.name, styles.name]}
          fontFamily='Nunito-Black'
          align='left'
          numberOfLines={2}
          width={130}
          />
      <HealthBar currentHealth={character.currentHealth} maxHealth={character.baseStats.maxHealth} style={[defaultStyles.healthBar, styles.healthBar]} />
      <View style={[defaultStyles.typeIconContainer, styles.typeIconContainer]}>
        <Image source={getCharacterTypeIcon(character.type)} style={[defaultStyles.typeIcon, styles.typeIcon]} contentFit='cover'/>
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
    width: '105%',
    maxWidth: 250,
    top: '95%',
    left: '5%', // Center it horizontally
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0%',
    left: '0%',
  },
  characterImage: {
    width: '33%',
    height: '75%',
    maxHeight: 80,
    maxWidth: 80,
    borderRadius: 3,
    borderWidth: 3, // Bold border
    borderColor: '#000',
    position: 'absolute',
    top: '5%',
    left: '5%',
    
  },
  levelContainer: {
    position: 'absolute',
    top: '55%',
    left: '5%',
    width: '10%',
    height: '20%',
    maxWidth: 20,
    maxHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  level: {
    fontSize: responsiveFontSize(10),
    color: '#fff',
    backgroundColor: '#000',
    borderRadius: 10,
    fontFamily: 'Nunito-Black',
  },
  name: {
    fontSize: responsiveFontSize(13),
    top: '45%',
    left: '43%',
    position: 'absolute',
  },
  typeIconContainer: {
    width: '26%',
    height: '50%',
    maxWidth: 49,
    maxHeight: 50,
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
