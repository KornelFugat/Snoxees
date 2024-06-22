import React, { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
  withSpring,
  StyleProps,
  SharedValue,
  AnimatableValue
} from "react-native-reanimated";
import { View, Text, StyleSheet, Button, TouchableOpacity, ImageBackground, ImageSourcePropType } from "react-native";
import SmallFireball from "./Skills/SmallFireball";
import Punch from "./Skills/Punch";
import { useMainStore } from "../stores/useMainStore";
import HealthBar from "../HealthBar";
import CharacterCard from "../CharacterCard";
import { BattleAnimationResult, BattleResult, Character, Enemy } from "../types";
import { Image } from "expo-image";

interface BattlegroundProps {
  triggerAttack: (attackHandler: (attackName: string) => void) => void;
  currentTurn: "player" | "enemy" | "end";
  playerImage: ImageSourcePropType;
  enemyImage: ImageSourcePropType;
  currentPlayerIndex: number;
  triggerStartAnimation: React.MutableRefObject<boolean>;
  triggerEndAnimation: React.MutableRefObject<BattleAnimationResult>;
}

const Battleground: React.FC<BattlegroundProps> = ({
  triggerAttack,
  currentTurn,
  playerImage,
  enemyImage,
  currentPlayerIndex,
  triggerStartAnimation,
  triggerEndAnimation,
}) => {
  const enemyOpacity = useSharedValue(0);
  const enemyOpacityMain = useSharedValue(0);
  const playerOpacity = useSharedValue(0);
  const playerOpacityMain = useSharedValue(0);
  const enemyDamageText = useSharedValue('');
  const playerDamageText = useSharedValue('');
  const enemyDamageY = useSharedValue(0);
  const playerDamageY = useSharedValue(0);
  const enemyTextOpacity = useSharedValue(0);
  const playerTextOpacity = useSharedValue(0);
  const startAnimationPlayer = useSharedValue(0);
  const startAnimationEnemy = useSharedValue(0);
  const playerScale = useSharedValue(0);
  const enemyScale = useSharedValue(0);
  const [turn, setTurn] = useState(currentTurn === 'player');
  const [isPunchActive, setIsPunchActive] = useState(false);
  const [isFireballActive, setIsFireballActive] = useState(false);
  const [isPlayerEffectActive, setIsPlayerEffectActive] = useState(false);
  const [isEnemyEffectActive, setIsEnemyEffectActive] = useState(false);
  const { enemy, team } = useMainStore((state) => ({
    enemy: state.enemy,
    team: state.team,
  }));

  useEffect(() => {
    console.log(1, triggerStartAnimation.current);
  }, [triggerStartAnimation.current]);

  //START BATTLE ANIMATIONS

  const startBattleAnimations = () => {
    playerScale.value = withSequence(
      withSpring(0, { duration: 500 }),
      withSpring(1, { duration: 500 })
    );
    startAnimationPlayer.value = withSequence(
      withTiming(1, { duration: 250, easing: Easing.ease }),
      withTiming(0, { duration: 250, easing: Easing.ease }),
      withTiming(1, { duration: 250, easing: Easing.ease }),
      withTiming(0, { duration: 250, easing: Easing.ease })
    );
    playerOpacityMain.value = withTiming(1, { duration: 500, easing: Easing.ease });
    setTimeout(() => {
      enemyScale.value = withSequence(
        withSpring(0, { duration: 500 }),
        withSpring(1, { duration: 500 })
      );
      startAnimationEnemy.value = withSequence(
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease }),
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease })
      );
      enemyOpacityMain.value = withTiming(1, { duration: 500, easing: Easing.ease });
    }, 1500);
  };

  useEffect(() => {
    if (triggerStartAnimation.current) {
      startBattleAnimations();
    }
  }, [triggerStartAnimation.current]);

  const playerStartBattle = useAnimatedStyle(() => ({
    opacity: playerOpacityMain.value,
    transform: [{ scale: playerScale.value }],
    tintColor: startAnimationPlayer.value ? "white" : "none",
  }));

  const enemyStartBattle = useAnimatedStyle(() => ({
    opacity: enemyOpacityMain.value,
    transform: [{ scale: enemyScale.value }, { scaleX: -1 }],
    tintColor: startAnimationEnemy.value ? "white" : "none",
  }));

  useEffect(() => {
    console.log(14, triggerEndAnimation.current);
  }, [triggerEndAnimation.current]);

  //END BATTLE ANIMATIONS
  const endAnimations = (type: BattleAnimationResult) => {
    if (type === "enemyDefeated") {
      enemyScale.value = withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.ease }),
        withTiming(0, { duration: 600, easing: Easing.ease })
      );
      enemyOpacity.value = withTiming(0, { duration: 300 });
    } else if (type === "playerDefeated") {
      console.log(15);
      playerScale.value = withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.ease }),
        withTiming(0, { duration: 600, easing: Easing.ease })
      );
      playerOpacity.value = withTiming(1, { duration: 300 });
      setTimeout(() => {
        playerScale.value = withSequence(
          withTiming(1, { duration: 600, easing: Easing.ease })
        );
      }, 3000);
    } else if (type === "lastPlayerDefeated") {
      console.log(16);
      playerScale.value = withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.ease }),
        withTiming(0, { duration: 600, easing: Easing.ease })
      );
      playerOpacity.value = withTiming(0, { duration: 300 });
    } else if (type === "captureSuccess") {
      enemyScale.value = withSequence(
        withTiming(0, { duration: 1000, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease }),
        withTiming(0, { duration: 2000, easing: Easing.ease }),
        withTiming(1, { duration: 2000, easing: Easing.ease }),
        withTiming(0, { duration: 600, easing: Easing.ease })
      );
      startAnimationEnemy.value = withSequence(
        withTiming(1, { duration: 500, easing: Easing.ease }),
        withTiming(0, { duration: 500, easing: Easing.ease }),
        withTiming(1, { duration: 500, easing: Easing.ease }),
        withTiming(0, { duration: 500, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease }),
        withTiming(0, { duration: 1000, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease }),
        withTiming(0, { duration: 1000, easing: Easing.ease })
      );
      setTimeout(() => {
        enemyOpacityMain.value = withTiming(0, { duration: 500, easing: Easing.ease });
      }, 6400);
    } else if (type === "captureFailure") {
      enemyScale.value = withSequence(
        withSpring(0, { duration: 1000 }),
        withSpring(1, { duration: 1000 }),
        withSpring(0, { duration: 2000 }),
        withSpring(1, { duration: 2000 })
      );
      startAnimationEnemy.value = withSequence(
        withTiming(1, { duration: 500, easing: Easing.ease }),
        withTiming(0, { duration: 500, easing: Easing.ease }),
        withTiming(1, { duration: 500, easing: Easing.ease }),
        withTiming(0, { duration: 500, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease }),
        withTiming(0, { duration: 1000, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease }),
        withTiming(0, { duration: 1000, easing: Easing.ease })
      );
      enemyOpacityMain.value = withTiming(1, { duration: 500, easing: Easing.ease });
    }
  };

  useEffect(() => {
    if (triggerEndAnimation.current !== null) {
      endAnimations(triggerEndAnimation.current);
      triggerEndAnimation.current = null;
    }
  }, [triggerEndAnimation.current]);

  //ENEMY GOT HIT

  const triggerEnemyEffect = (repeats = 1, damage = 0) => {
    const animations: number[] = [];
    const textAnimations: number[] = [];
    for (let i = 0; i < repeats; i++) {
      animations.push(
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 500 })
      );
      textAnimations.push(
        withSpring(0, { duration: 500 }),
        withSpring(-40, { duration: 500 })
      );
    }
    enemyTextOpacity.value = 0;
    enemyDamageText.value = (damage / repeats).toString();
    enemyDamageY.value = 0;
  
    setTimeout(() => {
      enemyOpacity.value = withSequence(...animations);
      enemyTextOpacity.value = withSequence(...animations);
      enemyDamageY.value = withSequence(...textAnimations);
      setIsEnemyEffectActive(true); // Set the effect active
      setTimeout(() => {
        setIsEnemyEffectActive(false); // Disable the effect after a short delay
      }, 2000);
    }, 50); // Ensure a small delay to allow the reset to take effect
  };

  const enemyDamageTaken = useAnimatedStyle(() => ({
    opacity: enemyOpacity.value,
    tintColor: 'red',
  }));

  const enemyDamageTakenText = useAnimatedStyle(() => ({
    opacity: enemyTextOpacity.value,
    transform: [{ translateY: enemyDamageY.value }],
  }))
  
  //PLAYER GOT HIT

  const triggerPlayerEffect = (repeats = 1, damage = 0) => {
    const animations: number[] = [];
    const textAnimations: number[] = [];
    for (let i = 0; i < repeats; i++) {
      animations.push(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 }));
      textAnimations.push(withSpring(0, { duration: 500 }), withSpring(-40, { duration: 500 }));
    }
    playerOpacity.value = 0;
    playerTextOpacity.value = 0;
    playerDamageText.value = (damage / repeats).toString();
    playerDamageY.value = 0;

    setTimeout(() => {
      playerOpacity.value = withSequence(...animations);
      playerTextOpacity.value = withSequence(...animations);
      playerDamageY.value = withSequence(...textAnimations);
      setIsPlayerEffectActive(true); // Set the effect active
      setTimeout(() => {
        setIsPlayerEffectActive(false); // Disable the effect after a short delay
      }, 2000);
    }, 50); // Ensure a small delay to allow the reset to take effect
  };

  useEffect(() => {
    console.log(11, isPlayerEffectActive);
  }, [isPlayerEffectActive]);

  const playerDamageTaken = useAnimatedStyle(() => ({
    opacity: playerOpacity.value,
    tintColor: "red",
  }));

  const playerDamageTakenText = useAnimatedStyle(() => ({
    opacity: playerTextOpacity.value,
    transform: [{ translateY: playerDamageY.value }],
  }));

  //TURN ANNOUNCEMENT

  useEffect(() => {
    console.log(`Turn: ${turn ? "player" : "enemy"}`);
  }, [turn, playerImage]);

  //HANDLING ATTACKS BEING USED

  const handleAttack = async (attackName: string) => {
    switch (attackName) {
      case "Small Fireball":
        setIsFireballActive(true);
        console.log("uses Fireball");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        break;
      case "Thorns":
        console.log("uses Thorns");
        setTurn(!turn);
        break;
      case "Punch":
        setIsPunchActive(true);
        console.log("uses Punch");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setTurn(!turn);
        setIsPunchActive(false);
        break;
      default:
        console.log("No specific animation for this attack");
    }
  };

  useEffect(() => {
    console.log(10, isPunchActive);
  }, [isPunchActive]);

  triggerAttack(handleAttack);

  useEffect(() => {
    if (currentTurn !== "end") {
      setTurn(currentTurn === "player");
    }
  }, [currentTurn]);

  const getCharacterTypeIcon = (type: string) => {
    const typeIconMap: { [key: string]: ImageSourcePropType } = {
      fire: require("../assets/fireskill.png"),
      grass: require("../assets/grassskill.png"),
      // Add other types as necessary
    };
    return typeIconMap[type] || null;
  };

  return (
    <View style={styles.topPart}>
      <View style={styles.playerContainer}>
        <CharacterCard character={team[currentPlayerIndex]} getCharacterTypeIcon={getCharacterTypeIcon} />
      </View>
      {enemy && 
      <View style={styles.enemyContainer}>
        <CharacterCard character={enemy} getCharacterTypeIcon={getCharacterTypeIcon} customStyles={styles.reversedCard} />
      </View>
      }

      <View style={styles.playerPlatform}>
        <Image source={require("../assets/platformWoods.png")} style={styles.platform} contentFit="cover" />
      </View>
      <View style={styles.enemyPlatform}>
        <Image source={require("../assets/platformWoods.png")} style={styles.platform} contentFit="cover" />
      </View>

      {/* PLAYER MODEL */}
      {!isPunchActive && <Animated.Image source={playerImage} style={[styles.attacker, playerStartBattle]} />}

      {/* ATTACKS */}
      {isPunchActive && (
        <Punch
          playerTurn={turn}
          triggerEnemyEffect={triggerEnemyEffect}
          triggerPlayerEffect={triggerPlayerEffect}
          isPunchActive={isPunchActive}
          setIsPunchActive={setIsPunchActive}
          playerImage={playerImage}
          enemyImage={enemyImage}
          currentPlayerIndex={currentPlayerIndex}
        />
      )}

      <SmallFireball
        playerTurn={turn}
        triggerEnemyEffect={triggerEnemyEffect}
        triggerPlayerEffect={triggerPlayerEffect}
        isFireballActive={isFireballActive}
        setIsFireballActive={setIsFireballActive}
      />

      {/* PLAYER MODEL ANIMATION */}
      {isPlayerEffectActive && <Animated.Image source={playerImage} style={[styles.attacker, playerDamageTaken]} />}

      {/* ENEMY MODEL */}
      {!isPunchActive && <Animated.Image source={enemyImage} style={[styles.enemy, enemyStartBattle]} />}

      {/* ENEMY MODEL ANIMATION */}
      {isEnemyEffectActive && <Animated.Image source={enemyImage} style={[styles.enemy, enemyDamageTaken]} />}

      <Animated.Text style={[styles.damageEnemyText, enemyDamageTakenText]}>{enemyDamageText.value}</Animated.Text>
      <Animated.Text style={[styles.damagePlayerText, playerDamageTakenText]}>{playerDamageText.value}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  topPart: {
    flex: 7, // 60% of the screen
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  playerPlatform: {
    position: "absolute",
    width: "40%",
    maxWidth: 250,
    height: "21%",
    maxHeight: 150,
    top: "81%",
    left: "5%",
  },
  enemyPlatform: {
    position: "absolute",
    width: "40%",
    maxWidth: 250,
    height: "21%",
    maxHeight: 150,
    top: "81%",
    right: "5%",
    transform: [{ rotateY: "180deg" }],
  },
  platform: {
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  playerContainer: {
    flex: 1,
    position: "absolute",
    top: "5%",
    left: "2%",
    width: "40%",
    height: "40%",
  },
  damageEnemyText: {
    position: "absolute",
    top: "65%",
    right: "20%",
    fontSize: 40,
    color: "white",
  },
  damagePlayerText: {
    position: "absolute",
    top: "65%",
    left: "20%",
    fontSize: 40,
    color: "white",
  },
  enemyContainer: {
    position: "absolute",
    top: "5%",
    right: "0%",
    width: "40%",
    height: "40%",
  },
  reversedCard: {
    transform: [{ rotateX: "180deg" }],
  },
  placeholderPlayerUI: {
    flex: 1,
    width: "30%",
    top: "20%",
    right: "66%",
    position: "absolute",
    justifyContent: "center",
  },
  placeholderimage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  healthBar: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#000000", // Black background
    borderRadius: 10, // Add a border radius for a better look
    justifyContent: "center", // Center the text
    alignItems: "center", // Center the text
  },
  healthText: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF", // White text for visibility
    fontSize: 30, // Adjust the font size as needed
    width: "100%", // Cover the full width of the button
    textShadowColor: "#000000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    position: "absolute",
  },
  placeholderEnemyUI: {
    flex: 1,
    width: "30%",
    top: "20%",
    right: "3%",
    position: "absolute",
    justifyContent: "center",
  },
  attacker: {
    width: "30%",
    height: "25%",
    top: "63%",
    left: "10%",
    position: "absolute",
  },
  enemy: {
    width: "30%",
    height: "25%",
    top: "63%",
    right: "10%",
    position: "absolute",
    transform: [{ scaleX: -1 }],
  },
});

export default Battleground;
