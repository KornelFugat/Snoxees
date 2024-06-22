import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { useMainStore } from '../stores/useMainStore'; // Ensure this path is correct
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import { LinearGradient } from 'expo-linear-gradient';
import AfterBattleCard from './AfterBattleCard';
import AfterBattleEnemyCard from './AfterBattleEnemyCard';
import { getGradientColors, getContainerColors } from './gradients';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { BattleResult } from 'types';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface AfterBattleScreenProps {
  onRestartGame: () => void;
}

const AfterBattleScreen: React.FC<AfterBattleScreenProps> = ({ onRestartGame }) => {
  const translateY = useSharedValue(-height / 10);
  const scale = useSharedValue(4);
  const translateRewardsY = useSharedValue(height);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 1000 });
    setTimeout(() => {
      translateY.value = withTiming(0, { duration: 1000 });
    }, 1000);
    setTimeout(() => {
      translateRewardsY.value = withTiming(0, { duration: 1000 });
    }, 2000);
  }, [scale, translateY, translateRewardsY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const animatedRewards = useAnimatedStyle(() => ({
    transform: [{ translateY: translateRewardsY.value }],
  }));

  const { team, enemy, battleExperience, battleResult } = useMainStore(state => ({
    team: state.team,
    enemy: state.enemy,
    battleExperience: state.battleExperience,
    battleResult: state.battleResult,
  }));

  useEffect(() => {
    console.log("druzyna2", team);
    console.log("enemy", enemy);
    console.log("hp", team[0].baseStats.maxHealth);
    console.log("battleExperience", battleExperience);
  }, [team, enemy, battleExperience]);

  const getResultText = (result: BattleResult): string => {
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

  const handleContinue = () => {
    onRestartGame();
    console.log('handleContinue');
  };

  useEffect(() => {
    console.log(battleResult);
  }, [battleResult]);

  return (
    <LinearGradient style={styles.container} colors={['#C7CED8', '#949BA4']} >
      <View style={styles.header}>
        <StrokeText
          text="BATTLE RESULTS"
          fontSize={responsiveFontSize(15)}
          color="#FFFFFF"
          strokeColor="#333000"
          strokeWidth={4}
          fontFamily='Nunito-Black'
          align='center'
          numberOfLines={1}
        />
      </View>
      <LinearGradient style={styles.contentContainer} colors={getContainerColors(battleResult)}>
        <Animated.View style={[styles.resultContainer, animatedStyle]}>
          <LinearGradient style={styles.resultContainer} colors={getGradientColors(battleResult)}>
            <View style={styles.resultText}>
              <StrokeText
                text={getResultText(battleResult)}
                fontSize={responsiveFontSize(20)}
                color="#FFFFFF"
                strokeColor="#333333"
                strokeWidth={5}
                fontFamily="Nunito-Black"
                align="center"
                numberOfLines={1}
              />
            </View>
          </LinearGradient>
        </Animated.View>
        <View style={styles.teamContainer}>
          {team.map((member, index) => (
            <AfterBattleCard key={index}index={index} member={member} battleExperience={battleExperience} />
          ))}
        </View>
        <View style={styles.enemyContainer}>
          <AfterBattleEnemyCard enemy={enemy} battleResult={battleResult} />
        </View>
        <Animated.View style={[styles.rewardsContainer, animatedRewards]}>
          <View style={styles.resultText}>
            <StrokeText
              text={'REWARDS'}
              fontSize={responsiveFontSize(15)}
              color="#FFFFFF"
              strokeColor="#333333"
              strokeWidth={5}
              fontFamily="Nunito-Black"
              align="right"
              numberOfLines={1}
            />
          </View>
          <View style={styles.rewards} />
        </Animated.View>
      </LinearGradient>
      <View style={styles.buttonContainer}>
        <TouchableHighlight style={styles.continueButton} onPress={handleContinue} >
          <LinearGradient
            colors={['#333', '#949BA4']}
            style={styles.gradientButton}
          >
            <StrokeText
              text={'CONTINUE'}
              fontSize={responsiveFontSize(20)}
              color="#FFFFFF"
              strokeColor="#333333"
              strokeWidth={5}
              fontFamily="Nunito-Black"
              align="center"
              numberOfLines={1}
            />
          </LinearGradient>
        </TouchableHighlight>
      </View>
      {/* <Text style={styles.restartButton} onPress={onRestartGame}>Restart Battle</Text> */}
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
    left: '34%',
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
  enemyContainer: {
    flex: 1,
  },
  rewardsContainer: {
    position: 'absolute',
    top: '85%',
    left: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  continueButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: '40%',
    top: '5%',
    borderRadius: 5,
    backgroundColor: 'red',
  },
  gradientButton: {
    borderRadius: 5,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    alignItems: 'center',
  },
  rewards: {},
});

export default AfterBattleScreen;
