// BattleUI.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import SkillsUI from './SkillsUI';
import TeamUI from './TeamUI';
import ItemsUI from './ItemsUI';

const BattleUI = ({ onAttackPress, skills, team, currentPlayerIndex, onCharacterSwitch, disabled, captureChance, handleCatchEnemy }) => {
  const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'items', or 'team'

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'skills' && styles.activeTab]}
          onPress={() => setActiveTab('skills')}
        >
          <Text style={styles.tabText}>Skills</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}
        >
          <Text style={styles.tabText}>Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'team' && styles.activeTab]}
          onPress={() => setActiveTab('team')}
        >
          <Text style={styles.tabText}>Team</Text>
        </TouchableOpacity>
      </View>
      <ImageBackground
        source={require('../assets/light-gradient.png')}
        style={styles.uiContainer}
      >
        {activeTab === 'skills' && (
          <SkillsUI
            onAttackPress={onAttackPress}
            skills={skills}
            disabled={disabled}
          />
        )}
        {activeTab === 'items' && <ItemsUI />}
        {activeTab === 'team' && (
          <TeamUI
            team={team}
            currentPlayerIndex={currentPlayerIndex}
            onCharacterSwitch={onCharacterSwitch}
          />
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 4,
    width: '100%',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  tab: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    backgroundColor: '#cccccc',
    borderRadius: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: 16,
  },
  uiContainer: {
    flex: 1,
    width: '100%',
  },
  announcement: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  announcementText: {
    color: 'white',
  },
  catchButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    backgroundColor: '#cccccc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default BattleUI;
