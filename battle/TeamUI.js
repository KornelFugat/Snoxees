// TeamUI.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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

  const customCardStyles = {
    card: {
      height: '90%',
      width: '100%',
      margin: 0,
    },
    typeIconContainer: {
      width: '19%',
      height:'40%',
    },
    name: {
      fontSize: 20,
      top: '50%',
    }
    // Add other style overrides here as needed
  };

  const renderTeamSlots = () => {
    let slots = [];
    for (let i = 0; i < 4; i++) {
      if (team[i]) {
        slots.push(
          <TouchableOpacity
            key={`team-slot-${i}-${team[i].id}`}
            style={styles.characterContainer}
            onPress={() => onCharacterSwitch(i)}
          >
            <CharacterCard
              character={team[i]}
              getCharacterTypeIcon={getCharacterTypeIcon}
              customStyles={customCardStyles}
              isActive={i === currentPlayerIndex}
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
    <View style={styles.container}>
      {renderTeamSlots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 10,
  },
  characterContainer: {
    width: '50%',
    height: '50%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlot: {
    width: '50%',
    height: '50%',
    padding: 5,

  },
});

export default TeamUI;
