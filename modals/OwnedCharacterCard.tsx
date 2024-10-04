import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated from 'react-native-reanimated';
import HealthBar from "../HealthBar";
import ExperienceBar from "../ExperienceBar";

import { Character } from '../types'; // Ensure the types are correctly imported
import { BASE_URL } from "api/accountApi";

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);
const responsiveHeight = (size: number) => Math.round((size * height) / 667);

interface OwnedCharacterCardProps {
  character: Character;
  getCharacterTypeIcon: (type: string) => any;
  getCharacterTypeColor: (type: string) => string;
  isInTeam: boolean;
  isSelected: boolean;
}

const OwnedCharacterCard: React.FC<OwnedCharacterCardProps> = ({
  character,
  getCharacterTypeIcon,
  getCharacterTypeColor,
  isInTeam,
  isSelected
}) => {

  return (
    <Animated.View style={[styles.container, isSelected && styles.selectedContainer]}>
      <LinearGradient style={styles.teamMemberContainer} colors={['#FFFFFF', getCharacterTypeColor(character.type)]} start={{ x: 0.5, y: 0.5 }}>
        {isInTeam && (
          <View style={styles.starContainer}>
            <Image source={require('../assets/star.png')} style={styles.starIcon} />
          </View>
        )}
        <Text style={styles.characterName}>{character.name}</Text>
        <Image
          source={{ uri: `${BASE_URL}${character.currentImages.head}` }}
          style={[styles.characterImage, { tintColor: 'gray' }]}
        />
        <Image
          source={{ uri: `${BASE_URL}${character.currentImages.head}` }}
          style={[styles.characterImage, character.currentHealth === 0 && { opacity: 0.2 }]}
        />
        {character.level !== undefined && (
          <View style={styles.levelContainer}>
            <Text style={styles.level}>{character.level}</Text>
          </View>
        )}
        <View style={styles.cardContentContainer}>
          <ExperienceBar
            currentExperience={character.experience}
            maxExperience={character.experienceForNextLevel}
            style={styles.experienceBar}
            textStyle={styles.experienceText}
            textFont={responsiveFontSize(5)}
          />
          <HealthBar
            currentHealth={character.currentHealth}
            maxHealth={character.baseStats.maxHealth}
            style={styles.healthBar}
            textStyle={styles.healthText}
          />
        </View>
      </LinearGradient>
      {isSelected && <View style={styles.overlay} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  selectedContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'orange',
  },
  teamMemberContainer: {
    height: '100%',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
  },
  characterImage: {
    position: 'absolute',
    left: '7%',
    top: '39%',
    width: '33%',
    height: responsiveHeight(27),
    maxWidth: responsiveFontSize(26),
    borderRadius: 3,
    borderWidth: 1, // Bold border
    borderColor: '#000',
  },
  starContainer: {
    position: 'absolute',
    top: '-5%',
    left: '-5%',
    height: '50%',
    width: '40%',
    maxWidth: 40,
    maxHeight: 40,
    borderRadius: 15,
    padding: 5,
  },
  starIcon: {
    width: '100%',
    height: '100%',
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
    top: '73%',
    width: '10%',
    height: responsiveHeight(8),
    maxWidth: 20,
    maxHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  level: {
    fontSize: responsiveFontSize(7),
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
    top: '35%'
  },
  characterName: {
    fontSize: responsiveFontSize(10),
    fontFamily: 'Nunito-Black',
    position: 'absolute',
    textAlign: 'center',
    left: '15%',
    right: '10%',
    top: '5%',
  },
  experienceBar: {
    width: '100%',
    maxWidth: 80,
    left: '-6%',
    height: '25%',
    marginBottom: '15%',
  },
  experienceText: {
    left: '30%'
  },
  healthBar: {
    width: '100%',
    maxWidth: 80,
    left: '-6%',
    height: '25%',
  },
  healthText: {
    position: 'absolute',
    top: '50%',
    minWidth: '65%',
    zIndex: 1,
    left: '50%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 5
  },
});

export default OwnedCharacterCard;
