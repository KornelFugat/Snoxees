import React from "react";
import { View, StyleSheet } from 'react-native';

const ExperienceBar = ({ currentExperience, maximumExperience }) => {
    const width = (currentExperience / maximumExperience) * 100; // calculate width as a percentage
  
    return (
      <View style={styles.experienceBarContainer}>
        <View style={[styles.experienceProgressBar, { width: `${width}%` }]} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    experienceBarContainer: {
      height: 20,
      width: '100%',
      backgroundColor: '#ccc',
      borderRadius: 10,
      overflow: 'hidden',
    },
    experienceProgressBar: {
      height: '100%',
      backgroundColor: '#00bfff', // Light blue color
    },
    // Other styles...
  });

  export default ExperienceBar;
  