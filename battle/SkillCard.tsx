import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, TouchableHighlight, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import { LinearGradient } from 'expo-linear-gradient';
import { Attack } from 'types';

const { width } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

const getBorderColor = (type: string) => {
  switch (type) {
    case 'fire':
      return 'red';
    case 'normal':
      return 'grey';
    case 'grass':
      return '#90EE90';
    case 'water':
      return 'blue';
    default:
      return 'black';
  }
};

const iconMap: { [key: string]: ImageSourcePropType } = {
  normal: require('../assets/normalskill.png'),
  fire: require('../assets/fireskill.png'),
  grass: require('../assets/grassskill.png'),
};

interface SkillCardProps {
  skill: { name: string };
  attack: Attack;
  onPress: () => void;
  disabled: boolean;
  showDetails: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, attack, onPress, disabled, showDetails }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={styles.touchable}>
      <LinearGradient
        colors={['#ffffff', '#9DA3AB']}
        style={[styles.card, disabled && styles.disabledCard]}
      >
        {!showDetails ? (
          <>
            <View style={styles.iconContainer}>
              <Image source={iconMap[attack.type]} style={styles.skillIcon} contentFit='cover' />
            </View>
            <View style={styles.textContainer}>
              <StrokeText
                text={skill.name.toUpperCase()}
                fontSize={responsiveFontSize(17)}
                color="#FFFFFF"
                strokeColor="#333000"
                strokeWidth={3}
                fontFamily='Nunito-Black'
                align="center"
                numberOfLines={2}
                width={130}
              />
            </View>
          </>
        ) : (
          <View style={styles.detailsContainer}>
            <View style={[styles.powerContainer, { borderColor: getBorderColor(attack.type) }]}>
              <Text style={styles.dText}>Attack Power</Text>
              <Text style={styles.dValue}>{attack.damage}</Text>
            </View>
            <View style={[styles.accuracyContainer, { borderColor: getBorderColor(attack.type) }]}>
              <Text style={styles.dText}>Accuracy</Text>
              <Text style={styles.dValue}>{attack.accuracy * 100}%</Text>
            </View>
            <View style={[styles.descriptionContainer, { borderColor: getBorderColor(attack.type) }]}>
              <Text style={styles.description}>{attack.name.toUpperCase()}</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '47%',
    height: '35%',
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
    width: '50%',
    height: '160%',
    right: '35%',
    borderRadius: 50,
    backgroundColor: '#333',
    padding: 10,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    maxHeight: 103,
    maxWidth: 105,
  },
  disabledCard: {
    opacity: 0.5,
  },
  skillIcon: {
    width: '140%',
    height: '130%',
    maxHeight: 100,
    maxWidth: 100,
    borderRadius: 18,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    width: '110%',
    height: '130%',
    maxWidth: 250,
    maxHeight: 90,
    backgroundColor: '#C7CED8',
    borderRadius: 8,
    padding: 0,
  },
  powerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#333',
    width: '49%',
    height: '55%',
    maxHeight: 50,
    maxWidth: 150,
    borderRadius: 8,
    borderWidth: 1,
  },
  accuracyContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#333',
    width: '49%',
    height: '55%',
    maxHeight: 50,
    maxWidth: 150,
    borderRadius: 8,
    borderWidth: 1,
  },
  dText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: responsiveFontSize(7),
    fontFamily: 'Nunito-Black',
  },
  dValue: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: responsiveFontSize(10),
    top: '10%',
    fontFamily: 'Nunito-Black',
  },
  descriptionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#333',
    width: '100%',
    height: '40%',
    maxHeight: 50,
    maxWidth: 260,
    borderRadius: 8,
    borderWidth: 2,
  },
  description: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: responsiveFontSize(8),
    top: '20%',
    fontFamily: 'Nunito-Black',
  },
  skillName: {
    textAlign: 'center',
  }
});

export default SkillCard;
