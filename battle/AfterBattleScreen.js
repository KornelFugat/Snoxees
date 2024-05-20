import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useMainStore } from '../stores/useMainStore'; // Ensure this path is correct
import ExperienceBar from '../ExperienceBar';

const AfterBattleScreen = ({ onRestartGame }) => {
  const { team } = useMainStore();

  useEffect(() => {
    console.log("druzyna2", team);
  }, [team]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Battle Results</Text>
      {team.map((member, index) => (
        <View key={index} style={styles.teamMemberContainer}>
          <Image source={member.currentImages.head } style={styles.characterImage} />
          <View style={styles.experienceContainer}>
            <Text style={styles.characterName}>{member.name}</Text>
            <ExperienceBar currentExperience={member.experience} maximumExperience={member.experienceForNextLevel}/>
            <Text style={styles.experienceText}>Exp: {member.experience} (+15)</Text> 
          </View>
        </View>
      ))}
      <Text style={styles.restartButton} onPress={onRestartGame}>Restart Battle</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  teamMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  characterImage: {
    width: 70,
    height: 70,
    marginRight: 20,
    borderRadius: 35, // Circular images
  },
  experienceContainer: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  experienceText: {
    fontSize: 16,
    color: '#666',
  },
  restartButton: {
    fontSize: 18,
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default AfterBattleScreen;