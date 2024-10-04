import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenType } from './types'; // Ensure this path is correct
import { Image } from 'expo-image';

interface BottomNavProps {
  onSelect: (screen: ScreenType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onSelect }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onSelect('home')} style={styles.navItem}>
        <Image source={require('./assets/world-icon.png')} style={styles.worldIcon} contentFit='cover'/>
        <Text style={styles.navText}>WORLD</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelect('town')} style={styles.navItem}>
        <Image source={require('./assets/town-icon.png')} style={styles.townIcon} contentFit='cover'/>
        <Text style={styles.navText}>TOWN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelect('characters')} style={styles.navItem}>
        <Image source={require('./assets/characters-icon.png')} style={styles.charactersIcon} contentFit='cover'/>
        <Text style={styles.navText}>SNOXEES</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelect('team')} style={styles.navItem}>
        <Image source={require('./assets/team-icon.png')} style={styles.teamIcon} contentFit='cover'/>
        <Text style={styles.navText}>TEAM</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // semi-transparent background
  },
  navItem: {
    alignItems: 'center',
    height: '100%',
    marginHorizontal: 20,
  },
  worldIcon: {
    top: '-15%',
    width: '170%',
    height: '90%', // Icon takes 80% of the navbar height
    marginTop: 0, // Align icon to the top
  },
  townIcon: {
    top: '-15%',
    width: '170%',
    height: '90%', // Icon takes 80% of the navbar height
    marginTop: 0, // Align icon to the top
  },
  charactersIcon: {
    top: '-15%',
    width: '140%',
    height: '90%', // Icon takes 80% of the navbar height
    marginTop: 0, // Align icon to the top
  },
  teamIcon: {
    top: '-10%',
    width: '170%',
    height: '90%', // Icon takes 80% of the navbar height
    marginTop: 0, // Align icon to the top
  },
  navText: {
    top: '-20%',
    color: 'white',
    fontSize: 12,
    fontFamily: 'Nunito-Black',
  },
});

export default BottomNav;
