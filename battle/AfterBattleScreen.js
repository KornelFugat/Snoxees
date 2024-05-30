import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useMainStore } from '../stores/useMainStore'; // Ensure this path is correct
import ExperienceBar from '../ExperienceBar';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import HealthBar from '../HealthBar';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => Math.round((size * width) / 375);

const AfterBattleScreen = ({ onRestartGame }) => {
const { team, enemy, battleExperience, battleResult } = useMainStore(state => ({
  team: state.team,
  enemy: state.enemy,
  battleExperience: state.battleExperience,
  battleResult: state.battleResult
}));


  useEffect(() => {
    console.log("druzyna2", team);
    console.log("enemy", enemy)
    console.log("hp", team[0].baseStats.maxHealth)
    console.log("battleExperience", battleExperience)
  }, [team, enemy]);

  const getGradientColors = (result) => {
    switch (result) {
      case 'victory':
        return ['#45C74A', '#226C25']; // Green gradient for victory
      case 'defeat':
        return ['#F44336', '#6C1F1A']; // Red gradient for defeat
      case 'captured':
        return ['#D17230', '#314C8C']; // Orange gradient for captured
      default:
        return ['#C7CED8', '#949BA4']; // Default gradient
    }
  };
  const getContainerColors = (result) => {
    switch (result) {
      case 'victory':
        return ['#45C74A', '#262626']; // Green gradient for victory
      case 'defeat':
        return ['#6C1F1A', '#262626']; // Red gradient for defeat
      case 'captured':
        return ['#D17230', '#262626']; // Orange gradient for captured
      default:
        return ['#226C25', '#262626']; // Default gradient
    }
  };

  const getResultText = (result) => {
    switch (result) {
      case 'victory':
        return 'VICTORY';
      case 'defeat':
        return 'DEFEAT';
      case 'captured':
        return 'CAPTURED';
      default:
        return '';
    }
  };

  useEffect(() => {
    console.log(battleResult);
  }, [battleResult]);
  

  return (
    <LinearGradient style={styles.container} colors={['#C7CED8', '#949BA4']} >
      <StrokeText
          text="BATTLE RESULTS"
          fontSize={responsiveFontSize(15)}
          color="#FFFFFF"
          strokeColor="#333000"
          strokeWidth={4}
          fontFamily='Nunito-Black'
          align='center'
          numberOfLines={1}
          style={styles.header}
          />
       <LinearGradient style={styles.contentContainer} colors={getContainerColors(battleResult)}>
       <LinearGradient style={styles.resultContainer} colors={getGradientColors(battleResult)}>
        <StrokeText
          text={getResultText(battleResult)}
          fontSize={responsiveFontSize(20)}
          color="#FFFFFF"
          strokeColor="#333333"
          strokeWidth={5}
          fontFamily="Nunito-Black"
          align="center"
          numberOfLines={1}
          style={styles.resultText}
        />
      </LinearGradient>
        <View style={styles.teamContainer}>
          {team.map((member, index) => (
            <LinearGradient key={index} style={styles.teamMemberContainer} colors={['#FFFFFF', '#9DA3AB']}>
              <Image source={member.currentImages.head} style={styles.characterImage} />
              {member.level !== undefined && (
                <View style={styles.levelContainer}>
                  <Text style={styles.level}>{member.level}</Text>
                </View>
              )}
              <View style={styles.cardContentContainer}>
                <Text style={styles.characterName}>{member.name}</Text>
                <ExperienceBar currentExperience={member.experience} maxExperience={member.experienceForNextLevel} experience={battleExperience} style={styles.experienceBar}/>
                <HealthBar currentHealth={member.currentHealth} maxHealth={member.baseStats.maxHealth} style={styles.healthBar} />
              </View>
            </LinearGradient>
          ))}
        </View>
        <View style={styles.enemyContainer}>
          <LinearGradient style={styles.enemyMemberContainer} colors={['#FFFFFF', '#9DA3AB']}>
            <Image source={enemy.currentImages.head} style={styles.enemyImage} />
            <View style={styles.cardContentContainerReversed}>
              <Text style={styles.characterName}>{enemy.name}</Text>
              <HealthBar currentHealth={enemy.currentHealth} maxHealth={enemy.baseStats.maxHealth} style={styles.enemyHealthBar} />
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
      <Text style={styles.restartButton} onPress={onRestartGame}>Restart Battle</Text>
  </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderColor: '#A9B2BC',
  },
  header: {
    position: 'absolute',
    top: '2%',
    left: '33%',
  },
  contentContainer: {
    top: '12%',
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    borderColor: '#333',
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  resultContainer: {
    position: 'absolute',
    top: '2%',
    left: '10%',
    right: '10%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  teamContainer: {
    flex: 1,
  },
  teamMemberContainer: {
    height: '15%',
    top: '35%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,

  },
  enemyContainer: {
    flex: 1,
  },
  enemyMemberContainer: {
    height: '15%',
    top: '35%',
    flexDirection: 'row-reverse',
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
    position: 'absolute',
    left: '7%',
    top: '10%',
    width: '33%',
    height: '80%',
    maxHeight: 70,
    maxWidth: 70,
    marginRight: 20,
    borderRadius: 3,
    borderWidth: 3, // Bold border
    borderColor: '#000',
  },
  enemyImage: {
    position: 'absolute',
    width: '33%',
    right: '7%',
    top: '10%',
    height: '80%',
    maxHeight: 70,
    maxWidth: 70,
    marginLeft: 20,
    borderRadius: 3,
    borderWidth: 3, // Bold border
    borderColor: '#000',
    transform: [{ scaleX: -1 }],
  },
  levelContainer: {
    position: 'absolute',
    left: '7%',
    top: '65%',
    width: '10%',
    height: '25%',
    maxWidth: 20,
    maxHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  level: {
    fontSize: responsiveFontSize(10),
    color: '#fff',
    backgroundColor: '#000',
    borderRadius: 10,
    fontFamily: 'Nunito-Black',
  },
  cardContentContainer: {
    position: 'absolute',
    width: '60%',
    height: '100%',
    marginHorizontal: '45%',
  },
  cardContentContainerReversed: {
    position: 'absolute',
    width: '60%',
    height: '100%',
    marginHorizontal: '45%',
    alignItems: 'flex-end',
  },
  
  characterName: {
    fontSize: responsiveFontSize(11),
    fontFamily: 'Nunito-Black',
  },
  enemyName: {
    fontSize: responsiveFontSize(10),
    fontFamily: 'Nunito-Black',
  },
  healthBar: {
    width: '100%',
    maxWidth: 135,
    left: '-5%',
    height: '20%'
  },
  enemyHealthBar: {
    width: '100%',
    maxWidth: 135,
    left: '-15%',
    height: '20%'
  },
  experienceBar: {
    width: '100%',
    maxWidth: 135,
    left: '-5%',
    height: '25%',
    marginBottom: '15%',
  },
  experienceText: {
    fontSize: responsiveFontSize(10),
    color: '#666',
  },
  restartButton: {
    flex: 1,
    fontSize: 18,
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default AfterBattleScreen;