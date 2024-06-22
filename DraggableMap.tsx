import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Joystick from './Joystick';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useMainStore } from './stores/useMainStore';
import { characters } from './charactersData';
import { Image } from 'expo-image';
import LoadingComponent from './LoadingComponent';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DraggableMapProps {
  onStartGame: () => void;
}

const DraggableMap: React.FC<DraggableMapProps> = ({ onStartGame }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const playerX = useSharedValue(-2325);
  const playerY = useSharedValue(1910);
  const mapX = useSharedValue(2200);
  const mapY = useSharedValue(-1910);
  const mapWidth = 5000;
  const mapHeight = 5000;

  const images = [
    { source: require('./assets/paper.png'), x: 2600, y: 2600, width: 100, height: 100 },
    { source: require('./assets/spruceTree.png'), x: 500, y: 4300, width: 100, height: 200 },
    { source: require('./assets/spruceTree.png'), x: 500, y: 600, width: 100, height: 200 },
    { source: require('./assets/spruceTree.png'), x: 4300, y: 4300, width: 100, height: 200 },
    { source: require('./assets/spruceTree.png'), x: 4300, y: 500, width: 100, height: 200 },
    // Add more images here
  ];

  const { team, setEnemy } = useMainStore((state) => ({
    team: state.team,
    setEnemy: state.setEnemy,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isImageLoaded) {
        setIsLoading(false);
      }
    }, 100); // 10 seconds delay

    return () => clearTimeout(timer);
  }, [isImageLoaded]);

  const handleMove = (dx: number, dy: number) => {
    let newX = playerX.value + dx * 0.1;
    let newY = playerY.value + dy * 0.1;

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

    // Prevent the player from moving off the map
    const maxX = mapWidth / 2 - 175;
    const maxYup = mapHeight / 2 - 400;
    const maxYdown = mapHeight / 2 - 100;

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
  };

  const playerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: playerX.value }, { translateY: playerY.value }],
  }));

  const mapStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: mapX.value }, { translateY: mapY.value }],
  }));

  const handleSetEnemy = () => {
    const allCharacters = Object.values(characters); // Ensure characters is an object where keys are character names
    const randomEnemy = allCharacters[Math.floor(Math.random() * allCharacters.length)];
    setEnemy({ ...randomEnemy, currentHealth: randomEnemy.baseStats.maxHealth });
  };

  const handleStartGame = () => {
    if (team.length === 0) {
      Alert.alert('No Team', 'Please add at least one character to your team before starting the game.');
    } else {
      handleSetEnemy();
      onStartGame();
    }
  };

  return (
    <View style={styles.screen}>
      {isLoading && <LoadingComponent duration={1} />}
      <Animated.View style={[styles.map, mapStyle]}>
        <Image
          source={require('./assets/mapa5000x5000test.png')}
          style={styles.mapStyle}
          contentFit="cover"
          onLoad={() => setIsImageLoaded(true)}
        />
        <Animated.View style={[styles.player, playerStyle]}>
          <Image source={require('./assets/enemy.png')} style={{ width: 100, height: 100 }} />
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
    width: 5000,
    height: 5000,
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
