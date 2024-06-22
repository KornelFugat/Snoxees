import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import HealthBar from "../HealthBar";
import ExperienceBar from "../ExperienceBar";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Character } from "types";

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface AfterBattleCardProps {
  index: number;
  member: Character;
  battleExperience: number;
}

const AfterBattleCard: React.FC<AfterBattleCardProps> = ({ index, member, battleExperience }) => {
  const translateY = useSharedValue(-height);

  useEffect(() => {
    setTimeout(() => {
      translateY.value = withTiming(0, { duration: 1000 });
    }, 2000);
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient key={index} style={styles.teamMemberContainer} colors={['#FFFFFF', '#9DA3AB']}>
        <Image source={member.currentImages.head} style={[styles.characterImage, { tintColor: 'gray' }]} />
        <Image source={member.currentImages.head} style={[styles.characterImage, member.currentHealth === 0 && { opacity: 0.2 }]} />
        {member.level !== undefined && (
          <View style={styles.levelContainer}>
            <Text style={styles.level}>{member.level}</Text>
          </View>
        )}
        <View style={styles.cardContentContainer}>
          <Text style={styles.characterName}>{member.name}</Text>
          <ExperienceBar currentExperience={member.experience} maxExperience={member.experienceForNextLevel} experience={battleExperience} style={styles.experienceBar} textFont={responsiveFontSize(7)} />
          <HealthBar currentHealth={member.currentHealth} maxHealth={member.baseStats.maxHealth} style={styles.healthBar} />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '15%',
    marginBottom: 20,
  },
  teamMemberContainer: {
    height: '100%',
    top: '35%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  characterImage: {
    position: 'absolute',
    left: '7%',
    top: '10%',
    width: '33%',
    height: '80%',
    maxHeight: 70,
    maxWidth: 70,
    marginRight: 20,
    borderRadius: 3,
    borderWidth: 3, // Bold border
    borderColor: '#000',
  },
  levelContainer: {
    position: 'absolute',
    left: '7%',
    top: '63%',
    width: '10%',
    height: '25%',
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
  },
  characterName: {
    fontSize: responsiveFontSize(10),
    fontFamily: 'Nunito-Black',
  },
  experienceBar: {
    width: '100%',
    maxWidth: 135,
    left: '-5%',
    height: '25%',
    marginBottom: '15%',
  },
  healthBar: {
    width: '100%',
    maxWidth: 135,
    left: '-5%',
    height: '20%',
  },
});

export default AfterBattleCard;
