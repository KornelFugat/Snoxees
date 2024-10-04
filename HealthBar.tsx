import React from 'react';
import { View, StyleSheet, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';

const { width } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface HealthBarProps {
  currentHealth: number;
  maxHealth: number;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

const HealthBar: React.FC<HealthBarProps> = ({ currentHealth, maxHealth, style, textStyle }) => {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  // Calculate color from green to red based on health
  const red = 255 - Math.round((healthPercentage / 100) * 255);
  const green = Math.round((healthPercentage / 100) * 255);
  const color = `rgb(${red}, ${green}, 0)`;

  const healthText = `${currentHealth}/${maxHealth}`;

  return (
    <View style={[styles.mainContainer, style]}>
      <View style={[styles.healthIcon, { backgroundColor: color }]}>
        <View style={styles.healthIconTextContainer}>
          <StrokeText
            text="+"
            fontSize={responsiveFontSize(20)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={3}
            fontFamily='Nunito-Black'
            align='center'
            numberOfLines={1}
            width={100}
          />
        </View>
      </View>
      <View style={[styles.container]}>
        <View style={[styles.healthBar, { width: `${healthPercentage}%`, backgroundColor: color }]} />
      </View>
      <View style={[styles.healthTextContainer, textStyle]}>
        <View style={styles.healthTextWrapper}>
          <StrokeText
            text={healthText}
            fontSize={responsiveFontSize(9)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={2}
            fontFamily='Nunito-Black'
            align='center'
            numberOfLines={1}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '30%',
    top: '5%',
    zIndex: 1,
    justifyContent: 'center',
  },
  container: {
    height: '75%',
    width: '100%',
    maxWidth: 250,
    backgroundColor: '#ddd',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#333',
    left: '15%',
  },
  healthBar: {
    height: '100%',
    width: '100%',
    borderRadius: 7,
  },
  healthTextContainer: {
    position: 'absolute',
    top: '50%',
    minWidth: '45%',
    zIndex: 1,
    left: '70%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  healthTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthIcon: {
    position: 'absolute',
    height: '100%',
    width: '15%',
    minWidth: 20,
    minHeight: 20,
    maxHeight: 30,
    maxWidth: 30,
    zIndex: 1,
    left: '5%',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthIconTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: '-5%',
  },
  healthIconText: {
    zIndex: 1,
    fontFamily: 'Nunito-Black',
    top: '-6%',
  },
});

export default HealthBar;
