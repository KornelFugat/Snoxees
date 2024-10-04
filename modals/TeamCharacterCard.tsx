import React from 'react';
import { View, Text, StyleSheet, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import HealthBar from '../HealthBar';
import ExperienceBar from '../ExperienceBar';
import Animated from 'react-native-reanimated';
import { Character } from '../types'; // Ensure the types are correctly imported
import { BASE_URL } from 'api/accountApi';

const { width } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface TeamCharacterCardProps {
  character: Character;
  getCharacterTypeIcon: (type: string) => any;
  getCharacterTypeColor: (type: string) => string;
}


const TeamCharacterCard: React.FC<TeamCharacterCardProps> = ({ character, getCharacterTypeIcon, getCharacterTypeColor }) => {

  const battleExperience = 0

  return (
    <Animated.View style={styles.container}>
      <LinearGradient style={styles.teamMemberContainer} colors={['#FFFFFF', getCharacterTypeColor(character.type)]}>
        <Text style={styles.characterName}>{character.name}</Text>
        <Image source={{uri: `${BASE_URL}${character.currentImages.head}`}} style={[styles.characterImage, { tintColor: 'gray' }]} />
        <Image source={{uri: `${BASE_URL}${character.currentImages.head}`}} style={[styles.characterImage, character.currentHealth === 0 && { opacity: 0.2 }]} />
        {character.level !== undefined && (
          <View style={styles.levelContainer}>
            <Text style={styles.level}>{character.level}</Text>
          </View>
        )}
        <View style={styles.cardContentContainer}>
          <ExperienceBar
            experience={battleExperience}
            maxExperience={character.experienceForNextLevel}
            currentExperience={character.experience}
            style={styles.experienceBar}
            textStyle={styles.experienceText}
            textFont={responsiveFontSize(7)}
          />
          <HealthBar currentHealth={character.currentHealth} maxHealth={character.baseStats.maxHealth} style={styles.healthBar} />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '50%',
  },
  teamMemberContainer: {
    height: '100%',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  characterImage: {
    position: 'absolute',
    left: '7%',
    top: '39%',
    width: '33%',
    height: '60%',
    maxHeight: 65,
    maxWidth: 65,
    borderRadius: 3,
    borderWidth: 3, // Bold border
    borderColor: '#000',
  },
  typeIcon: {
    width: '30%',
    height: '50%',
    top: '70%',
    position: 'absolute',
  },
  levelContainer: {
    position: 'absolute',
    left: '7%',
    top: '78%',
    width: '10%',
    height: '22%',
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
  cardContentContainer: {
    position: 'absolute',
    width: '60%',
    height: '100%',
    marginHorizontal: '45%',
    top: '35%',
  },
  characterName: {
    fontSize: responsiveFontSize(12),
    fontFamily: 'Nunito-Black',
    position: 'absolute',
    textAlign: 'center',
    left: '10%',
    right: '10%',
    top: '5%',
  },
  experienceBar: {
    width: '100%',
    maxWidth: 120,
    left: '-5%',
    height: '25%',
    marginBottom: '15%',
  },
  experienceText: {
    left: '35%',
  },
  healthBar: {
    width: '100%',
    maxWidth: 120,
    left: '-5%',
    height: '20%',
  },
});

export default TeamCharacterCard;
