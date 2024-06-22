import React from 'react';
import { View, StyleSheet, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface ExperienceBarProps {
  experience: number;
  maxExperience: number;
  currentExperience: number;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  textFont?: number;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({ experience, maxExperience, currentExperience, style, textStyle, textFont }) => {
  const experiencePercentage = (currentExperience / maxExperience) * 100;
  const additionalExperiencePercentage = experience ? ((currentExperience - experience) / maxExperience) * 100 : 0;

  const currentExperienceColors = ['#448EE7', '#ADD8E6']; // Light blue
  const additionalExperienceColors = ['#448EE7', '#0000FF']; // Blue
  const readyToTrainColors = ['#FFC900', '#FFE585']; // Yellow

  const experienceText = `${currentExperience}/${maxExperience}`;

  return (
    <View style={[styles.mainContainer, style]}>
      <LinearGradient style={styles.experienceIcon} colors={['#0000FF', '#00008B']}>
        <View style={styles.experienceIconTextContainer}>
          <StrokeText
            text="XP"
            fontSize={responsiveFontSize(7)}
            color="#FFFFFF"
            strokeColor="#00008B"
            strokeWidth={3}
            fontFamily="Nunito-Black"
            align="center"
            numberOfLines={1}
            width={100}
          />
        </View>
      </LinearGradient>
      <View style={styles.container}>
        {currentExperience === maxExperience ? (
          <LinearGradient style={styles.readyToTrainBar} colors={readyToTrainColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        ) : (
          <>
          {additionalExperiencePercentage ===0 && (
            <LinearGradient style={[styles.experienceBar, { width: `${experiencePercentage}%` }]} colors={additionalExperienceColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}/>
          )}  
          {additionalExperiencePercentage !==0 && (
            <>
            <LinearGradient style={[styles.experienceBar, { width: `${experiencePercentage}%` }]} colors={currentExperienceColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}/>
            <LinearGradient style={[styles.additionalExperienceBar, { width: `${additionalExperiencePercentage}%` }]} colors={additionalExperienceColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            </>
          )} 
            
          </>
        )}
      </View>

      {currentExperience === maxExperience ? (
        <View style={[styles.trainTextContainer, textStyle]}>
          <View style={styles.readyToTrainTextWrapper}>
            <StrokeText
              text="READY TO TRAIN"
              fontSize={textFont}
              color="#ffffff"
              strokeColor="#333000"
              strokeWidth={3}
              fontFamily="Nunito-Black"
              align="center"
              numberOfLines={1}
            />
          </View>
        </View>
      ) : (
        <View style={styles.experienceTextContainer}>
          <View style={styles.experienceTextWrapper}>
            <StrokeText
              text={experienceText}
              fontSize={responsiveFontSize(9)}
              color="#FFFFFF"
              strokeColor="#333000"
              strokeWidth={2}
              fontFamily="Nunito-Black"
              align="center"
              numberOfLines={1}
            />
          </View>
        </View>
      )}
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
  experienceBar: {
    height: '100%',
    borderRadius: 7,
    position: 'absolute',
  },
  additionalExperienceBar: {
    height: '100%',
    borderRadius: 7,
  },
  readyToTrainBar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
  },
  experienceTextContainer: {
    position: 'absolute',
    top: '50%',
    minWidth: '45%',
    zIndex: 1,
    left: '70%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  trainTextContainer: {
    position: 'absolute',
    top: '50%',
    minWidth: '45%',
    zIndex: 1,
    left: '45%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  experienceIcon: {
    position: 'absolute',
    height: '100%',
    width: '20%',
    minWidth: 20,
    minHeight: 20,
    maxHeight: 30,
    maxWidth: 25,
    zIndex: 1,
    left: '5%',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceIconTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceIconText: {
    zIndex: 1,
  },
  readyToTrainTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExperienceBar;
