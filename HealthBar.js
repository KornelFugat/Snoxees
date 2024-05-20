// HealthBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HealthBar = ({ currentHealth, maxHealth, style }) => {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  // Calculate color from green to red based on health
  const red = 255 - Math.round((healthPercentage / 100) * 255);
  const green = Math.round((healthPercentage / 100) * 255);
  const color = `rgb(${red}, ${green}, 0)`;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.healthBar, { width: `${healthPercentage}%`, backgroundColor: color }]}>
        <Text style={styles.healthText}>{currentHealth}/{maxHealth}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: '100%',
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  healthBar: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HealthBar;
