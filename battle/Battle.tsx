// Battle.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
import Battleground from './Battleground';
import BattleUI from './BattleUI';
import { Image } from 'expo-image';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import { LinearGradient } from 'expo-linear-gradient';
import { Character, Announcement, Enemy, BattleAnimationResult, PlayerMarks, EnemyMarks, BattlegroundHandle, Attack, DamageResult } from '../types';
import { enemyAttack, fetchBattleDetails, initialize, playerAttack, playerCatch, playerSwitch } from 'api/battleApi';
import { BASE_URL, fetchAccountDetails } from 'api/accountApi';
import attacksData from '../attacks.json';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface BattleProps {
  onGoBack: () => void;
  onBattleEnd: () => void;
}

const Battle: React.FC<BattleProps> = ({ onGoBack, onBattleEnd }) => {
    const battlegroundRef = useRef<BattlegroundHandle>(null);
    const triggerStartAnimation = useRef(false);
    const triggerSwitchAnimations = useRef(false);
    const [triggerEndAnimation, setTriggerEndAnimation] = useState<{ type: BattleAnimationResult | null, id: number }>({ type: null, id: 0 });
    const [team, setTeam] = useState<Character[]>([]);
    const [enemy, setEnemy] = useState<Enemy | null>(null);
    const [announcementQueue, setAnnouncementQueue] = useState<Announcement[]>([]);
    const [currentAnnouncement, setCurrentAnnouncement] = useState<string>('');
    const [isUIEnabled, setIsUIEnabled] = useState(false);
    const [currentTurn, setCurrentTurn] = useState<'start' |'player' | 'enemy' | 'end'>('start');
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [chosenAttack, setChosenAttack] = useState<string | null>('');
    const [attackId, setAttackId] = useState(0);
    const [damageResults, setDamageResults] = useState<DamageResult[]>([]);
    const [isSwitching, setIsSwitching] = useState(false);
    const [captureChance, setCaptureChance] = useState(0);
    const [playerMarks, setPlayerMarks] = useState<PlayerMarks>({
      asleep: { isOn: false },
      freeze: { isOn: false },
      poison: { isOn: false, turns: 0, damage: 0 },
      paralysis: { isOn: false, turns: 0, damage: 0 },
      defEleBuff: { isOn: false, value: 0 },
      defEleDebuff: { isOn: false, value: 0 },
      defNorBuff: { isOn: false, value: 0 },
      defNorDebuff: { isOn: false, value: 0 },
      dmgEleBuff: { isOn: false, value: 0 },
      dmgEleDebuff: { isOn: false, value: 0 },
      dmgNorBuff: { isOn: false, value: 0 },
      dmgNorDebuff: { isOn: false, value: 0 },
    });
    
    const [enemyMarks, setEnemyMarks] = useState<EnemyMarks>({
      asleep: { isOn: false },
      freeze: { isOn: false },
      poison: { isOn: false, turns: 0, damage: 0 },
      paralysis: { isOn: false, turns: 0, damage: 0 },
      defEleBuff: { isOn: false, value: 0 },
      defEleDebuff: { isOn: false, value: 0 },
      defNorBuff: { isOn: false, value: 0 },
      defNorDebuff: { isOn: false, value: 0 },
      dmgEleBuff: { isOn: false, value: 0 },
      dmgEleDebuff: { isOn: false, value: 0 },
      dmgNorBuff: { isOn: false, value: 0 },
      dmgNorDebuff: { isOn: false, value: 0 },
    });
    const [turnAnnouncement, setTurnAnnouncement] = useState<string>('');
    const [turnText, setTurnText] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const resettedMarks = {
      asleep: { isOn: false },
      freeze: { isOn: false },
      poison: { isOn: false, turns: 0, damage: 0 },
      paralysis: { isOn: false, turns: 0, damage: 0 },
      defEleBuff: { isOn: false, value: 0 },
      defEleDebuff: { isOn: false, value: 0 },
      defNorBuff: { isOn: false, value: 0 },
      defNorDebuff: { isOn: false, value: 0 },
      dmgEleBuff: { isOn: false, value: 0 },
      dmgEleDebuff: { isOn: false, value: 0 },
      dmgNorBuff: { isOn: false, value: 0 },
      dmgNorDebuff: { isOn: false, value: 0 },
    }

    const applyDamageStepByStep = async (damageResults: DamageResult[], target: 'player' | 'enemy') => {
      for (let i = 0; i < damageResults.length; i++) {
        const damage = damageResults[i];
        if (damage !== 'miss' && typeof damage === 'number') {
          if (target === 'player') {
            setTeam(prevTeam => {
              const newTeam = [...prevTeam];
              const currentPlayer = newTeam[currentPlayerIndex];
              const maxHealth = currentPlayer.baseStats.maxHealth;
              currentPlayer.currentHealth = Math.min(
                Math.max(currentPlayer.currentHealth - damage, 0),
                maxHealth
              );
              return newTeam;
            });
          } else if (target === 'enemy') {
            setEnemy(prevEnemy => {
              if (prevEnemy) {
                const newEnemy = { ...prevEnemy };
                const maxHealth = newEnemy.baseStats.maxHealth;
                newEnemy.currentHealth = Math.min(
                  Math.max(newEnemy.currentHealth - damage, 0),
                  maxHealth
                );
                return newEnemy;
              }
              return prevEnemy;
            });
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };


    //announcements
    useEffect(() => {
      if (announcementQueue.length > 0) {
        const { text, displayTime } = announcementQueue[0];
        setCurrentAnnouncement(text);
    
        const timeout = setTimeout(() => {
          setAnnouncementQueue((prevQueue) => prevQueue.slice(1));
        }, Math.max(displayTime, 0));
    
        return () => clearTimeout(timeout);
      } else {
        setCurrentAnnouncement('');
      }
    }, [announcementQueue]);

    useEffect(() => {
      if (isSwitching) {
        triggerSwitchAnimations.current = true;
      } else {
          triggerSwitchAnimations.current = false;
      }
  }, [isSwitching]);


  useEffect(() => {
      console.log('current turn', currentTurn, Date.now())
  }, [currentTurn])
    //initializing battle

    useEffect(() => {
        const initializeBattle = async () => {
            try {
                const result = await initialize();       
                setEnemy(result.enemy);
                setAnnouncementQueue([{text: 'Get Ready!', displayTime: 3000}]);
                setCurrentPlayerIndex(result.currentPlayerIndex);
                setChosenAttack(result.chosenAttack);
                setDamageResults(result.damageResults);
                setCaptureChance(result.captureChance);
                setTimeout(() => {
                  setCurrentTurn(result.currentTurn);
                }, 3000)
                const teamResult = await fetchAccountDetails()
                setTeam(teamResult.team)
                setIsLoading(false);   
            } catch (error) {
                console.error('Failed to initialize battle:', error);
            }
        };
    
        initializeBattle();
        triggerStartAnimation.current = true;
    }, []);

    //Player turn

    useEffect(() => {
        if (currentTurn === 'player') {
          console.log('player turn testing', Date.now())
          //Announcement Player Turn
          setAnnouncementQueue([{text: `${team[currentPlayerIndex]?.name ?? 'Player'} turn!`, displayTime: 1000} ]);
          //Check if player is asleep
          const fetch0 = async () => {
            const result = await fetchBattleDetails();
            setEnemyMarks(result.enemyMarks);
            setPlayerMarks(result.playerMarks);
            let playerDefeated = false;
            console.log('player marks', result.playerMarks)
            if(result.playerMarks.poison.isOn && result.playerMarks.poison.damage) {
                console.log('player is poisoned', Date.now())
                let damage = [result.playerMarks.poison.damage];
                battlegroundRef.current?.triggerPlayerGettingHit(
                  damage,
                  ['poison']
                );
                applyDamageStepByStep(damage, 'player');
              }


            if(result.playerMarks.paralysis.isOn && result.playerMarks.paralysis.damage) {
                console.log('player is paralised', Date.now())
                let damage = [result.playerMarks.paralysis.damage];
                battlegroundRef.current?.triggerPlayerGettingHit(
                  damage,
                  ['paralyse']
                );
                applyDamageStepByStep(damage, 'player');
              }

              setTimeout(async () => {
                const updatedTeam = [...team];
                const playerHealth = updatedTeam[currentPlayerIndex].currentHealth;

                if (playerHealth <= 0) {

                  if(result.currentPlayerIndex !== currentPlayerIndex) {
                    console.log('player defeated 1', Date.now())
                    playerDefeated = true;
                      setAnnouncementQueue([{text: `${team[currentPlayerIndex].name ?? 'Player2'} has been defeated!`, displayTime: 2500}, {text: `${team[result.currentPlayerIndex].name ?? 'Player1'} takes ${team[currentPlayerIndex].name ?? 'Player2'} place!`, displayTime: 2500} ]);
                      setIsSwitching(result.isSwitching);
                    setTimeout(() => {
                      setCurrentPlayerIndex(result.currentPlayerIndex);
                      setPlayerMarks(resettedMarks);
                    }, 3000)
                    setTimeout(() => {
                      setIsUIEnabled(true);
                    }, 3500)
                  } else {
                    console.log('player defeated', Date.now())
                    playerDefeated = true;
                    setAnnouncementQueue([
                      {
                        text: `${team[currentPlayerIndex].name ?? 'Player'} has been defeated!`,
                        displayTime: 3000,
                      },
                    ]);
                    setTriggerEndAnimation({
                      type: 'lastPlayerDefeated',
                      id: triggerEndAnimation.id + 1,
                    });

                    const waitForServerUpdate = async () => {
                      const serverUpdateDelay = 1500; // Adjust to match server delay
                      await new Promise((resolve) => setTimeout(resolve, serverUpdateDelay));
      
                      const result2 = await fetchBattleDetails();
                      if (result2.currentTurn === 'end') {
                        setCurrentTurn(result2.currentTurn);
                      } else {
                        console.log('Server has not updated currentTurn yet, retrying...');
                        // Optionally implement a retry mechanism here
                      }
                    };
      
                    waitForServerUpdate();
                  }
                }
                
                if (!playerDefeated) {
                  console.log('player turn testing while shouldnt', Date.now())
                  if (playerMarks.asleep.isOn) {
                      setAnnouncementQueue([{text: `${team[currentPlayerIndex]?.name ?? 'Player'} sleeps!`, displayTime: 3000} ]);
                    setTimeout(() => {
                      const fetch2 = async () => {
                        try {
                            const result2 = await fetchBattleDetails();
                            setCurrentTurn(result2.currentTurn);
                        } catch (error) {
                            console.error('Failed to fetch battle details:', error);
                        }
                      }
                      fetch2();
                    }, 2100)
                  } else if (playerMarks.freeze.isOn) {
                      setAnnouncementQueue([{text: `${team[currentPlayerIndex]?.name ?? 'Player'} is frozen!`, displayTime: 3000} ]);
                    setTimeout(() => {
                      const fetch2 = async () => {
                        try {
                            const result2 = await fetchBattleDetails();
                            setCurrentTurn(result2.currentTurn);
                        } catch (error) {
                            console.error('Failed to fetch battle details:', error);
                        }
                      }
                      fetch2();
                    }, 2100)
                  } else {
                      setIsUIEnabled(true)
                  }
                }
              }, 1500)




          }
          fetch0();
          }

    }, [currentTurn]);


  //PLAYER TURN

  useEffect(() => {
    if (currentTurn === 'player') {
      setIsSwitching(false);
    }
  }, [currentTurn, currentPlayerIndex]);

  //Player attack

    const handlePlayerAttack = async (attackName: string) => {
      console.log('player attacks', Date.now())
        try {
            const result = await playerAttack(attackName);
            setIsUIEnabled(false);
            setChosenAttack(result.chosenAttack);

            const attackData = attacksData.find(a => a.name === result.chosenAttack);
            const attackClasses = attackData ? attackData.class : [];
            const isHealingAttack = attackClasses.includes('heal') || attackClasses.includes('buff');
            setCaptureChance(result.captureChance);
            battlegroundRef.current?.triggerPlayerAttacking(attackClasses);
            if(result.chosenAttack) {
              setAnnouncementQueue([{text: `${team[currentPlayerIndex]?.name ?? 'Player'} uses ${result.chosenAttack}!`, displayTime: 1000} ]);
            }
            setDamageResults(result.damageResults);
            setAttackId(attackId + 1);
            setTimeout(async () => {
              setPlayerMarks(result.playerMarks);
              setEnemyMarks(result.enemyMarks);
              if (isHealingAttack) {
                // Display healing over the player
                battlegroundRef.current?.triggerPlayerGettingHit(
                  result.damageResults,
                  attackClasses
                );
                await applyDamageStepByStep(result.damageResults, 'player');
              } else {
                // Display damage over the enemy
                battlegroundRef.current?.triggerEnemyGettingHit(
                  result.damageResults,
                  attackClasses
                );
                await applyDamageStepByStep(result.damageResults, 'enemy');
              }    
            }, 2000)

            setTimeout(() => {
              setChosenAttack(null)
            }, 1000)
            if (result.currentTurn === 'end' && enemy) {
              setTimeout(() => {
                setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} has been defeated!`, displayTime: 2000} ]);
                setTriggerEndAnimation({ type: 'enemyDefeated', id: triggerEndAnimation.id + 1 });
              }, 3500 + 1000 * result.damageResults.length)
            }
            setTimeout(() => {
              const fetch2 = async () => {
                try {
                    const result2 = await fetchBattleDetails();
                    setCurrentTurn(result2.currentTurn);
                } catch (error) {
                    console.error('Failed to fetch battle details:', error);
                }
              }
              fetch2();
              console.log('zmiana tury', Date.now())
              setChosenAttack(null);
            }, 3500 + 1000 * result.damageResults.length)
            
        } catch (error) {
            console.error('Failed to execute player attack:', error);
        }
    };

  //Player switch

  const handleCharacterSwitch = (characterId: number) => {
    setIsSwitching(true);
    const fetch = async () => {
      try {
        const result = await playerSwitch(characterId); 
        setAnnouncementQueue([{text: `${team[characterId]?.name ?? 'Player'} takes ${team[currentPlayerIndex]?.name} place!`, displayTime: 3000} ]);
        setIsUIEnabled(false);
        setTimeout(() => {
          setCurrentPlayerIndex(result.currentPlayerIndex);
          setPlayerMarks(resettedMarks);
          setDamageResults(result.damageResults);
        }, 3000)
      } catch (error) {
          console.error('Failed to fetch battle details:', error);
      }
    }
      fetch();

    const fetch2 = async () => {
      try {
          const result = await fetchBattleDetails();
          console.log('swap', result)
          setCurrentTurn(result.currentTurn);
      } catch (error) {
          console.error('Failed to fetch battle details:', error);
      }
  }
    setTimeout(() => {
      console.log('turn enemy after swap', Date.now())
      fetch2();
    }, 4000)
    };

  //Player catch

  const handleCatchEnemy = () => {
    if (enemy) {
      setAnnouncementQueue([{text: `Trying to capture ${enemy.name}`, displayTime: 3000} ]);
    }
    setIsUIEnabled(false);
    const fetch = async () => {
      try {
          const result = await playerCatch();
          if (result.currentTurn === 'player') {
            setTriggerEndAnimation({ type: 'captureFailure', id: triggerEndAnimation.id + 1 });
            setTimeout(() => {
              setCaptureChance(result.captureChance);
              setAnnouncementQueue([{text: `Capture attempt failed!`, displayTime: 3000} ]);
            }, 5500)
          } else if (result.currentTurn === 'end') {
            setTriggerEndAnimation({ type: 'captureSuccess', id: triggerEndAnimation.id + 1 });
            setTimeout(() => {
              setAnnouncementQueue([{text: `Capture attempt succeeded!`, displayTime: 3000} ]);
            }, 6500)
          }
      } catch (error) {
          console.error('Failed to fetch battle details:', error);
      }
    }
    fetch();

    const fetch2 = async () => {
      try {
          const result = await fetchBattleDetails();
          setTimeout(() => {
            setCurrentTurn(result.currentTurn);
          }, 4000)
      } catch (error) {
          console.error('Failed to fetch battle details:', error);
      }
  }
    setTimeout(() => {
      fetch2();
    }, 3500)
  }


  //ENEMY TURN

  //Enemy attack

  useEffect(() => {
    if (currentTurn === 'enemy' && enemy) {  
      console.log('enemy turn', Date.now())
      setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} turn!`, displayTime: 1500}]);
          const fetch = async () => {
            try {
                const result = await fetchBattleDetails();
                setDamageResults(result.damageResults);
              
                let enemyDefeated = false;
                
                if(result.enemyMarks.poison.isOn && result.enemyMarks.poison.damage) {
                    if (result.enemyMarks.poison.damage) {
                      let damage = [result.enemyMarks.poison.damage];
                      battlegroundRef.current?.triggerEnemyGettingHit(
                        damage,
                        ['poison']
                      );
                      applyDamageStepByStep(damage, 'enemy');
                      console.log('enemy poisoned', Date.now())
                    }      
                  if (result.currentTurn === 'end' || enemy.currentHealth - result.enemyMarks.poison.damage < 0) {
                    enemyDefeated = true;
                    setTimeout(() => {
                      setTriggerEndAnimation({ type: 'enemyDefeated', id: triggerEndAnimation.id + 1 });
                      setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} has been defeated!`, displayTime: 1000} ]);
                      console.log('ending1')
                        const fetch2 = async () => {
                          try {
                              const result2 = await fetchBattleDetails();
                              setCurrentTurn(result2.currentTurn);
                          } catch (error) {
                              console.error('Failed to fetch battle details:', error);
                          }
                        }
                        fetch2();
                    }, 3000)
                  }
                }

                if(result.enemyMarks.paralysis.isOn && result.enemyMarks.paralysis.damage) {
                  let damage = [result.enemyMarks.paralysis.damage];
                  applyDamageStepByStep(damage, 'enemy');
                  if (result.currentTurn === 'end') {
                    setTriggerEndAnimation({ type: 'enemyDefeated', id: triggerEndAnimation.id + 1 });
                    setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} turn!`, displayTime: 1000},{text: `${enemy.name ?? 'Enemy'} has been defeated!`, displayTime: 1000} ]);
                    setTimeout(() => {
                      setCurrentTurn(result.currentTurn);
                    }, 2000)
                  }
                }
                if(!enemyDefeated) {
                  if (enemyMarks.asleep.isOn || enemyMarks.freeze.isOn) {
                    if (enemyMarks.asleep.isOn) {
                      console.log('enemy is asleep', Date.now())
                      setTimeout(() => {
                        setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} sleeps!`, displayTime: 1000} ]);             
                      }, 1500)
                    } else if (enemyMarks.freeze.isOn) {
                      console.log('enemy is frozen', Date.now())
                      setTimeout(() => {
                        setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} is frozen!`, displayTime: 1000} ]);             
                      }, 1500)
                    }
                    setTimeout(() => {
                      setChosenAttack(null);
                      const fetch2 = async () => {
                        try {
                            const result2 = await fetchBattleDetails();
                            setCurrentTurn(result2.currentTurn);
                            if (result2.currentTurn === 'end') {
                              setAnnouncementQueue([{text: `${team[currentPlayerIndex].name ?? 'Player2'} has been defeated!`, displayTime: 3000} ]);
                              setTriggerEndAnimation({ type: 'lastPlayerDefeated', id: triggerEndAnimation.id + 1 });
                            } 
                        } catch (error) {
                            console.error('Failed to fetch battle details:', error);
                        }
                      }
                      fetch2();
                    }, 3200 + damageResults.length * 1000);

                  } else {
                    setChosenAttack(result.chosenAttack);
                    const attackData = attacksData.find(a => a.name === result.chosenAttack);
                    const attackClasses = attackData ? attackData.class : [];
                    const isHealingAttack = attackClasses.includes('heal') || attackClasses.includes('buff');
                    if(result.chosenAttack) {
                      console.log('enemy attack', Date.now())
                      setTimeout(() => {
                        battlegroundRef.current?.triggerEnemyAttacking(attackClasses);
                        setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} uses ${result.chosenAttack}!`, displayTime: 1000} ]);                      
                      }, 1000)
                      setAttackId(attackId + 1);
                    }
                    setTimeout(async () => {
                      setPlayerMarks(result.playerMarks);
                      setEnemyMarks(result.enemyMarks);
                      if (isHealingAttack) {
                        // Display healing over the enemy
                        battlegroundRef.current?.triggerEnemyGettingHit(
                          result.damageResults,
                          attackClasses
                        );
                         applyDamageStepByStep(result.damageResults, 'enemy');
                      } else {
                        // Display damage over the player
                        battlegroundRef.current?.triggerPlayerGettingHit(
                          result.damageResults,
                          attackClasses
                        );
                         applyDamageStepByStep(result.damageResults, 'player');
                      }
                    }, 2000)

                    const damageAnimationDuration = result.damageResults.length * 1000;
                    await new Promise((resolve) => setTimeout(resolve, damageAnimationDuration + 3200));
                    const updatedResult = await fetchBattleDetails();
                    let playerDefeated = false;
                    console.log('updatedResult')

                    if (updatedResult.currentPlayerIndex !== currentPlayerIndex) {
                      // Player is defeated and there's a substitute
                      playerDefeated = true;
                
                      setIsSwitching(updatedResult.isSwitching);
                      setAnnouncementQueue([
                        {
                          text: `${team[currentPlayerIndex].name ?? 'Player'} has been defeated!`,
                          displayTime: 2000,
                        },
                        {
                          text: `${team[updatedResult.currentPlayerIndex].name ?? 'Substitute'} enters the battle!`,
                          displayTime: 2000,
                        },
                      ]);
                
                      await new Promise((resolve) => setTimeout(resolve, 3000));
                
                      setCurrentPlayerIndex(updatedResult.currentPlayerIndex);
                      setPlayerMarks(resettedMarks);
                
                      setTimeout(() => {
                        setIsUIEnabled(true);
                      }, 500);
                    } else if (updatedResult.currentTurn === 'end') {
                      // Player is defeated with no substitutes (Game Over)
                      playerDefeated = true;
                
                      setAnnouncementQueue([
                        {
                          text: `${team[currentPlayerIndex].name ?? 'Player'} has been defeated!`,
                          displayTime: 3000,
                        },
                      ]);
                      setTriggerEndAnimation({
                        type: 'lastPlayerDefeated',
                        id: triggerEndAnimation.id + 1,
                      });
                
                      // Wait for the server to confirm the game over state
                      const serverUpdateDelay = 1000; // Adjust to match server delay
                      await new Promise((resolve) => setTimeout(resolve, serverUpdateDelay));
                
                      const finalResult = await fetchBattleDetails();
                      if (finalResult.currentTurn === 'end') {
                        setCurrentTurn(finalResult.currentTurn);
                      } else {
                        console.error('Server did not update currentTurn to end as expected');
                        // Optionally implement a retry mechanism here
                      }
                    }
                
                    if (!playerDefeated) {
                      // Fetch the next turn from the server
                      const nextTurnResult = await fetchBattleDetails();
                      setCurrentTurn(nextTurnResult.currentTurn);
                    }
                  }
                }
              } catch (error) {
                console.error('Failed to fetch battle details:', error);
              }
            }
              fetch();
            
        
    }
}, [currentTurn]);


useEffect(() => {
  let announcement = '';
  let text = '';

  if (currentTurn === 'player') {
      announcement = 'Turn 1';
      text = 'Your turn';
  } else if (currentTurn === 'enemy') {
      announcement = 'Turn 2';
      text = 'Enemy turn';
  }

  setTurnAnnouncement(announcement);
  setTurnText(text);

  const timer = setTimeout(() => {
      setTurnAnnouncement('');
      setTurnText('');
  }, 2000);

  return () => clearTimeout(timer);
}, [currentTurn]);

  useEffect(() => {
    if (currentTurn === 'end') {
      const fetch = async () => {
        try {
            const result = await fetchBattleDetails();
            switch (result.result) {
              case 'victory':
                setTimeout(() => {
                  setAnnouncementQueue([{text: 'Victory!', displayTime: 3000} ]);
                }, 2000)
                break;
              case 'defeat':
                setTimeout(() => {
                  setAnnouncementQueue([{text: 'Defeat!', displayTime: 3000} ]);
                }, 2000)
                break;
              case 'captured':
                setAnnouncementQueue([{text: 'Captured!', displayTime: 3000} ]);
            }
        } catch (error) {
            console.error('Failed to fetch battle details:', error);
        }
      }
      setTimeout(() => {
        fetch();
      }, 1000)
      setTimeout(() => {
        onBattleEnd();
      }, 4000)
    }
  }, [currentTurn]);
    
  const handleEnd = () => {
    onBattleEnd();
  }
    
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }


 
  return (
    <ImageBackground
      source={require('../assets/backgroundtoptest.png')}
      resizeMode="cover"
      style={styles.container}
    >
      {enemy &&
        <Battleground
        ref={battlegroundRef}
        team={team}
        enemy={enemy}
        currentPlayerIndex={currentPlayerIndex}
        chosenAttack={chosenAttack}
        attackId={attackId}
        damageResults={damageResults}
        currentTurn={currentTurn}
        playerImage={`${BASE_URL}${team[currentPlayerIndex].currentImages.full}`}
        enemyImage={`${BASE_URL}${enemy.currentImages.full}`}
        triggerStartAnimation={triggerStartAnimation}
        triggerSwitchAnimations={triggerSwitchAnimations}
        triggerEndAnimation={triggerEndAnimation}
        playerMarks={playerMarks}
        enemyMarks={enemyMarks}
    />
      }
      
      <BattleUI
          onAttackPress={handlePlayerAttack} // Pass handlePlayerAttack to BattleUI
          skills={team.length > 0 ? team[currentPlayerIndex].skills.filter(skill => skill.level <= team[currentPlayerIndex].level) : []}
          team={team}
          onCharacterSwitch={handleCharacterSwitch}
          currentPlayerIndex={currentPlayerIndex}
          disabled={!isUIEnabled}
          captureChance={captureChance}
          handleCatchEnemy={() => {}}
          announcement={currentAnnouncement}
      />
      <Image source={require('../assets/catch-book.png')} style={styles.catchBook} contentFit="cover" />
      <LinearGradient colors={!isUIEnabled ? ['#B4947E', '#56607A'] : ['#7A563D', '#20293F']} style={[styles.catchButton, !isUIEnabled && styles.disabledCatchButton]}>
        <TouchableOpacity onPress={handleCatchEnemy} disabled={!isUIEnabled} style={styles.innerCatchButton}>
          <StrokeText
            text="Capture!"
            fontSize={responsiveFontSize(15)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={3}
            fontFamily="Nunito-Black"
            align="center"
            numberOfLines={1}
            width={width * 0.2}
          />
        </TouchableOpacity>
      </LinearGradient>
      <Text style={[isUIEnabled && styles.captureChanceText, !isUIEnabled && styles.disabledCaptureChance]}>
        {`${(captureChance * 100).toFixed(0)}%`}
      </Text>
      <TouchableOpacity onPress={handleEnd} style={styles.innerCatchButton}>
          <StrokeText
            text="END!"
            fontSize={responsiveFontSize(15)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={3}
            fontFamily="Nunito-Black"
            align="center"
            numberOfLines={1}
            width={width * 0.2}
          />
        </TouchableOpacity>
      <Text style={styles.turnAnnouncement}>
        {turnAnnouncement}
      </Text>
      <Text style={styles.turnText}>
        {turnText}
      </Text>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0208', // Dark background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0208', // Dark background
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: responsiveFontSize(18),
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust based on your UI needs
    right: 20, // Adjust based on your UI needs
    backgroundColor: '#1F1F1F', // Dark button background
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6C541E', // Bronze border
  },
  catchBook: {
    position: 'absolute',
    top: '2%',
    width: '20%',
    height: '13%',
  },
  catchButton: {
    position: 'absolute',
    top: '14%', // Adjust based on your UI needs
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6C541E', // Bronze border
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCatchButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledCatchButton: {
    position: 'absolute',
    opacity: 1,
    top: '14%',
    backgroundColor: '#97A1B9',
    borderColor: '#333',
    padding: 5,
    borderRadius: 5,
    borderWidth: 3,
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureChanceText: {
    position: 'absolute',
    color: '#FFFFFF', // White text
    fontSize: responsiveFontSize(10), // Adjust font size as needed
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
    backgroundColor: '#20293F',
    borderRadius: 5,
    padding: 5,
    top: '17.5%',
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    paddingTop: 0,
  },
  disabledCaptureChance: {
    opacity: 1,
    position: 'absolute',
    color: '#FFFFFF', // White text
    fontSize: responsiveFontSize(10), // Adjust font size as needed
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
    backgroundColor: '#56607A',
    borderRadius: 5,
    padding: 5,
    top: '18%',
    paddingTop: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#333',
  },
  text: {
    color: '#FFFFFF', // White text
    fontSize: 10, // Adjust font size as needed
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Nunito-Black',
  },
  turnAnnouncement: {
    position: 'absolute',
    color: '#FFFFFF', // White text
    fontSize: responsiveFontSize(15), // Adjust font size as needed
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
    borderRadius: 5,
    padding: 5,
    top: '20%',
  },
  turnText: {
    position: 'absolute',
    color: '#FFFFFF', // White text
    fontSize: responsiveFontSize(15), // Adjust font size as needed
    textAlign: 'center',
    fontFamily: 'Nunito-Black',
    borderRadius: 5,
    padding: 5,
    top: '25%',
  },
});

export default Battle;
