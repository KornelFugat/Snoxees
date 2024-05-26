// BattleUI.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import SkillsUI from './SkillsUI';
import TeamUI from './TeamUI';
import ItemsUI from './ItemsUI';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => Math.round((size * width) / 375);

const BattleUI = ({ onAttackPress, skills, team, currentPlayerIndex, onCharacterSwitch, disabled, captureChance, handleCatchEnemy, announcement  }) => {
  const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'items', or 'team'

  const getAnnouncementFontSize = (text) => {
    return text.length > 20 ? responsiveFontSize(8) : responsiveFontSize(10);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
      {['skills', 'items', 'team'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabOuter, activeTab === tab && styles.activeTabOuter]}
            onPress={() => setActiveTab(tab)}
          >
            <View style={styles.tabInner}>
              <Text style={styles.tabText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.announcementOuter}>
          <View style={styles.announcementInner}>
          <Text style={[styles.announcementText, { fontSize: getAnnouncementFontSize(announcement) }]}>{announcement}</Text>
          </View>
        </View>
      </View>
      <View style={styles.uiContainer}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 4,
    width: '100%',
  },
  uiContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#A9B2BC', // Medium grey background for the UI container
    padding: 15,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingVertical: 0,
    left: 5,
    
  },
  tabOuter: {
    minWidth: '15%',
    borderWidth: 1,
    borderColor: 'black', // Thin black border
    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 5,
    backgroundColor: '#A9B2BC', // Outer border color
    padding: 2,
  },
  activeTabOuter: {
    borderBottomWidth: 0, // Remove bottom border when active
  },
  tabInner: {
    backgroundColor: '#333', // Darker inner color
    borderWidth: 3,
    borderColor: '#A9B2BC', // Gray bold border
    borderRadius: 4,
    padding: 5,
  },
  tabText: {
    fontSize: responsiveFontSize(14),
    color: 'white',
    textShadowColor:'#000000',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:3,
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
  },

  announcementOuter: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black', // Thin black border
    borderRadius: 6,
    marginLeft: 20,
    marginRight: 5,
    backgroundColor: '#ccc', // Outer border color
    padding: 2,
    justifyContent: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    
  },
  announcementInner: {
    backgroundColor: '#333', // Darker inner color
    borderWidth: 2,
    borderColor: '#A9B2BC', // Gray bold border
    borderRadius: 4,
    padding: 10
    
  },
  announcementText: {
    color: 'white',
    textShadowColor:'#000000',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:3,
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
    maxHeight: 50,
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
  announcementContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end', // Align to the right
    paddingHorizontal: 10, // Add some padding
  },

});

export default BattleUI;
