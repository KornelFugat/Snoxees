import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import HealthBar from './HealthBar';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import { LinearGradient } from 'expo-linear-gradient';
import { Character } from './types';
import { BASE_URL } from 'api/accountApi';

const { width } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375); // Assuming 375 is the base screen width

interface CharacterCardProps {
  character: Character;
  getCharacterTypeIcon: (type: string) => any;
  customStyles?: Record<string, any>;
  isActive?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, getCharacterTypeIcon, customStyles = {}, isActive = false }) => {
  const styles = { ...defaultStyles, ...customStyles };


  return (
    <LinearGradient style={[defaultStyles.card, styles.card, isActive && defaultStyles.activeCard]} colors={['#ffffff', '#9DA3AB']}>
      <View style={styles.imageContainer}>
        <Image 
          source={{uri: `${BASE_URL}${character.currentImages.head}`}} 
          style={[defaultStyles.characterImage, styles.characterImage]} 
          contentFit='cover' />
        {character.level !== undefined && (
          <View style={styles.levelContainer}>
            <Text style={[defaultStyles.level, styles.level]}>{character.level}</Text>
          </View>
        )}
      </View>
      <View style={[defaultStyles.nameContainer, styles.nameContainer]}>
        <StrokeText
          text={character.name}
          fontSize={responsiveFontSize(13)}
          color="#FFFFFF"
          strokeColor="#333000"
          strokeWidth={3}
          fontFamily='Nunito-Black'
          align='left'
          numberOfLines={2}
          width={130}
        />
      </View>
      <HealthBar currentHealth={character.currentHealth} maxHealth={character.baseStats.maxHealth} style={[defaultStyles.healthBar, styles.healthBar]} />
      <View style={[defaultStyles.typeIconContainer, styles.typeIconContainer]}>
        <Image source={getCharacterTypeIcon(character.type)} style={[defaultStyles.typeIcon, styles.typeIcon]} contentFit='cover' />
      </View>
    </LinearGradient>
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
    height: '40%',
  },
  activeCard: {
    backgroundColor: '#B8FF9A', // Green background for active card
  },
  healthBar: {
    position: 'absolute',
    width: '94%',
    maxWidth: 190,
    top: '90%',
  },
  imageContainer: {
    width: '94%',
    height: '100%',
    position: 'absolute',
    top: '0%',
    left: '0%',
  },
  characterImage: {
    width: '35%',
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
  nameContainer: {
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
