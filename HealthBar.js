// HealthBar.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size) => Math.round((size * width) / 375);

const HealthBar = ({ currentHealth, maxHealth, style }) => {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  // Calculate color from green to red based on health
  const red = 255 - Math.round((healthPercentage / 100) * 255);
  const green = Math.round((healthPercentage / 100) * 255);
  const color = `rgb(${red}, ${green}, 0)`;

  const healthText = `${currentHealth}/${maxHealth}`;


  return (
    <View style={[styles.mainContainer, style]}>
    <View style={[styles.healthIcon, {backgroundColor: color}]}>
        <StrokeText
            text="+"
            fontSize={responsiveFontSize(25)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={2}
            style={styles.healthIconText}
            fontFamily='Nunito-Black'
            align='center'
            numberOfLines={1}
            width={100}
            />
      </View>
    <View style={[styles.container]}> 
      <View style={[styles.healthBar, { width: `${healthPercentage}%`, backgroundColor: color }]}/>   
    </View>
    <View style={styles.healthTextContainer}>
    <StrokeText
          text={healthText}
          fontSize={responsiveFontSize(9)}
          color="#FFFFFF"
          strokeColor="#333000"
          strokeWidth={2}
          style={[styles.healthText]}
          fontFamily='Nunito-Black'
          align='center'
          numberOfLines={1}
          />
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
  healthIcon: {
    position: 'absolute',
    height: '130%',
    width: '20%',
    minWidth:20,
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
  healthIconText: {
    zIndex: 1,
    fontFamily: 'Nunito-Black',
    top: '-6%'
  },
});

export default HealthBar;
