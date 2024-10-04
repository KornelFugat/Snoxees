import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HealthBar from '../HealthBar';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Enemy, BattleResult } from 'types';
import { BASE_URL } from 'api/accountApi';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface AfterBattleEnemyCardProps {
  enemy: Enemy | null;
  battleResult: BattleResult;
}

const AfterBattleEnemyCard: React.FC<AfterBattleEnemyCardProps> = ({ enemy, battleResult }) => {
  const translateY = useSharedValue(-height);
  const translateBookY = useSharedValue(0);
  const bookScale = useSharedValue(2);
  const bookOpacity = useSharedValue(0);
  const translateBookTextY = useSharedValue(1);
  const translateBookTextX = useSharedValue(0);
  const bookTextScale = useSharedValue(1.25);
  const bookTextOpacity = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      translateY.value = withTiming(0, { duration: 1000 });
    }, 2000);
    setTimeout(() => {
      translateBookY.value = withTiming(0, { duration: 1000 });
      bookOpacity.value = withSpring(1, { duration: 1000 });
      bookScale.value = withTiming(1, { duration: 1000 });
    }, 4000);
    setTimeout(() => {
      translateBookTextY.value = withTiming(0, { duration: 1000 });
      bookTextOpacity.value = withSpring(1, { duration: 1000 });
      bookTextScale.value = withTiming(1, { duration: 1000 });
    }, 5000);
  }, [translateY, translateBookY, bookOpacity, bookScale, translateBookTextY, bookTextOpacity, bookTextScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBook = useAnimatedStyle(() => ({
    transform: [{ translateY: translateBookY.value }, { scale: bookScale.value }],
    opacity: bookOpacity.value
  }));

  const animatedBookText = useAnimatedStyle(() => ({
    transform: [{ scale: bookTextScale.value }],
    opacity: bookTextOpacity.value
  }));

  if (!enemy) {
    return null;
  }


  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient style={styles.cardContainer} colors={['#FFFFFF', '#9DA3AB']}>
        <Image source={{uri: `${BASE_URL}${enemy.currentImages.head}`}} style={[styles.enemyImage, { tintColor: 'red' }]} />
        <Image source={{uri: `${BASE_URL}${enemy.currentImages.head}`}} style={[styles.enemyImage, enemy.currentHealth === 0 && { opacity: 0.5 }]} />
        <View style={styles.cardContentContainerReversed}>
          <Text style={styles.characterName}>{enemy.name}</Text>
          {battleResult !== 'captured' && (
            <HealthBar currentHealth={enemy.currentHealth} maxHealth={enemy.baseStats.maxHealth} style={styles.enemyHealthBar} />
          )}
          {battleResult === 'captured' && (
            <View style={styles.capturedContainer}>
              <Animated.View style={[styles.catchBookContainer, animatedBook]}>
                <Image source={require('../assets/catch-book.png')} style={styles.catchBook} contentFit="cover" />
              </Animated.View>
              <Animated.View style={[styles.catchBookTextContainer, animatedBookText]}>
                <StrokeText
                  text={'CAPTURED!'}
                  fontSize={responsiveFontSize(10)}
                  color="#FFFFFF"
                  strokeColor="#333333"
                  strokeWidth={5}
                  fontFamily="Nunito-Black"
                  align="right"
                  numberOfLines={3}
                  width={150}
                />
              </Animated.View>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '15%',
    marginBottom: 20,
  },
  cardContainer: {
    height: '100%',
    top: '35%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
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
  enemyHealthBar: {
    width: '100%',
    maxWidth: 135,
    left: '-15%',
    height: '20%',
  },
  capturedContainer: {
    left: '25%',
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catchBookContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catchBook: {
    maxHeight: 90,
    maxWidth: 100,
    width: '80%',
    height: '100%',
  },
  captureText: {},
  catchBookTextContainer: {
    position: 'absolute',
    right: '18%',
    top: '65%',
  },
});

export default AfterBattleEnemyCard;
