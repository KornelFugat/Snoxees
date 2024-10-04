import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Battle from './battle/Battle';
import AfterBattleScreen from './afterBattle/AfterBattleScreen';
import Screen from './Screen';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import TeamModal from './modals/TeamModal';
import CharacterModal from './modals/CharacterModal';
import BottomNav from './BottomNav'; // import the BottomNav component
import { ScreenType } from 'types';

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('screen');
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

  const openTeamModal = () => {
    setScreen('team');
  };

  const openCharacterModal = () => {
    setScreen('characters');
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
    switch (screen) {
      case 'team':
        return <TeamModal />;
      case 'characters':
        return <CharacterModal onExit={goMainScreen} />;
      case 'battle':
        return <Battle onGoBack={goMainScreen} onBattleEnd={handleBattleEnd} />;
      case 'afterBattle':
        return <AfterBattleScreen onRestartGame={goMainScreen} />;
      case 'home':
        return <Screen onStartGame={startGame} onBattleEnd={handleBattleEnd} onCharactersUI={openCharacterModal} onTeamUI={openTeamModal} />;
      default:
        return <Screen onStartGame={startGame} onBattleEnd={handleBattleEnd} onCharactersUI={openCharacterModal} onTeamUI={openTeamModal} />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" hidden={true} />
      <View style={styles.fullscreen} onLayout={onLayoutRootView}>
        {renderScreen()}
        {screen !== 'battle' && screen !== 'afterBattle' && (
          <View style={styles.bottomNavContainer}>
            <BottomNav onSelect={(newScreen) => setScreen(newScreen)} />
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  bottomNavContainer: {
    position: 'absolute',
    height: '10%',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Ensure it's above other content
  },
});

export default App;
