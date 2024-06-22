import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ImageStyle, TextStyle, ViewStyle } from 'react-native';

const ItemsUI: React.FC = () => {
  return (
    <ImageBackground
      source={require('../assets/light-gradient.png')}
      resizeMode="cover"
      style={styles.bottomPart}
    >
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Items Placeholder</Text>
      </View>
    </ImageBackground>
  );
};

interface Style {
  bottomPart: ImageStyle;
  placeholder: ViewStyle;
  placeholderText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  bottomPart: {
    flex: 3,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50%',
    minWidth: '50%',
  },
  placeholderText: {
    fontSize: 20,
    color: '#000000',
  },
});

export default ItemsUI;
