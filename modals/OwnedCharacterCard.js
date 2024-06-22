import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import HealthBar from "../HealthBar";
import ExperienceBar from "../ExperienceBar";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => Math.round((size * width) / 375);

const OwnedCharacterCard = ({ character, getCharacterTypeIcon, getCharacterTypeColor }) => {



      return(
        <Animated.View style={styles.container}>
        <LinearGradient style={styles.teamMemberContainer} colors={['#FFFFFF', 'gray']}>
                <Text style={styles.characterName}>{character.name}</Text>
              <Image source={character.currentImages.head} style={[styles.characterImage, { tintColor: 'gray' }]} />
              <Image source={character.currentImages.head} style={[styles.characterImage, character.currentHealth === 0 && { opacity: 0.2 }]} />
              
              {character.level !== undefined && (
                <View style={styles.levelContainer}>
                  <Text style={styles.level}>{character.level}</Text>
                </View>
              )}
              <View style={styles.cardContentContainer}>
              <ExperienceBar currentExperience={character.experience} maxExperience={character.experienceForNextLevel} style={styles.experienceBar} textStyle={styles.experienceText} textFont={responsiveFontSize(5)}/>
                <HealthBar currentHealth={character.currentHealth} maxHealth={character.baseStats.maxHealth} style={styles.healthBar} textStyle={styles.healthText} />
              </View>
        </LinearGradient>
        </Animated.View>

            )
};

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
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
      height: '63%',
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
      top: '80%',
      width: '10%',
      height: '22%',
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
        left: '35%'
    },
    healthBar: {
      width: '100%',
      maxWidth: 120,
      left: '-5%',
      height: '20%',
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
  });

export default OwnedCharacterCard