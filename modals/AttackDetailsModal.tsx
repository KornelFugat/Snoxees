import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageSourcePropType } from 'react-native';
import Modal from 'react-native-modal';
import { Image } from 'expo-image';
import { Attack } from '../types';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('screen');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

const iconMap: { [key: string]: ImageSourcePropType } = {
  normal: require('../assets/normalskill.png'),
  fire: require('../assets/fireskill.png'),
  grass: require('../assets/grassskill.png'),
};

const gifMap: { [key: string]: ImageSourcePropType } = {
  'Punch': require('../assets/punch-gif.gif'),
  // 'Small Fireball': require('../assets/punch-fire.gif'),
};

interface AttackDetailsModalProps {
  isVisible: boolean;
  attack: Attack | null;
  onClose: () => void;
}

const AttackDetailsModal: React.FC<AttackDetailsModalProps> = ({ isVisible, attack, onClose }) => {
  if (!attack) return null;

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} deviceHeight={height} statusBarTranslucent>
      <View style={styles.modalContent}>
        <StrokeText
          text={attack.name.toUpperCase()}
          fontSize={responsiveFontSize(18)}
          color="#FFFFFF"
          strokeColor="#333000"
          strokeWidth={5}
          fontFamily='Nunito-Black'
          align='center'
          numberOfLines={1}
        />
        <View style={styles.gifContainer}>
          <Image source={gifMap[attack.name]} style={styles.gif} contentFit='cover' />
        </View>
        <View style={styles.row}>
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
            <StrokeText
            text='TYPE'
            fontSize={responsiveFontSize(13)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={4}
            fontFamily='Nunito-Black'
            align='center'
            numberOfLines={1}
            />
            </View>
            <View style={styles.infoBody}>
            <Image source={iconMap[attack.type]} style={styles.icon} contentFit='cover' />
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <StrokeText
                text='ACCURACY'
                fontSize={responsiveFontSize(13)}
                color="#FFFFFF"
                strokeColor="#333000"
                strokeWidth={4}
                fontFamily='Nunito-Black'
                align='center'
                numberOfLines={1}
                />
            </View>
            <View style={styles.infoBody}>
              <StrokeText
              text={attack.accuracy * 100 + '%'}
              fontSize={responsiveFontSize(13)}
              color="#333000"
              strokeColor="#FFFFFF"
              strokeWidth={4}
              fontFamily='Nunito-Black'
              align='center'
              numberOfLines={1}
              />
            </View>
          </View>
        </View>
        <View style={styles.row}>
        <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <StrokeText
                text='BASE DAMAGE'
                fontSize={responsiveFontSize(13)}
                color="#FFFFFF"
                strokeColor="#333000"
                strokeWidth={4}
                fontFamily='Nunito-Black'
                align='center'
                numberOfLines={1}
                />
            </View>
            <View style={styles.infoBody}>
              <StrokeText
              text={attack.damage.toString()}
              fontSize={responsiveFontSize(13)}
              color="#333000"
              strokeColor="#FFFFFF"
              strokeWidth={4}
              fontFamily='Nunito-Black'
              align='center'
              numberOfLines={1}
              />
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <StrokeText
                text='MULTIPLIER'
                fontSize={responsiveFontSize(13)}
                color="#FFFFFF"
                strokeColor="#333000"
                strokeWidth={4}
                fontFamily='Nunito-Black'
                align='center'
                numberOfLines={1}
                />
            </View>
            <View style={styles.infoBody}>
              <StrokeText
              text={'+ ' + attack.multiplier + ' × '}
              fontSize={responsiveFontSize(13)}
              color="#333000"
              strokeColor="#FFFFFF"
              strokeWidth={4}
              fontFamily='Nunito-Black'
              align='center'
              numberOfLines={1}
              />
              <Image source={require('../assets/normal-damage.png')} style={styles.statIcon} contentFit='cover' />
            </View>
          </View>
        </View>

        {attack.upgrade &&
        <View style={styles.upgradeContainer}>
        
        <TouchableOpacity  style={styles.button}>
          <LinearGradient style={styles.upgradeButton} colors={['#36FF9B', '#50DA3B']}>
                <StrokeText
                  text="UPGRADE"
                  fontSize={responsiveFontSize(13)}
                  color="#FFFFFF"
                  strokeColor="#333000"
                  strokeWidth={4}
                  fontFamily='Nunito-Black'
                  align='center'
                  numberOfLines={1}
                />
              </LinearGradient>
        </TouchableOpacity>
        <View style={styles.upgradeText}>
        <StrokeText
                  text={attack.upgrade}
                  fontSize={responsiveFontSize(13)}
                  color="#333000"
                  strokeColor="#FFFFFF"
                  strokeWidth={2}
                  fontFamily='Nunito-Black'
                  align='center'
                  numberOfLines={1}
                  />
        </View>
        </View>
        }
        
        <View style={styles.description}>
        <StrokeText
                text={attack.description}
                fontSize={responsiveFontSize(13)}
                color="#FFFFFF"
                strokeColor="#333000"
                strokeWidth={4}
                fontFamily='Nunito-Black'
                align='center'
                numberOfLines={1}
                />
        </View>

        <View style={styles.exitInfo} />
          <StrokeText
                  text='<< TAP ANYWHERE AROUND TO EXIT >>'
                  fontSize={responsiveFontSize(8)}
                  color="#CCCCCC"
                  strokeColor="#333000"
                  strokeWidth={2}
                  fontFamily='Nunito-Black'
                  align='center'
                  numberOfLines={1}
                  />
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#FFF8E1',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: width * 0.8,
    height: height * 0.7,
    alignSelf: 'center',
    borderWidth: 4,
  },
  gifContainer: {
    width: '50%',
    minWidth: 200,
    height: 100,
    marginVertical: 10,
    borderRadius: 17,
    borderWidth: 2,
  },
  gif: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '18%',
    marginVertical: 5,
  },
  infoContainer: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
  },
  infoHeader: {
    
  },
  infoBody: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    width: '50%',
    height: '80%',
    maxWidth: 90,
  },
  statIcon: {
    width: '30%',
    height: '80%',
  },
  attackDetail: {
    fontSize: responsiveFontSize(14),
    width: '50%',
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
  },
  description: {
    marginVertical: 5,
    textAlign: 'center',
    marginTop: 30
    },
  upgradeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    height: '10%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#333000',
    borderRadius: 10,
    margin: 5,
    width: '40%',
    borderWidth: 2,
  },
  upgradeButton: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeText: {
    padding: 5,
  },
  exitInfo: {
    marginTop: 'auto'
  }
});

export default AttackDetailsModal;
