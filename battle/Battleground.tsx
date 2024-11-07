import React, { useEffect, useState, forwardRef, useImperativeHandle, ForwardRefRenderFunction } from "react";
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
  withDelay,
  interpolateColor
} from "react-native-reanimated";
import { View, Text, StyleSheet, Button, TouchableOpacity, ImageBackground, ImageSourcePropType, Dimensions } from "react-native";
import SmallFireball from "./Skills/SmallFireball";
import Punch from "./Skills/Punch";
import HealthBar from "../HealthBar";
import CharacterCard from "../CharacterCard";
import { Announcement, BattleAnimationResult, BattlegroundHandle, BattleResult, Character, CurrentTurn, DamageResult, Enemy, EnemyMarks, PlayerMarks } from "../types";
import { Image } from "expo-image";
import { StrokeText } from "@charmy.tech/react-native-stroke-text";

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface BattlegroundProps {
  currentTurn: 'start' | 'player' | 'enemy' | 'end';
  team: Character[];
  enemy: Enemy;
  currentPlayerIndex: number,
  chosenAttack: string | null;
  attackId: number;
  damageResults: DamageResult[];
  playerImage: string;
  enemyImage: string;
  triggerStartAnimation: React.MutableRefObject<boolean>;
  triggerSwitchAnimations:  React.MutableRefObject<boolean>;
  triggerEndAnimation: {type: BattleAnimationResult | null, id: number};
  playerMarks: PlayerMarks;
  enemyMarks: EnemyMarks
}

const Battleground: ForwardRefRenderFunction<
BattlegroundHandle,
BattlegroundProps
> = ({
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
  playerMarks,
  enemyMarks
}, ref) => {
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
  const playerTintAnimation = useSharedValue(0);
  const enemyTintAnimation = useSharedValue(0);
  const playerTintColors = useSharedValue(['none', 'yellow', 'red']);
  const enemyTintColors = useSharedValue(['none', 'yellow', 'red']);
  const [isPunchActive, setIsPunchActive] = useState(false);
  const [isFireballActive, setIsFireballActive] = useState(false);
  const [isPlayerEffectActive, setIsPlayerEffectActive] = useState(false);
  const [isEnemyEffectActive, setIsEnemyEffectActive] = useState(false);
  const [playerDamageTextQueue, setPlayerDamageTextQueue] = useState<{ text: string, displayTime: number, color: string }[]>([]);
  const [enemyDamageTextQueue, setEnemyDamageTextQueue] = useState<{ text: string, displayTime: number, color: string }[]>([]);
  const [playerDamageTextAnnouncement, setPlayerDamageTextAnnouncement] = useState<{ text: string, color: string }>({ text: '', color: '#ff0000' });
  const [enemyDamageTextAnnouncement, setEnemyDamageTextAnnouncement] = useState<{ text: string, color: string }>({ text: '', color: '#ff0000' });
  useImperativeHandle(ref, () => ({
    triggerPlayerGettingHit,
    triggerEnemyGettingHit,
    triggerPlayerAttacking,
    triggerEnemyAttacking,
  }));
  const [fontSize, setFontSize] = useState(50);

  const formatMarks = (marks: PlayerMarks | EnemyMarks) => {
    return Object.entries(marks)
      .map(([key, value]) => {
        if (value.isOn) {
          return `${key}: On (${value.turns ?? 0} turns, damage: ${value.damage ?? 0})`;
        } else {
          return `${key}: Off`;
        }
      })
      .join('\n');
  };

  const markImages: { [key: string]: ImageSourcePropType } = {
    asleep: require('../assets/marks/asleep.png'),
    freeze: require('../assets/marks/freeze.png'),
    poison: require('../assets/marks/freeze.png'),
    paralysis: require('../assets/marks/freeze.png'),
    defEleBuff: require('../assets/elemental-defence.png'),
    defEleDebuff: require('../assets/elemental-defence.png'),
    defNorBuff: require('../assets/normal-defence.png'),
    defNorDebuff: require('../assets/normal-defence.png'),
    dmgEleBuff: require('../assets/elemental-damage.png'),
    dmgEleDebuff: require('../assets/elemental-damage.png'),
    dmgNorBuff: require('../assets/normal-damage.png'),
    dmgNorDebuff: require('../assets/normal-damage.png'),
  };

  const markBackgroundColors: { [key: string]: string } = {
    asleep: '#a349a4',
    freeze: '#00a2e8',
    poison: '#716f0f',
    paralysis: '#fffdb3',
    defEleBuff: 'green',
    defEleDebuff: 'red',
    defNorBuff: 'green',
    defNorDebuff: 'red',
    dmgEleBuff: 'green',
    dmgEleDebuff: 'red',
    dmgNorBuff: 'green',
    dmgNorDebuff: 'red',
  };

  const renderActiveMarks = (marks: PlayerMarks | EnemyMarks, type: 'player' | 'enemy') => {
    return Object.entries(marks)
      .filter(([_, value]) => value.isOn) // Only show active marks
      .map(([key, value]) => (
        <View
          key={key}
          style={[
            type === 'player' ? styles.markCardPlayer : styles.markCardEnemy, // Different styles for player and enemy
            { backgroundColor: markBackgroundColors[key] || 'gray' } // Fallback to 'gray' if no specific color
          ]}
        >
          <Image source={markImages[key]} style={styles.markImage} />
          {value.turns > 0 && (
            <View style={styles.markTurns}>
              <StrokeText
                text={value.turns.toString()}
                fontSize={responsiveFontSize(10)}
                color="#FFFFFF"
                strokeColor="#333000"
                strokeWidth={3}
                fontFamily="Nunito-Black"
                align="left"
                numberOfLines={1}
                width={width * 0.2}
              />
            </View>
          )}
        </View>
      ));
  };
  
  useEffect(() => {
    if (enemyDamageTextQueue.length > 0) {
      const { text, displayTime, color } = enemyDamageTextQueue[0];
      setEnemyDamageTextAnnouncement({ text, color });
  
      const timeout = setTimeout(() => {
        setEnemyDamageTextQueue((prevQueue) => prevQueue.slice(1));
      }, Math.max(displayTime, 0));
  
      return () => clearTimeout(timeout);
    } else {
      setEnemyDamageTextAnnouncement({ text: '', color: 'ff0000' });
    }
  }, [enemyDamageTextQueue]);
  
  useEffect(() => {
    if (playerDamageTextQueue.length > 0) {
      const { text, displayTime, color } = playerDamageTextQueue[0];
      setPlayerDamageTextAnnouncement({ text, color });
  
      const timeout = setTimeout(() => {
        setPlayerDamageTextQueue((prevQueue) => prevQueue.slice(1));
      }, Math.max(displayTime, 0));
  
      return () => clearTimeout(timeout);
    } else {
      setPlayerDamageTextAnnouncement({ text: '', color: 'ff0000' });
    }
  }, [playerDamageTextQueue]);
  
  //START BATTLE ANIMATIONS
  
  const startBattleAnimations = () => {
    runOnUI(() => {
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
      
      enemyScale.value = withDelay(1500, withSequence(
        withSpring(0, { duration: 500 }),
        withSpring(1, { duration: 500 })
      ));
      
      startAnimationEnemy.value = withDelay(1500, withSequence(
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease }),
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease })
      ));
      
      enemyOpacityMain.value = withDelay(1500, withTiming(1, { duration: 500, easing: Easing.ease }));
      
    })();
    
    setTimeout(() => {
      playerScale.value = 1;
      enemyScale.value = 1;
      startAnimationPlayer.value = 0;
      startAnimationEnemy.value = 0;
      playerOpacityMain.value = 1;
      enemyOpacityMain.value = 1;
    }, 4000)
  };
  useEffect(() => {
    if (triggerStartAnimation.current) {
      startBattleAnimations();
    }
  }, [triggerStartAnimation.current]);
  
  
  const playerStartBattle = useAnimatedStyle(() => ({
    opacity: playerOpacityMain.value,
    transform: [{ scale: playerScale.value }],
    tintColor: startAnimationPlayer.value > 0 ? "white" : undefined,
  }));
  
  const enemyStartBattle = useAnimatedStyle(() => ({
    opacity: enemyOpacityMain.value,
    transform: [{ scale: enemyScale.value }, { scaleX: -1 }],
    tintColor: startAnimationEnemy.value > 0 ? "white" : undefined,
  }));

  
  
  //SWITCH CHARACTER ANIMATIONS
  
  const switchCharacterAnimations = () => {
    playerScale.value = withSequence(
      withTiming(1.2, { duration: 600, easing: Easing.ease }),
      withTiming(0, { duration: 600, easing: Easing.ease })
    );
    playerOpacityMain.value = withTiming(1, { duration: 300 });
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
  
  
  const getAttackTintColors = (attackClasses: string[]): string[] => {
    const classColors: { [key: string]: string } = {
      sleep: 'blue',            // Dark blue
      poison: '#6B8E23',        // Shady green
      freeze: '#1E90FF',        // Blue
      heal: '#90EE90',          // Light green
      damage: '#FF0000',        // Red
      buff: '#FFFF00',          // Yellow
      debuff: '#800080',        // Purple
      // Add other classes and their colors as needed
    };
  
    const colors = attackClasses.map(cls => classColors[cls] || '#FFFFFF'); // Default to white if not found
  
    if (colors.length === 1) {
      return [colors[0], colors[0]]; // Use the same color for start and end if only one class
    } else {
      return colors.slice(0, 2); // Use the first two colors for start and end
    }
  };

  //PLAYER ATTACKS
  
  const triggerPlayerAttacking = (attackClasses?: string[]) => {
    if (attackClasses && attackClasses.length > 0) {
      playerTintColors.value = getAttackTintColors(attackClasses);
    } else {
      playerTintColors.value = ['#FFFFFF', '#FFFFFF']; // Default tint if no classes
    }
    setIsPlayerEffectActive(true);
    playerTintAnimation.value = withSequence(
      withTiming(0, { duration: 500 }), // Animate to endColor
      withTiming(1, { duration: 1000 })  // Animate back to startColor
    );
    playerOpacity.value = withSequence(
      withTiming(1, { duration: 500 }),
      withTiming(0, { duration: 500 })
    )
    setTimeout(() => {
      setIsPlayerEffectActive(false);
    }, 900);
  };
  

  const triggerEnemyAttacking = (attackClasses?: string[]) => {
    if (attackClasses && attackClasses.length > 0) {
      enemyTintColors.value = getAttackTintColors(attackClasses);
    } else {
      enemyTintColors.value = ['#FFFFFF', '#FFFFFF']; // Default tint if no classes
    }
    setIsEnemyEffectActive(true);
    enemyTintAnimation.value = withSequence(
      withTiming(0, { duration: 500 }), // Animate to endColor
      withTiming(1, { duration: 1000 })  // Animate back to startColor
    );
    enemyOpacity.value = withSequence(
      withTiming(1, { duration: 500 }),
      withTiming(0, { duration: 500 })
    );
    setTimeout(() => {
      setIsEnemyEffectActive(false);
    }, 900);
  };
  
  //PLAYER GOT HIT

  const triggerPlayerGettingHit = (damageResults: DamageResult[] = [], attackClasses?: string[]) => {
    const animations: number[] = [];
    const textAnimations: number[] = [];
    const textOpacityAnimations: number[] = [];
    const damageQueue: { text: string, displayTime: number, color: string }[] = [];

    if (damageResults.length === 0 && attackClasses && attackClasses.length > 0) {
      playerTintColors.value = getAttackTintColors(attackClasses);
    } else {
      if (attackClasses?.includes('heal')) {
        playerTintColors.value = ['#90EE90', '#90EE90'];
      } else {
        playerTintColors.value = ['#FF0000', '#FF0000']; // Default red tint for damage
      }
    }

    for (let i = 0; i < damageResults.length; i++) {
      const dmgValue = damageResults[i];
      let textColor = '#ff0000';
      let text = '';
      let addPlayerAnimation = false;

      if (dmgValue === 'miss') {
        setFontSize(50);
        text = 'MISS';
        textColor = 'ffffff';
      } else if (typeof dmgValue === 'number') {
        setFontSize(50);
        if (dmgValue < 0) {
          text = `+${(-dmgValue).toString()}`
          textColor = '#90EE90';
          addPlayerAnimation = true
        } else {
          text = `-${dmgValue.toString()}`;
          textColor = '#ff0000';
          addPlayerAnimation = true;
        }
      } else if (typeof dmgValue === 'object' && 'effectName' in dmgValue) {
        if (dmgValue.effectName === 'critical') {
          setFontSize(50);
          text = 'critical';
          textColor = '#ffffff';
        } else {
          if (dmgValue.value !== undefined) {
            setFontSize(25);
            text = `${dmgValue.effectName} ${dmgValue.value > 0 ? '+' : ''}${dmgValue.value}`;
            textColor = '#ffff00'; // Color for buffs/debuffs
            addPlayerAnimation = true;
          } else {
            setFontSize(50);
            text = dmgValue.effectName.charAt(0).toUpperCase() + dmgValue.effectName.slice(1);
            textColor = '#ffff00'; // Color for status effects
            addPlayerAnimation = true;
          }
        }
      }

      damageQueue.push({ text: text, displayTime: 800, color: textColor });
      
      textAnimations.push(withSpring(0, { duration: 400 }), withSpring(-40, { duration: 400 }));
      textOpacityAnimations.push(withTiming(1, { duration: 400 }), withTiming(0, { duration: 400 }));
    
      if(addPlayerAnimation) {
        animations.push(withTiming(1, { duration: 400 }), withTiming(0, { duration: 400 }));
      }
    }
    setPlayerDamageTextQueue(damageQueue);
    playerDamageY.value = 0
  
  
    playerOpacity.value = withSequence(...animations);
    playerTextOpacity.value = withSequence(...textOpacityAnimations);
    playerDamageY.value = withSequence(...textAnimations);
    setIsPlayerEffectActive(true); 
    playerTintAnimation.value = withSequence(
      withTiming(0, { duration: 500 }), // Animate to endColor
      withTiming(1, { duration: 500 })  // Animate back to startColor
    );
    setTimeout(() => {
      setIsPlayerEffectActive(false);
    }, 950 + damageQueue.length * 950);
  };

  const playerDamageTaken = useAnimatedStyle(() => {
    const tintColor = interpolateColor(
      playerTintAnimation.value,
      [0, 1],
      playerTintColors.value // Animation goes from yellow to red
    );
  
    return {
      opacity: playerOpacity.value,
      tintColor: tintColor,
    };
  });

  const playerDamageTakenText = useAnimatedStyle(() => ({
    opacity: playerTextOpacity.value,
    transform: [{ translateY: playerDamageY.value }],
  }));

  //ENEMY GOT HIT

  const triggerEnemyGettingHit = (damageResults: DamageResult[] = [], attackClasses?: string[]) => {
    const animations: number[] = [];
    const textAnimations: number[] = [];
    const textOpacityAnimations: number[] = [];
    const damageQueue: { text: string, displayTime: number, color: string }[] = [];
    console.log('attackClasses', damageResults, attackClasses)

    if (damageResults.length === 0 && attackClasses && attackClasses.length > 0) {
      enemyTintColors.value = getAttackTintColors(attackClasses);
    } else {
      if (attackClasses?.includes('heal')) {
        enemyTintColors.value = ['#90EE90', '#90EE90'];
      } else {
        enemyTintColors.value = ['#FF0000', '#FF0000'];   
      }   
    }

    for (let i = 0; i < damageResults.length; i++) {
      const dmgValue = damageResults[i];
      let textColor = '#ff0000';
      let text = '';
      let addEnemyAnimation = false;

      if (dmgValue === 'miss') {
        setFontSize(50);
        text = 'MISS';
        textColor = 'ffffff';
      } else if (typeof dmgValue === 'number') {
        setFontSize(50);
        if(dmgValue < 0) {
          // Healing
          text = `+${(-dmgValue).toString()}`; // Display positive value
          textColor = '#90EE90';
          addEnemyAnimation = true;
        } else {
          // Damage
          text = `-${dmgValue.toString()}`;
          textColor = '#ff0000';
          addEnemyAnimation = true;
        }
      } else if (typeof dmgValue === 'object' && 'effectName' in dmgValue) {
        if (dmgValue.effectName === 'critical') {
          setFontSize(50);
          text = 'critical';
          textColor = '#ffffff';
        } else {
          if (dmgValue.value !== undefined) {
            setFontSize(25);
            text = `${dmgValue.effectName} ${dmgValue.value > 0 ? '+' : ''}${dmgValue.value}`;
            textColor = '#ffff00'; // Color for buffs/debuffs
            addEnemyAnimation = true;
          } else {
            setFontSize(50);
            text = dmgValue.effectName.charAt(0).toUpperCase() + dmgValue.effectName.slice(1);
            textColor = '#ffff00'; // Color for status effects
            addEnemyAnimation = true;
          }
        }
      }

      damageQueue.push({ text: text, displayTime: 600, color: textColor });

      textAnimations.push(withSpring(0, { duration: 300 }), withSpring(-40, { duration: 300 }));
      textOpacityAnimations.push(withTiming(1, { duration: 300 }), withTiming(0, { duration: 300 }));

      if (addEnemyAnimation) {
        animations.push(withTiming(1, { duration: 300 }), withTiming(0, { duration: 300 }));
      }
    }
    console.log('damageQueue', damageQueue, 'damageResults', damageResults, textAnimations, animations)
    setEnemyDamageTextQueue(damageQueue);
    enemyDamageY.value = 0;
  
    setTimeout(() => {
      enemyOpacity.value = withSequence(...animations);
      enemyTextOpacity.value = withSequence(...textOpacityAnimations);
      enemyDamageY.value = withSequence(...textAnimations);
      setIsEnemyEffectActive(true);
      enemyTintAnimation.value = withSequence(
        withTiming(0, { duration: 500 }), // Animate to endColor
        withTiming(1, { duration: 500 })  // Animate back to startColor
      );
      setTimeout(() => {
        setIsEnemyEffectActive(false);
      }, 950 + damageQueue.length * 950);
    }, 50); 
  };


  const enemyDamageTaken = useAnimatedStyle(() => {
    const tintColor = interpolateColor(
      enemyTintAnimation.value,
      [0, 1, 2],
      enemyTintColors.value // Animation goes from yellow to red
    );
  
    return {
      opacity: enemyOpacity.value,
      tintColor: tintColor,
    };
  });

  const enemyDamageTakenText = useAnimatedStyle(() => ({
    opacity: enemyTextOpacity.value,
    transform: [{ translateY: enemyDamageY.value }],
  }))
  

  //HANDLING ATTACKS BEING USED

  // useEffect(() => {
  //   if (chosenAttack !== null && chosenAttack !== '') {
  //     console.log('attack', Date.now());
  //     const handleAttack = (attackName: string) => {
  //           if (currentTurn === 'player') {
  //             triggerPlayerAttacking();
  //             setTimeout(() => {
  //               triggerEnemyGettingHit(damageResults.length, damageResults);
  //             }, 2000)
  //             } else {
  //               triggerEnemyAttacking();
  //               setTimeout(() => {
  //               triggerPlayerGettingHit(damageResults.length, damageResults);
  //             }, 2000)
  //             }
  //     };
  
  //     handleAttack(chosenAttack || "");
  //   }
  // }, [attackId]);
  


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
        <View style={styles.playerMarksRow}>
          {renderActiveMarks(playerMarks, 'player')}
        </View>
      </View>
      {enemy && 
      <View style={styles.enemyContainer}>
        <CharacterCard character={enemy} getCharacterTypeIcon={getCharacterTypeIcon} customStyles={styles.reversedCard} />
        <View style={styles.enemyMarksRow}>
          {renderActiveMarks(enemyMarks, 'enemy')}
        </View>
      </View>
      }

      <View style={styles.playerPlatform}>
        <Image source={require("../assets/platformWoods.png")} style={styles.platform} contentFit="cover" />
      </View>
      <View style={styles.enemyPlatform}>
        <Image source={require("../assets/platformWoods.png")} style={styles.platform} contentFit="cover" />
      </View>
{/* 
      <View style={styles.marksContainer}>
        <Text >player: {formatMarks(playerMarks)}</Text>
      </View>
      <View style={styles.marksEnemyContainer}>
        <Text >{formatMarks(enemyMarks)}</Text>
      </View> */}

      {/* PLAYER MODEL */}
      <Animated.Image source={{uri: playerImage}} style={[styles.attacker, playerStartBattle]} />

      {/* PLAYER MODEL ANIMATION */}
      {isPlayerEffectActive && <Animated.Image source={{uri: playerImage}} style={[styles.attacker, playerDamageTaken]} />}

      {/* ENEMY MODEL */}
      <Animated.Image source={{uri: enemyImage}} style={[styles.enemy, enemyStartBattle]} />

      {/* ENEMY MODEL ANIMATION */}
      {isEnemyEffectActive && <Animated.Image source={{uri: enemyImage}} style={[styles.enemy, enemyDamageTaken]} />}
      <Animated.View style={[styles.damagePlayerTextContainer, playerDamageTakenText]}>
        <StrokeText
          text={playerDamageTextAnnouncement.text}
          fontSize={fontSize}
          color={playerDamageTextAnnouncement.color}
          strokeColor="#000000" // Adjust stroke color as needed
          strokeWidth={4}
          fontFamily="Nunito-Black" // Adjust font family as needed
          align="center"
          numberOfLines={1}
          width={width * 0.5} // Adjust width as needed
        />
      </Animated.View>

      <Animated.View style={[styles.damageEnemyTextContainer, enemyDamageTakenText]}>
        <StrokeText
          text={enemyDamageTextAnnouncement.text}
          fontSize={fontSize}
          color={enemyDamageTextAnnouncement.color}
          strokeColor="#000000" // Adjust stroke color as needed
          strokeWidth={4}
          fontFamily="Nunito-Black" // Adjust font family as needed
          align="center"
          numberOfLines={1}
          width={width * 0.5} // Adjust width as needed
        />
      </Animated.View>
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
  damagePlayerTextContainer: {
    position: "absolute",
    top: "65%", // Adjust as needed
    left: "0%", // Adjust as needed
    alignItems: 'center',
    justifyContent: 'center',
    // Remove fontSize and color, as they belong to StrokeText
  },
  
  damageEnemyTextContainer: {
    position: "absolute",
    top: "65%", // Adjust as needed
    right: "0%", // Adjust as needed
    alignItems: 'center',
    justifyContent: 'center',
    // Remove fontSize and color, as they belong to StrokeText
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
  marksContainer: {
    position: "absolute",
    top: "40%",
    left: "0%",
    width: "100%",
    height: "100%",
  },
  marksEnemyContainer: {
    position: "absolute",
    top: "40%",
    left: "80%",
    width: "100%",
    height: "100%",
  },
  playerMarksRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    left: '3%',
  },
  enemyMarksRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align marks to the left for the enemy
    right: '7%', // Optional: Add some left margin for padding
  },
  markCardPlayer: {
    width: '15%',
    height: '40%',
    marginHorizontal: '1%',
    borderRadius: 3,
    borderBottomRightRadius: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    position: 'relative',
  },
  markCardEnemy: {
    width: '15%',
    height: '40%',
    marginHorizontal: '1%',
    borderRadius: 3,
    borderBottomLeftRadius: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    position: 'relative',
  },
  markImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  markTurns: {
    position: 'absolute',
    bottom: '-6%',
    left: '75%',
  },
});

export default forwardRef(Battleground);
