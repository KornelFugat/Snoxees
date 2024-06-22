import React from 'react';
import { View, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import CharacterCard from '../CharacterCard';
import { Character } from '../types'; // Ensure the types are correctly imported

interface TeamUIProps {
  team: Character[];
  currentPlayerIndex: number;
  onCharacterSwitch: (index: number) => void;
}

const getCharacterTypeIcon = (type: string): ImageSourcePropType | null => {
  const typeIconMap: { [key: string]: ImageSourcePropType } = {
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
    maxWidth: 53,
  },
  name: {
    top: '50%',
  },
  levelContainer: {
    position: 'absolute',
    top: '58%',
    left: '5%',
    width: '10%',
    height: '20%',
    maxWidth: 20,
    maxHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  healthBar: {
    top: '85%',
    width: '94%',
    maxWidth: 230,
  },
  // Add other style overrides here as needed
};

const TeamUI: React.FC<TeamUIProps> = ({ team, currentPlayerIndex, onCharacterSwitch }) => {
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
