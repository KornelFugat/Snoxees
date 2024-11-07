import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import SkillsUI from './SkillsUI';
import TeamUI from './TeamUI';
import ItemsUI from './ItemsUI';
import { Character, Skill } from 'types';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';

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
    return text.length > 30 ? responsiveFontSize(10) : responsiveFontSize(12);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.tabs}>
          {['skills', 'items', 'team'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabOuter, activeTab === tab && styles.activeTabOuter]}
              onPress={() => setActiveTab(tab)}
            >
              <View style={styles.tabInner}>
              <StrokeText
                text={tab.charAt(0).toUpperCase() + tab.slice(1)}
                fontSize={responsiveFontSize(12)}
                color='#ffffff'
                strokeColor="#000000" // Adjust stroke color as needed
                strokeWidth={3}
                fontFamily="Nunito-Black" // Adjust font family as needed
                align="center"
                numberOfLines={1}
                width={width * 0.09} // Adjust width as needed
              />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.announcementContainer}>
          <View style={styles.announcementOuter}>
            <View style={styles.announcementInner}>
            <StrokeText
                text={announcement}
                fontSize={responsiveFontSize(12)}
                color='#ffffff'
                strokeColor="#000000" // Adjust stroke color as needed
                strokeWidth={3}
                fontFamily="Nunito-Black" // Adjust font family as needed
                align="center"
                numberOfLines={1}
                width={width*0.5} // Adjust width as needed
              />
            </View>
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
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
    paddingVertical: 0,
    left: '2%',
    width: '100%',
    height: '12%',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '45%',
  },
  tabOuter: {
    width: '31%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 3,
    backgroundColor: '#A9B2BC',
    padding: 3,
  },
  activeTabOuter: {
    borderBottomWidth: 0,
  },
  tabInner: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#A9B2BC',
    borderRadius: 4,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
  announcementContainer: {
    width: '54%',
  },
  announcementOuter: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    marginRight: 5,
    backgroundColor: '#ccc',
    padding: 2,
    justifyContent: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  announcementInner: {
    backgroundColor: '#333',
    borderWidth: 3,
    borderColor: '#A9B2BC',
    borderRadius: 4,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  announcementText: {
    color: 'white',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
    fontSize: responsiveFontSize(5),
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
