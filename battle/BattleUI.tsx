import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import SkillsUI from './SkillsUI';
import TeamUI from './TeamUI';
import ItemsUI from './ItemsUI';
import { Character, Skill } from 'types';

const { width } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface BattleUIProps {
  onAttackPress: (attackName: string) => void;
  skills: Skill[];
  team: Character[];
  onCharacterSwitch: (index: number) => void;
  disabled: boolean;
  captureChance: number;
  handleCatchEnemy: () => void;
  announcement: string;
  currentPlayerIndex: number;
}

const BattleUI: React.FC<BattleUIProps> = ({
  onAttackPress,
  skills,
  team,
  onCharacterSwitch,
  currentPlayerIndex,
  disabled,
  captureChance,
  handleCatchEnemy,
  announcement
}) => {
  const [activeTab, setActiveTab] = useState('skills');

  

  const getAnnouncementFontSize = (text: string) => {
    return text.length > 23 ? responsiveFontSize(8) : responsiveFontSize(9);
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
            <Text style={[styles.announcementText, { fontSize: getAnnouncementFontSize(announcement) }]}>
              {announcement}
            </Text>
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
    backgroundColor: '#A9B2BC',
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
    borderColor: 'black',
    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 5,
    backgroundColor: '#A9B2BC',
    padding: 2,
  },
  activeTabOuter: {
    borderBottomWidth: 0,
  },
  tabInner: {
    backgroundColor: '#333',
    borderWidth: 3,
    borderColor: '#A9B2BC',
    borderRadius: 4,
    padding: 5,
  },
  tabText: {
    fontSize: responsiveFontSize(14),
    color: 'white',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
  },
  announcementOuter: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    marginLeft: 20,
    marginRight: 5,
    backgroundColor: '#ccc',
    padding: 2,
    justifyContent: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  announcementInner: {
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#A9B2BC',
    borderRadius: 4,
    padding: 10,
  },
  announcementText: {
    color: 'white',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
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
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
});

export default BattleUI;
