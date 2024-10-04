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
  AnimatableValue,
  runOnUI,
  withDelay
} from "react-native-reanimated";
import { View, Text, StyleSheet, Button, TouchableOpacity, ImageBackground, ImageSourcePropType } from "react-native";
import SmallFireball from "./Skills/SmallFireball";
import Punch from "./Skills/Punch";
import HealthBar from "../HealthBar";
import CharacterCard from "../CharacterCard";
import { Announcement, BattleAnimationResult, BattleResult, Character, CurrentTurn, Enemy } from "../types";
import { Image } from "expo-image";

interface BattlegroundProps {
  currentTurn: 'start' | 'player' | 'enemy' | 'end';
  team: Character[];
  enemy: Enemy;
  currentPlayerIndex: number,
  chosenAttack: string | null;
  attackId: number;
  damageResults: (number | 'miss')[];
  playerImage: string;
  enemyImage: string;
  triggerStartAnimation: React.MutableRefObject<boolean>;
  triggerSwitchAnimations:  React.MutableRefObject<boolean>;
  triggerEndAnimation: {type: BattleAnimationResult | null, id: number};
  isEnemyAsleep: boolean;
  isPlayerAsleep: boolean;
}

const Battleground: React.FC<BattlegroundProps> = ({
  team,
  enemy,
  currentPlayerIndex,
  chosenAttack,
  attackId,
  damageResults,
  currentTurn,
  playerImage,
  enemyImage,
  triggerStartAnimation,
  triggerSwitchAnimations,
  triggerEndAnimation,
  isEnemyAsleep,
  isPlayerAsleep
}) => {
  const enemyOpacity = useSharedValue(0);
  const enemyOpacityMain = useSharedValue(0);
  const playerOpacity = useSharedValue(0);
  const playerOpacityMain = useSharedValue(0);
  const enemyDamageText = useSharedValue<string[]>([]);
  const playerDamageText = useSharedValue<string[]>([]);
  const enemyDamageY = useSharedValue(0);
  const playerDamageY = useSharedValue(0);
  const enemyTextOpacity = useSharedValue(0);
  const playerTextOpacity = useSharedValue(0);
  const startAnimationPlayer = useSharedValue(0);
  const startAnimationEnemy = useSharedValue(0);
  const playerScale = useSharedValue(0);
  const enemyScale = useSharedValue(0);
  const [isPunchActive, setIsPunchActive] = useState(false);
  const [isFireballActive, setIsFireballActive] = useState(false);
  const [isPlayerEffectActive, setIsPlayerEffectActive] = useState(false);
  const [isEnemyEffectActive, setIsEnemyEffectActive] = useState(false);
  const [enemyDamageTextQueue, setEnemyDamageTextQueue] = useState<Announcement[]>([]);
  const [playerDamageTextQueue, setPlayerDamageTextQueue] = useState<Announcement[]>([]);
  const [enemyDamageTextAnnouncement, setEnemyDamageTextAnnouncement] = useState<string>('');
  const [playerDamageTextAnnouncement, setPlayerDamageTextAnnouncement] = useState<string>('');


  // useEffect(() => {
  //   if (enemyDamageTextQueue.length > 0) {
  //     const { text, displayTime } = enemyDamageTextQueue[0];
  //     setEnemyDamageTextAnnouncement(text);
  
  //     const timeout = setTimeout(() => {
  //       setEnemyDamageTextQueue((prevQueue) => prevQueue.slice(1));
  //     }, Math.max(displayTime, 0));
  
  //     return () => clearTimeout(timeout);
  //   } else {
  //     setEnemyDamageTextAnnouncement('');
  //   }
  // }, [enemyDamageTextQueue]);

  // useEffect(() => {
  //   if (playerDamageTextQueue.length > 0) {
  //     const { text, displayTime } = playerDamageTextQueue[0];
  //     setPlayerDamageTextAnnouncement(text);
  
  //     const timeout = setTimeout(() => {
  //       setPlayerDamageTextQueue((prevQueue) => prevQueue.slice(1));
  //     }, Math.max(displayTime, 0));
  
  //     return () => clearTimeout(timeout);
  //   } else {
  //     setPlayerDamageTextAnnouncement('');
  //   }
  // }, [playerDamageTextQueue]);
  
  //START BATTLE ANIMATIONS

  const startBattleAnimations = () => {
    console.log('START BATTLE ANIMATIONS', Date.now());
    runOnUI(() => {
      playerScale.value = withSequence(
        withSpring(0, { duration: 500 }),
        withSpring(1, { duration: 500 })
      );
      startAnimationPlayer.value = withSequence(
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease }),
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 0 })
      );
      playerOpacityMain.value = withTiming(1, { duration: 500, easing: Easing.ease });
  
      enemyScale.value = withDelay(1500, withSequence(
        withSpring(0, { duration: 500 }),
        withSpring(1, { duration: 500 })
      ));
  
      startAnimationEnemy.value = withDelay(1500, withSequence(
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease }),
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 0 })
      ));
  
      enemyOpacityMain.value = withDelay(1500, withTiming(1, { duration: 500, easing: Easing.ease }));
      
    })();

    setTimeout(() => {
      startAnimationEnemy.value = 0;
    }, 3500)
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


  //SWITCH CHARACTER ANIMATIONS

  const switchCharacterAnimations = () => {
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
  };

  useEffect(() => {
    if (triggerSwitchAnimations.current) {
      switchCharacterAnimations();
    }
  }, [triggerSwitchAnimations.current]);

  //END BATTLE ANIMATIONS
  const endAnimations = (typeOf: {type: BattleAnimationResult, id: number}) => {
    if (typeOf.type === "enemyDefeated") {
      enemyScale.value = withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.ease }),
        withTiming(0, { duration: 600, easing: Easing.ease })
      );
      enemyOpacity.value = withTiming(0, { duration: 300 });
      setTimeout(() => {
        runOnJS(() => {
          enemyOpacityMain.value = 0;
          enemyScale.value = 0;  
        })();
      }, 1200);
    } else if (typeOf.type === "playerDefeated") {
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
    } else if (typeOf.type === "lastPlayerDefeated") {
      playerScale.value = withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.ease }),
        withTiming(0, { duration: 600, easing: Easing.ease })
      );
      playerOpacity.value = withTiming(0, { duration: 300 });
    } else if (typeOf.type === "captureSuccess") {
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
    } else if (typeOf.type === "captureFailure") {
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
    if (triggerEndAnimation !== null) {
      endAnimations(triggerEndAnimation);
      triggerEndAnimation = { type: null, id: 0 };
    }
  }, [triggerEndAnimation]);

  //ENEMY GOT HIT

  const triggerEnemyEffect = (repeats = 1, damage: (number | 'miss' | '')[] = []) => {
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
    const damageQueue: {text: string, displayTime: number}[] = []
    for (let i = 0; i < repeats; i++) {
      damageQueue.push({text: damage[i] === 'miss' ? 'MISS' : damage[i].toString(), displayTime: 1000});
    }
    setEnemyDamageTextQueue(damageQueue);

    enemyDamageY.value = 0;
  
    setTimeout(() => {
      enemyOpacity.value = withSequence(...animations);
      enemyTextOpacity.value = withSequence(...animations);
      enemyDamageY.value = withSequence(...textAnimations);
      setIsEnemyEffectActive(true); 
      setTimeout(() => {
        setIsEnemyEffectActive(false); 
      }, damageQueue.length * 1000);
    }, 50); 
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

  const triggerPlayerEffect = (repeats = 1, damage: (number | 'miss' | '')[] = []) => {
    const animations: number[] = [];
    const textAnimations: number[] = [];
    for (let i = 0; i < repeats; i++) {
      animations.push(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 }));
      textAnimations.push(withSpring(0, { duration: 500 }), withSpring(-40, { duration: 500 }));
    }
    playerOpacity.value = 0;
    playerTextOpacity.value = 0;
    const damageQueue: {text: string, displayTime: number}[] = []
    for (let i = 0; i < repeats; i++) {
      damageQueue.push({text: damage[i] === 'miss' ? 'MISS' : damage[i].toString(), displayTime: 900});
    }
    setPlayerDamageTextQueue(damageQueue);

    playerDamageY.value = 0;

    setTimeout(() => {
      playerOpacity.value = withSequence(...animations);
      playerTextOpacity.value = withSequence(...animations);
      playerDamageY.value = withSequence(...textAnimations);
      setIsPlayerEffectActive(true); // Set the effect active
      setTimeout(() => {
        setIsPlayerEffectActive(false); // Disable the effect after a short delay
      }, damageQueue.length * 1000);
    }, 50); // Ensure a small delay to allow the reset to take effect
  };

  const playerDamageTaken = useAnimatedStyle(() => ({
    opacity: playerOpacity.value,
    tintColor: "red",
  }));

  const playerDamageTakenText = useAnimatedStyle(() => ({
    opacity: playerTextOpacity.value,
    transform: [{ translateY: playerDamageY.value }],
  }));

  //HANDLING ATTACKS BEING USED

  useEffect(() => {
    if (chosenAttack !== null && chosenAttack !== '') {
      console.log('attack', Date.now());
      const handleAttack = (attackName: string) => {
        switch (attackName) {
          case "Small Fireball":
            setIsFireballActive(true);
            // Reset fireball active state after animation
            setTimeout(() => setIsFireballActive(false), 2000); // Set an appropriate time to reset
            break;
  
          case "Thorns":
            // Logic for Thorns (if needed)
            break;
  
          case "Punch":
            setIsPunchActive(true);
            // Reset punch active state after animation
            setTimeout(() => setIsPunchActive(false), 2000); // Set an appropriate time to reset
            break;
        }
      };
  
      handleAttack(chosenAttack || "");
    }
  }, [attackId]);
  


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
      {!isPunchActive && <Animated.Image source={{uri: playerImage}} style={[styles.attacker, playerStartBattle]} />}

      {/* ATTACKS */}
      {isPunchActive && (
        <Punch
          triggerEnemyEffect={triggerEnemyEffect}
          triggerPlayerEffect={triggerPlayerEffect}
          isPunchActive={isPunchActive}
          setIsPunchActive={setIsPunchActive}
          playerImage={playerImage}
          enemyImage={enemyImage}
          damageResults={damageResults}
          currentTurn={currentTurn}
          isEnemyAsleep={isEnemyAsleep}
          isPlayerAsleep={isPlayerAsleep}
        />
      )}

      <SmallFireball
        triggerEnemyEffect={triggerEnemyEffect}
        triggerPlayerEffect={triggerPlayerEffect}
        isFireballActive={isFireballActive}
        setIsFireballActive={setIsFireballActive}
        damageResults={damageResults}
        currentTurn={currentTurn}
      />

      {/* PLAYER MODEL ANIMATION */}
      {isPlayerEffectActive && <Animated.Image source={{uri: playerImage}} style={[styles.attacker, playerDamageTaken]} />}

      {/* ENEMY MODEL */}
      {!isPunchActive && <Animated.Image source={{uri: enemyImage}} style={[styles.enemy, enemyStartBattle]} />}

      {/* ENEMY MODEL ANIMATION */}
      {isEnemyEffectActive && <Animated.Image source={{uri: enemyImage}} style={[styles.enemy, enemyDamageTaken]} />}
      <Animated.Text style={[styles.damageEnemyText, enemyDamageTakenText]}>{enemyDamageTextAnnouncement}</Animated.Text>
      <Animated.Text style={[styles.damagePlayerText, playerDamageTakenText]}>{playerDamageTextAnnouncement}</Animated.Text>
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
