import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, InteractionManager } from 'react-native';
import Joystick from './Joystick';
import Animated, { useSharedValue, useAnimatedStyle, runOnUI } from 'react-native-reanimated';
import { Image } from 'expo-image';
import LoadingComponent from './LoadingComponent';
import { checkBattleRequirements } from 'api/battleApi';
import { Character } from 'types';
import { fetchAccountDetails } from 'api/accountApi';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

interface DraggableMapProps {
  team: Character[];
  onStartGame: () => void;
}

const DraggableMap: React.FC<DraggableMapProps> = ({ onStartGame, team }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mapWidth = 1250;
  const mapHeight = 1250;
  const playerX = useSharedValue(-260);
  const playerY = useSharedValue(33);
  const mapX = useSharedValue(260);
  const mapY = useSharedValue(-33);
  const images = [
    // { source: require('./assets/paper.png'), x: 2600, y: 2600, width: 100, height: 100 },
    // { source: require('./assets/spruceTree.png'), x: 500, y: 4300, width: 100, height: 200 },
    { source: require('./assets/spruceTree.png'), x: 500, y: 600, width: 100, height: 200 },
    // { source: require('./assets/spruceTree.png'), x: 4300, y: 4300, width: 100, height: 200 },
    // { source: require('./assets/spruceTree.png'), x: 4300, y: 500, width: 100, height: 200 },
    // Add more images here
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isImageLoaded) {
        setIsLoading(false);
      }
    }, 100); // 10 seconds delay

    return () => clearTimeout(timer);
  }, [isImageLoaded]);

  const maxX = useRef(mapWidth / 2 - 175).current;
  const maxYup = useRef(mapHeight / 2 - 100).current;
  const maxYdown = useRef(mapHeight / 2 - 100).current;
  
  const handleMove = (dx: number, dy: number) => {
    runOnUI(() => {
    let newX = playerX.value + dx * 0.03;
    let newY = playerY.value + dy * 0.03;
  
    // Check for collision with images
    for (const img of images) {
      if (
        img.x - mapWidth / 2 - img.width / 6 < newX &&
        img.x - mapWidth / 2 + img.width > newX &&
        img.y - mapHeight / 2 - img.height / 6 < newY &&
        img.y - mapHeight / 2 + img.height > newY
      ) {
        return;
      }
    }
  
    // Use pre-calculated maxX, maxYup, maxYdown
    if (newX > maxX) newX = maxX;
    if (newX < -maxX) newX = -maxX;
    if (newY > maxYdown) newY = maxYdown;
    if (newY < -maxYup) newY = -maxYup;
  
    playerX.value = newX;
    playerY.value = newY;

    // Move the map to keep the player centered until boundaries
    if (Math.abs(playerX.value) > mapWidth / 2 - screenWidth / 2) {
      mapX.value = playerX.value < 0
        ? mapWidth / 2 - Math.abs(screenWidth / 2)
        : -mapWidth / 2 + Math.abs(screenWidth / 2);
    } else {
      mapX.value = -newX;
    }

    if (Math.abs(playerY.value) > mapHeight / 2 - screenHeight / 2) {
      mapY.value = playerY.value < 0
        ? mapHeight / 2 - Math.abs(screenHeight / 2)
        : -mapHeight / 2 + Math.abs(screenHeight / 2);
    } else {
      mapY.value = -newY;
    }
  })();
  };

  const playerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: playerX.value }, { translateY: playerY.value }],
  }));

  const mapStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: mapX.value }, { translateY: mapY.value }],
  }));

  const handleStartGame = () => {
    console.log('click', Date.now())
    if (team.length === 0) {
      Alert.alert('No Team', 'Please add at least one character to your team before starting the game.');
    } else {
      checkBattleRequirements();
      setTimeout(() => {
        console.log('handleStartGame', Date.now());
        onStartGame();
      }, 2000);
      
    }
  };

  return (
    <View style={styles.screen}>
      {isLoading && <LoadingComponent duration={1} />}
      <Animated.View style={[styles.map, mapStyle]}>
        <Image
          source={require('./assets/mapa1250x1250.png')}
          style={styles.mapStyle}
          contentFit="cover"
          onLoad={() => setIsImageLoaded(true)}
        />
        <Animated.View style={[styles.player, playerStyle]}>
          <Image source={require('./assets/attacker.png')} style={{ width: 100, height: 100 }} />
        </Animated.View>
        {images.map((img, index) => (
          <TouchableOpacity key={index} onPress={handleStartGame} style={[styles.startGameButton, { left: img.x, top: img.y }]}>
            <Image source={img.source} style={{ width: img.width, height: img.height }} contentFit="cover" />
          </TouchableOpacity>
        ))}
      </Animated.View>
      {!isLoading && <Joystick onMove={handleMove} />}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: 1250,
    height: 1250,
    position: 'absolute',
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
  player: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -50,
    marginTop: -50,
    zIndex: 4,
  },
  startGameButton: {
    position: 'absolute',
    width: 100,
    height: 200,
  },
});

export default DraggableMap;
