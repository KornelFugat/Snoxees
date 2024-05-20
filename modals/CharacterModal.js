import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Button } from 'react-native';
import { useMainStore } from '../stores/useMainStore';  // Ensure the path is correct
import ExperienceBar from '../ExperienceBar';

const CharacterModal = ({ isVisible, onClose }) => {
  const { ownedCharacters, levelUpCharacter } = useMainStore(state => ({
    ownedCharacters: state.ownedCharacters,
    levelUpCharacter: state.levelUpCharacter
  }));
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const selectedMember = ownedCharacters.find(member => member.id === selectedMemberId) || null;

  const handleLevelUp = () => {
    if (selectedMember && selectedMember.experience >= selectedMember.experienceForNextLevel) {
      levelUpCharacter(selectedMember.id);
    }
  };

  const handleEvolve = () => {
    if (selectedMember && selectedMember.level === 10 || selectedMember.level === 20) {
        levelUpCharacter(selectedMember.id); // Assuming this handles the evolution
    }
};

  useEffect(() => {
    if (!selectedMember && ownedCharacters.length > 0) {
      setSelectedMemberId(ownedCharacters[0].id); // Reset to the first character if the previously selected is no longer available
    }
  }, [ownedCharacters]);


  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{selectedMember ? selectedMember.name : 'No Character Selected'}</Text>
        <Image source={selectedMember ? selectedMember.currentImages.full : null} style={styles.fullImage} />
        <Text>{selectedMember ? selectedMember.level : null}</Text>
        <ExperienceBar 
          currentExperience={selectedMember ? selectedMember.experience : 0}
          maximumExperience={selectedMember ? selectedMember.experienceForNextLevel : 1}
        />
        {selectedMember && selectedMember.experience >= selectedMember.experienceForNextLevel && (
          <Button 
          title="Level Up" 
          onPress={handleLevelUp} 
          disabled={selectedMember ? selectedMember.experience < selectedMember.experienceForNextLevel || selectedMember.level >= 30 : true} />
        )}
        {selectedMember && (selectedMember.level === 10 || selectedMember.level === 20) && selectedMember.experience >= selectedMember.experienceForNextLevel && (
          <Button
              title="Evolve"
              onPress={handleEvolve}
              disabled={selectedMember.experience < selectedMember.experienceForNextLevel}
          />
          )}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Text style={styles.stat}>Health:{selectedMember ? `${selectedMember.currentHealth} / ${selectedMember.baseStats.maxHealth}` : 'N/A'}</Text>
            <Text style={styles.stat}>Speed: {selectedMember ? selectedMember.baseStats.speed : 'N/A'}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.stat}>Normal Damage: {selectedMember ? selectedMember.baseStats.normalDamage : 'N/A'}</Text>
            <Text style={styles.stat}>Elemental Damage: {selectedMember ? selectedMember.baseStats.elementalDamage : 'N/A'}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.stat}>Normal Defence: {selectedMember ? selectedMember.baseStats.normalDefence : 'N/A'}</Text>
            <Text style={styles.stat}>Elemental Defence: {selectedMember ? selectedMember.baseStats.elementalDefence : 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.charactersGrid}>
          {ownedCharacters.map((member, index) => (
            <TouchableOpacity key={index} style={styles.characterSlot} onPress={() => setSelectedMemberId(member.id)}>
              <Image source={member.currentImages.portrait} style={styles.portrait} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fullImage: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  experience: {
    fontSize: 18,
    marginBottom: 10,
  },
  statsContainer: {
    width: '100%',
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stat: {
    flex: 1,
    fontSize: 16,
  },
  charactersGrid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  characterSlot: {
    width: 70,
    height: 70,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portrait: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeButton: {
    backgroundColor: '#1F1F1F',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6C541E',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CharacterModal;
