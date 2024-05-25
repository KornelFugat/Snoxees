import React, {useState, useEffect, useCallback} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import {GestureHandlerRootView} from'react-native-gesture-handler';
import Battle from './battle/Battle';
import AfterBattleScreen from './battle/AfterBattleScreen';
import Screen from './Screen';
import DraggableMap from './DraggableMap';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [screen, setScreen] = useState('screen'); // 'home', 'battle', or 'afterBattle'
  const [fontsLoaded, fontError] = useFonts({
    'Nunito-Black': require('./assets/fonts/Nunito-Black.ttf'),
  });

 const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded || fontError) {
		  await SplashScreen.hideAsync();
		}
	  }, [fontsLoaded, fontError]);

  const startGame = () => {
    setScreen('battle');
  };

  const goMainScreen = () => {
    setScreen('screen');
  };

  const handleBattleEnd = () => {
    setScreen('afterBattle');
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const renderScreen = () => {
    switch(screen) {
      case 'battle':
        return <Battle onGoBack={goMainScreen} onBattleEnd={handleBattleEnd} />;
      case 'afterBattle':
        return <AfterBattleScreen onRestartGame={goMainScreen} />;
      default:
        return <Screen onStartGame={startGame}/>;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" hidden={true} />
      <View style={styles.fullscreen} onLayout={onLayoutRootView}>
        {renderScreen()}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
});

export default App;
