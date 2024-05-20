// TeamUI.js
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import CharacterCard from '../CharacterCard';

const TeamUI = ({ team, currentPlayerIndex, onCharacterSwitch }) => {
  const getCharacterTypeIcon = (type) => {
    const typeIconMap = {
      fire: require('../assets/fireskill.png'),
      grass: require('../assets/grassskill.png'),
      // Add other types as necessary
    };

    return typeIconMap[type] || null;
  };
  
  const renderTeamSlots = () => {
    let slots = [];
    for (let i = 0; i < 4; i++) {
      if (team[i]) {
        slots.push(
          <TouchableOpacity
            key={`team-slot-${i}-${team[i].id}`}
            style={[
              styles.characterContainer,
              i === currentPlayerIndex ? styles.activeCharacter : null
            ]}
            onPress={() => onCharacterSwitch(i)}
          >
            <CharacterCard
              character={team[i]}
              getCharacterTypeIcon={getCharacterTypeIcon}
            />
          </TouchableOpacity>
        );
      } else {
        slots.push(
          <View key={`empty-slot-${i}`} style={styles.emptySlot} />
        );
      }
    }
    return slots;
  };

  return (
    <ImageBackground
      source={require('../assets/light-gradient.png')}
      resizeMode="cover"
      style={styles.bottomPart}>
      {renderTeamSlots()}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bottomPart: {
    flex: 3,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    backgroundColor: 'transparent',
    color: '#000000',
    top: 20
  },
  characterContainer: {
    flex: 1,
    alignItems: 'center',
    minHeight: '45%',
    minWidth: '50%',
    position: 'relative',
  },
  activeCharacter: {
    top: 30,
    opacity: 0.5,
  },
  emptySlot: {
    flex: 1,
    minWidth: '50%',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: -10,
    position: 'relative',
    height: "40%",
  },
});

export default TeamUI;
