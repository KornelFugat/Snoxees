import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from 'expo-image';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';

const { width, height } = Dimensions.get('screen');
const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface MoneyWidgetProps {
  gold: number;
  diamonds: number;
}

const MoneyWidget: React.FC<MoneyWidgetProps> = ({ gold, diamonds }) => {
  return (
    <LinearGradient style={styles.container} colors={['#ffffff','silver']} start={{ x: 0, y: 0 }}>
      <View style={styles.goldContainer}>
        <Image source={require('./assets/gold.png')} style={styles.goldIcon} contentFit='cover' />
        <View style={styles.goldText}>
          <StrokeText
            text={gold.toString()}
            fontSize={responsiveFontSize(10)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={4}
            fontFamily='Nunito-Black'
            align='center'
            numberOfLines={1}
          />
        </View>
      </View>
      <View style={styles.goldContainer}>
        <Image source={require('./assets/diamond.png')} style={styles.goldIcon} contentFit='cover' />
        <View style={styles.goldText}>
          <StrokeText
            text={diamonds.toString()}
            fontSize={responsiveFontSize(10)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={4}
            fontFamily='Nunito-Black'
            align='center'
            numberOfLines={1}
          />
        </View>
      </View>
      <View style={styles.addButtonContainer}>
        <View style={styles.addButton}>
        <StrokeText
            text='+'
            fontSize={responsiveFontSize(16)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={3}
            fontFamily='Nunito-Black'
            align='center'
            numberOfLines={1}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    minWidth: 100,
    maxWidth: 150,
    minHeight: 50,
    maxHeight: 100,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#333',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  goldContainer: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
  },
  goldIcon: {
    top: '3%',
    width: '25%',
    height: '100%',
    marginLeft: 5,
  },
  goldText: {
    top: '5%',
    marginLeft: 5,
  },
  addButtonContainer: {
    position: 'absolute',
    right: '-14%',
    top: '25%',
    width: '25%',
    height: '55%',
    minHeight: 20,
    maxHeight: 50,
    minWidth: 26,
    maxWidth: 50,
    backgroundColor: '#d10035',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MoneyWidget;
