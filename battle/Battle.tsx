// Battle.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
import Battleground from './Battleground';
import BattleUI from './BattleUI';
import { Image } from 'expo-image';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import { LinearGradient } from 'expo-linear-gradient';
import { Character, Announcement, Enemy, BattleAnimationResult } from '../types';
import { enemyAttack, fetchBattleDetails, initialize, playerAttack, playerCatch, playerSwitch } from 'api/battleApi';
import { BASE_URL, fetchAccountDetails } from 'api/accountApi';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

interface BattleProps {
  onGoBack: () => void;
  onBattleEnd: () => void;
}

const Battle: React.FC<BattleProps> = ({ onGoBack, onBattleEnd }) => {

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
    const [damageResults, setDamageResults] = useState<(number | 'miss')[]>([]);
    const [isSwitching, setIsSwitching] = useState(false);
    const [captureChance, setCaptureChance] = useState(0);
    const [isPlayerAsleep, setIsPlayerAsleep] = useState(false);
    const [isEnemyAsleep, setIsEnemyAsleep] = useState(false);
    const [enemyDamageOverTime, setEnemyDamageOverTime] = useState(0);
    const [playerDamageOverTime, setPlayerDamageOverTime] = useState(0);
    const [enemyDamageOverTimeDuration, setEnemyDamageOverTimeDuration] = useState(0);
    const [playerDamageOverTimeDuration, setPlayerDamageOverTimeDuration] = useState(0);
    const [turnAnnouncement, setTurnAnnouncement] = useState<string>('');
    const [turnText, setTurnText] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const applyDamageStepByStep = async (damageResults: (number | 'miss')[], target: 'player' | 'enemy') => {
      for (let i = 0; i < damageResults.length; i++) {
          const damage = damageResults[i];
          if (damage !== 'miss') {
              setTeam(prevTeam => {
                  const newTeam = [...prevTeam];
                  if (target === 'player') {
                    newTeam[currentPlayerIndex].currentHealth = Math.max(newTeam[currentPlayerIndex].currentHealth - damage, 0);
                  }
                  return newTeam;
              });
              setEnemy(prevEnemy => {
                  if (target === 'enemy' && prevEnemy) {
                      const newEnemy = { ...prevEnemy };
                      newEnemy.currentHealth = Math.max(newEnemy.currentHealth - damage, 0);
                      return newEnemy;
                  }
                  return prevEnemy;
              });
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between each damage application
      }
      const result = await fetchBattleDetails(); // Fetch final health confirmation
      const resultTeam = await fetchAccountDetails();
      setTeam(resultTeam.team);
      setEnemy(result.enemy);
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
    console.log('currentTurn', currentTurn)
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
                const teamResult = await fetchAccountDetails()
                setTeam(teamResult.team)
                setIsLoading(false);   
            } catch (error) {
                console.error('Failed to initialize battle:', error);
            }
        };
    
        initializeBattle();
        triggerStartAnimation.current = true;
        
          const fetch = async () => {
            const result = await fetchBattleDetails();
            setCurrentTurn(result.currentTurn);
          }

          setTimeout(() => {
            fetch();
          }, 3000)
          
    }, []);

    //Player turn

    useEffect(() => {
        if (currentTurn === 'player') {
          //Announcement Player Turn
          setAnnouncementQueue([{text: `${team[currentPlayerIndex]?.name ?? 'Player'} turn!`, displayTime: 1000} ]);
          //Check if player is asleep
          const fetch0 = async () => {
            const result = await fetchBattleDetails();
            setIsEnemyAsleep(result.isEnemyAsleep);
            setPlayerDamageOverTimeDuration(result.playerDamageOverTimeDuration);
            if(result.playerDamageOverTimeDuration > 0) {
              setTeam(prevTeam => {
                const newTeam = [...prevTeam];
                newTeam[currentPlayerIndex].currentHealth = Math.max(newTeam[currentPlayerIndex].currentHealth - result.playerDamageOverTime, 0);
                return newTeam;
              });
              if (team[currentPlayerIndex].currentHealth - playerDamageOverTime < 0) {
                if(result.currentPlayerIndex !== currentPlayerIndex) {
                  setAnnouncementQueue([{text: `${team[currentPlayerIndex].name ?? 'Player2'} has been defeated!`, displayTime: 1000}, {text: `${team[result.currentPlayerIndex].name ?? 'Player1'} takes ${team[currentPlayerIndex].name ?? 'Player2'} place!`, displayTime: 1000} ]);
                  setIsSwitching(result.isSwitching);
                  setCurrentPlayerIndex(result.currentPlayerIndex);
                  setIsUIEnabled(true);
                } else {
                  setTimeout(() => {
                    setCurrentTurn(result.currentTurn)
                  }, 3000)
                }
              }
            }
            if (!result.isPlayerAsleep) {
              setIsUIEnabled(true);
            } else {
              setAnnouncementQueue([{text: `${team[currentPlayerIndex]?.name ?? 'Player'} sleeps!`, displayTime: 3000} ]);
              setTimeout(() => {
                setCurrentTurn(result.currentTurn)
              }, 3000)
            }
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
        try {
            const result = await playerAttack(attackName);
            console.log('player attack result', result)
            setIsUIEnabled(false);
            setChosenAttack(result.chosenAttack);
            setCaptureChance(result.captureChance);
            setIsEnemyAsleep(result.isEnemyAsleep);
            setEnemyDamageOverTimeDuration(result.enemyDamageOverTimeDuration);
            if(result.chosenAttack) {
              setAnnouncementQueue([{text: `${team[currentPlayerIndex]?.name ?? 'Player'} uses ${result.chosenAttack}!`, displayTime: 1000} ]);
            }
            setDamageResults(result.damageResults);
            setAttackId(attackId + 1);
            setTimeout(async () => {
              await applyDamageStepByStep(result.damageResults, 'enemy');      
            }, 1500)

            setTimeout(() => {
              setChosenAttack(null)
            }, 1000)
            if (result.currentTurn === 'end' && enemy) {
              setTimeout(() => {
                setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} has been defeated`, displayTime: 2000} ]);
                setTriggerEndAnimation({ type: 'enemyDefeated', id: triggerEndAnimation.id + 1 });
              }, 3000)
            }
            setTimeout(() => {
              setChosenAttack(null);
              setCurrentTurn(result.currentTurn);
              console.log('zmiana tury', Date.now())
            }, 3500)
            
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
        }, 2500)
      } catch (error) {
          console.error('Failed to fetch battle details:', error);
      }
    }
      fetch();

    const fetch2 = async () => {
      try {
          const result = await fetchBattleDetails();
          setCurrentTurn(result.currentTurn);
      } catch (error) {
          console.error('Failed to fetch battle details:', error);
      }
  }
    setTimeout(() => {
      fetch2();
    }, 8000)
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
          setCurrentTurn(result.currentTurn);
      } catch (error) {
          console.error('Failed to fetch battle details:', error);
      }
  }
    setTimeout(() => {
      fetch2();
    }, 8000)
  }


  //ENEMY TURN

  //Enemy attack

  useEffect(() => {
    if (currentTurn === 'enemy' && enemy) {  
          const fetch = async () => {
            try {
                const result = await fetchBattleDetails();
                console.log('resultenemy', result)
                setEnemyDamageOverTimeDuration(result.enemyDamageOverTimeDuration);
                if(result.enemyDamageOverTimeDuration > 0) {
                  setEnemy(prevEnemy => {
                        const newEnemy = { ...prevEnemy };
                        if (newEnemy.currentHealth !== undefined) {
                          newEnemy.currentHealth = Math.max(newEnemy.currentHealth - enemyDamageOverTime, 0);
                      }
                        return newEnemy as Enemy | null;
                  });
                  if (result.currentTurn === 'end') {
                    setTriggerEndAnimation({ type: 'enemyDefeated', id: triggerEndAnimation.id + 1 });
                    setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} turn!`, displayTime: 1000},{text: `${enemy.name ?? 'Enemy'} has been defeated`, displayTime: 1000} ]);
                    setTimeout(() => {
                      setCurrentTurn(result.currentTurn);
                    }, 2000)
                  }
                }
                if (result.isEnemyAsleep) {
                  setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} turn!`, displayTime: 1000},{text: `${enemy.name ?? 'Enemy'} sleeps!`, displayTime: 1000} ]);
                } else {
                  setChosenAttack(result.chosenAttack);
                  if(result.chosenAttack) {
                    setAnnouncementQueue([{text: `${enemy.name ?? 'Enemy'} turn!`, displayTime: 1000},{text: `${enemy.name ?? 'Enemy'} uses ${result.chosenAttack}!`, displayTime: 1000} ]);
                  }
                  setDamageResults(result.damageResults);
                  setAttackId(attackId + 1);
                  setEnemy(result.enemy);
                  setTimeout(async () => {
                    await applyDamageStepByStep(result.damageResults, 'player');
                  }, 1500)
                  if (result.currentPlayerIndex !== currentPlayerIndex) {
                    setTimeout(() => {
                      setAnnouncementQueue([{text: `${team[currentPlayerIndex].name ?? 'Player2'} has been defeated!`, displayTime: 2000}, {text: `${team[result.currentPlayerIndex].name ?? 'Player1'} takes ${team[currentPlayerIndex].name ?? 'Player2'} place!`, displayTime: 1000} ]);
                      setIsSwitching(result.isSwitching);
                      setTimeout(() => {
                        setCurrentPlayerIndex(result.currentPlayerIndex);
                        setIsUIEnabled(true);
                      }, 3000)
                    }, 3000)
                  }
                  setTimeout(() => {
                    console.log('we here')
                    console.log(result)
                    setChosenAttack(null);
                    if (result.currentTurn === 'end') {
                      setAnnouncementQueue([{text: `${team[currentPlayerIndex].name ?? 'Player2'} has been defeated!`, displayTime: 3000} ]);
                      setTriggerEndAnimation({ type: 'lastPlayerDefeated', id: triggerEndAnimation.id + 1 });
                        setCurrentTurn(result.currentTurn);
                    } else {
                      setTimeout(() => {
                        setCurrentTurn(result.currentTurn);
                      },3000)
                    }

                  }, 3000)
                }
              } catch (error) {
                console.error('Failed to fetch battle details:', error);
              }
            }
              fetch();
            
        
    }
}, [currentTurn]);

useEffect(() => {
  console.log('isSwitching', isSwitching)
  console.log('currentTurn', currentTurn)
}, [currentTurn, isSwitching])

useEffect(() => {
  if (currentTurn === 'player') {
    setTurnAnnouncement('Turn 1');
    setTurnText('Your turn');
  } else if (currentTurn === 'enemy') {
    setTurnAnnouncement('Turn 2');
    setTurnText('Enemy turn');
  }
}, [currentTurn]);

useEffect(() => {
  setTimeout(() => {
    if (currentTurn === 'player') {
      setTurnAnnouncement('');
      setTurnText('');
    } else if (currentTurn === 'enemy') {
      setTurnAnnouncement('');
      setTurnText('');
    }
  }, 2000)
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
        isEnemyAsleep={isEnemyAsleep}
        isPlayerAsleep={isPlayerAsleep}
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
