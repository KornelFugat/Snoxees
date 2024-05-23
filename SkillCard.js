// SkillCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

const SkillCard = ({ skill, attack, iconMap, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.card, disabled && styles.disabledCard]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        <Image source={iconMap[attack.type]} style={styles.skillIcon} />
      </View>
      <Text style={styles.skillName}>{skill.name.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    height: '35%',
    margin: '1%',
    backgroundColor: '#C7CED8',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // Ensures icon and text are in a row
    padding: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '150%',
    right: '35%',
    borderRadius: 50,
    backgroundColor: '#333',
    padding: 10,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    maxHeight: 103,
    maxWidth: 105,
  },
  disabledCard: {
    opacity: 0.5,
  },
  skillIcon: {
    width: '130%',
    height: '130%',
    maxHeight: 100,
    maxWidth: 100,
    contentFit: 'cover',
    borderRadius: 18, // Circular border
  },
  skillName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    flex: 1, // Ensures the text takes the remaining space
  },
});

export default SkillCard;
