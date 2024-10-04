import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, TouchableHighlight, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import { LinearGradient } from 'expo-linear-gradient';
import { Attack } from 'types';

const { width } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

const iconMap: { [key: string]: ImageSourcePropType } = {
  normal: require('../assets/normalskill.png'),
  fire: require('../assets/fireskill.png'),
  grass: require('../assets/grassskill.png'),
};

interface SkillCardProps {
  attack: Attack;
}

const CharacterSkillCard: React.FC<SkillCardProps> = ({ attack }) => {

  return (
    <View  style={styles.touchable}>
      <LinearGradient
        colors={['#ffffff', '#9DA3AB']}
        style={[styles.card]}
      >
            <View style={styles.iconContainer}>
              <Image source={iconMap[attack.type]} style={styles.skillIcon} contentFit='cover' />
            </View>
            <View style={styles.textContainer}>
              <StrokeText
                text={attack.name.toUpperCase()}
                fontSize={responsiveFontSize(12)}
                color="#FFFFFF"
                strokeColor="#333000"
                strokeWidth={3}
                fontFamily='Nunito-Black'
                align="center"
                numberOfLines={4}
                width={100}
              />
            </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    height: '100%',
    margin: '1%',
    borderRadius: 8,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '55%',
    height: '110%',
    right: '10%',
    borderRadius: 50,
    backgroundColor: '#FFF8E1',
    padding: 10,
    maxHeight: 100,
    maxWidth: 95,
  },
  disabledCard: {
    opacity: 0.5,
  },
  skillIcon: {
    width: '140%',
    height: '150%',
    right: '0%',
    maxHeight: 100,
    maxWidth: 100,
    borderRadius: 18,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CharacterSkillCard;
