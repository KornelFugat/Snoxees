// BattleLogic.js
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import attacksData from '../attacks.json';
import { Announcement, Character, Enemy } from 'types';
import { fetchBattleDetails, initialize } from 'api/battleApi';

export const useBattleLogic = (
  onBattleEnd: () => void,
  triggerStartAnimation: React.MutableRefObject<boolean | null>,
  triggerEndAnimation: React.MutableRefObject<string | null>
) => {
  const handleAttackRef = useRef<((attackName: string, damage: number) => void) | null>(null);
  const [skillsDisabled, setSkillsDisabled] = useState(true);
  

  // const { team, updateHealth, battleResult, fetchAccountDetails, addExperienceToTeam, addCharacterToOwned, updateBattleExperience, updateBattleResult } = useAccountStore(state => ({
  //   team: state.team,
  //   fetchAccountDetails: state.fetchAccountDetails,
  //   updateBattleExperience: state.updateBattleExperience,
  //   updateHealth: state.updateHealth,
  //   addExperienceToTeam: state.addExperienceToTeam,
  //   addCharacterToOwned: state.addCharacterToOwned,
  //   updateBattleResult: state.updateBattleResult,
  //   battleResult: state.battleResult
  // }));

  // const {
  //   enemy, 
  //   isInitialized, 
  //   currentTurn, 
  //   currentPlayerIndex, 
  //   captureChance, 
  //   baseCaptureChance, 
  //   captureChanceModifier, 
  //   turnCounter,
  //   updateEnemyHealth, 
  //   setIsInitialized, 
  //   setCurrentTurn, 
  //   setCurrentPlayerIndex, 
  //   setCaptureChance, 
  //   setCaptureChanceModifier,
  //   setTurnCounter} = useBattleStore(state => ({
  //   enemy: state.enemy,
  //   isInitialized: state.isInitialized,
  //   currentTurn: state.currentTurn,
  //   currentPlayerIndex: state.currentPlayerIndex,
  //   captureChance: state.captureChance,
  //   baseCaptureChance: state.baseCaptureChance,
  //   captureChanceModifier: state.captureChanceModifier,
  //   turnCounter: state.turnCounter,
  //   updateEnemyHealth: state.updateEnemyHealth,
  //   setIsInitialized: state.setIsInitialized,
  //   setCurrentTurn: state.setCurrentTurn,
  //   setCurrentPlayerIndex: state.setCurrentPlayerIndex,
  //   setCaptureChance: state.setCaptureChance,
  //   setCaptureChanceModifier: state.setCaptureChanceModifier,
  //   setTurnCounter: state.setTurnCounter
  // }));

  const [team, setTeam] = useState<Character[]>([]);
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [announcementQueue, setAnnouncementQueue] = useState<Announcement[] | null>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string>('');
  const [isUIEnabled, setIsUIEnabled] = useState(false);
  const [captureChance, setCaptureChance] = useState(0);

  useEffect(() => {
    const initializeBattle = async () => {
        try {
            const result = await initialize();
            setEnemy(result.enemy);
            setAnnouncementQueue(result.currentAnnouncement);
            setIsUIEnabled(result.isUIEnabled);
            setCaptureChance(result.captureChance);
            console.log('Battle initialized', result.enemy, result.isUIEnabled, result.captureChance);
        } catch (error) {
            console.error('Failed to initialize battle:', error);
        }
    };

    initializeBattle();

    // const fetchDetails = async () => {
    //     setTimeout(async () => {
    //         try {
    //             const result = await fetchBattleDetails();
    //             console.log('Battle details fetched', result.enemy, result.isUIEnabled, result.captureChance);
    //         } catch (error) {
    //             console.error('Failed to fetch battle details:', error);
    //         }
    //     }, 5000);
    // };

    // fetchDetails();
}, []);

useEffect(() => {
    console.log('Battle initialized222', enemy, isUIEnabled, captureChance);
}, [isUIEnabled, enemy, captureChance]);


  // // ANNOUNCEMENTS
  // const addAnnouncement = (text: string, displayTime = 3000) => {
  //   const timestamp = Date.now();
  //   setAnnouncementQueue(prevQueue => [...prevQueue, { text, timestamp, displayTime }]);
  // };

  // useEffect(() => {
  //   if (announcementQueue.length > 0) {
  //     const { text, timestamp, displayTime } = announcementQueue[0];
  //     setCurrentAnnouncement(text);
  //     const timeElapsed = Date.now() - timestamp;

  //     const timeout = setTimeout(() => {
  //       setAnnouncementQueue(prevQueue => prevQueue.slice(1));
  //     }, Math.max(displayTime - timeElapsed, 0));

  //     return () => clearTimeout(timeout);
  //   } else {
  //     setCurrentAnnouncement('');
  //   }
  // }, [announcementQueue]);

  // // CHECKING IF THERE IS ANYONE IN THE TEAM
  // useEffect(() => {
  //   setCurrentTurn('player');
  //   fetchAccountDetails();
  //   if (team.length > 0) {
  //     triggerStartAnimation.current = true;
  //     addAnnouncement('Get ready!');
  //     setTimeout(() => {
  //       setIsInitialized(true);
  //     }, 3000);
  //   } else {
  //     onBattleEnd();
  //   }
  // }, []);

  // useEffect(() => {
  //   console.log('skillsDisabled', skillsDisabled);
  // }, [skillsDisabled]);


  // // WHAT IF HP GOES TO 0
  // useEffect(() => {
  //   if (isInitialized && (enemy?.currentHealth ?? 0) <= 0) {
  //     addAnnouncement(`${enemy?.name ?? 'Enemy'} has been defeated!`, 3000);
  //     triggerEndAnimation.current = 'enemyDefeated';
  //     setTimeout(() => {
  //       updateBattleResult('victory');
  //       updateBattleExperience(4);
  //       addExperienceToTeam(20);
  //       onBattleEnd();
  //     }, 5000);
  //   } else if (isInitialized && team[currentPlayerIndex]?.currentHealth <= 0) {
  //     addAnnouncement(`${team[currentPlayerIndex]?.name ?? 'Player'} has been defeated!`, 4000);
  //     setSkillsDisabled(true);
  //     switchToNextCharacter();
  //   }
  // }, [
  //   team[currentPlayerIndex]?.currentHealth,
  //   enemy?.currentHealth,
  //   isInitialized
  // ]);

  // useEffect(() => {
  //   console.log('turnCounter', turnCounter);
  // }, [turnCounter]);

  // // UNLOCKING UI IF PLAYER'S TURN
  // useEffect(() => {
  //   if (currentTurn === 'player' && turnCounter === 0) {
  //     console.log('start');
  //     addAnnouncement(`${team[currentPlayerIndex]?.name ?? 'Player'} turn!`, 5000);
  //     setTimeout(() => {
  //       setSkillsDisabled(false);
  //     }, 4500);
  //     setTurnCounter(1);
      
  //   } else if (currentTurn === 'player' && turnCounter !== 0) {
  //     console.log('start2');
  //     addAnnouncement(`${team[currentPlayerIndex]?.name ?? 'Player'} turn!`, 2500);
  //     setTimeout(() => {
  //       setSkillsDisabled(false);
  //     }, 1500);
  //   }
  // }, [currentTurn]);

  // // CALCULATING DAMAGE
  // const calculateDamage = (
  //   baseDamage: number,
  //   attackType: string,
  //   characterStats: { normalDamage: number; elementalDamage: number },
  //   multiplier: number
  // ) => {
  //   return attackType === 'normal'
  //     ? baseDamage * characterStats.normalDamage * multiplier
  //     : baseDamage * characterStats.elementalDamage * multiplier;
  // };

  // // HANDLING PLAYER'S ATTACK
  // const handlePlayerAttack = (attackName: string, damage: number, attackType: string, multiplier: number) => {
  //   fetchAccountDetails();
  //   const player = team[currentPlayerIndex];
  //   const actualDamage = calculateDamage(damage, attackType, player.temporaryStats, multiplier);

  //   handleAttackRef.current && handleAttackRef.current(attackName, actualDamage);
  //   addAnnouncement(`${player.name} uses ${attackName}!`);
  //   setSkillsDisabled(true);
  //   setTimeout(() => {
  //     const newEnemyHealth = Math.max(0, (enemy?.currentHealth ?? 0) - actualDamage);
  //     addAnnouncement(newEnemyHealth > 0 ? `Wild ${enemy?.name ?? 'Enemy'} turn!` : 'Victory!', 2000);
  //     newEnemyHealth > 0 ? updateBattleResult('victory') : null;
  //   }, 3000);
  //   setTimeout(() => {
  //     const newEnemyHealth = Math.max(0, (enemy?.currentHealth ?? 0) - actualDamage);
  //     updateEnemyHealth(newEnemyHealth);
  //     setCurrentTurn(newEnemyHealth > 0 ? 'enemy' : 'end');
  //   }, 3500);
  // };

  // useEffect(() => {
  //   console.log('current turn', currentTurn);
  // }, [currentTurn]);

  // // HANDLING ENEMY'S ATTACK
  // useEffect(() => {
  //   fetchAccountDetails();
  //   if (team[currentPlayerIndex]?.currentHealth > 0 && (enemy?.currentHealth ?? 0) > 0 && currentTurn === 'enemy') {
  //     setTimeout(() => {
  //       const randomAttack = enemy?.skills[Math.floor(Math.random() * enemy.skills.length)];
  //       const attackData = attacksData.find(attack => attack.name === randomAttack?.name);
  //       handleAttackRef.current && handleAttackRef.current(attackData?.name ?? '', attackData?.damage ?? 0);
  //       addAnnouncement(`${enemy?.name ?? 'Enemy'} uses ${randomAttack?.name ?? 'Attack'}!`, 3500);
  //       setTimeout(() => {
  //         const newPlayerHealth = (team[currentPlayerIndex]?.currentHealth ?? 0) - (attackData?.damage ?? 0);
  //         updateHealth(team[currentPlayerIndex]?.id, newPlayerHealth);
  //         setCurrentTurn(newPlayerHealth > 0 ? 'player' : 'end');
  //       }, 3500);
  //     }, 2000);
  //   }
  // }, [currentTurn]);

  // // CAPTURING ENEMY

  // const handleCatchEnemy = () => {
  //   fetchAccountDetails();
  //   setSkillsDisabled(true);
  //   addAnnouncement(`Capturing ${enemy?.name ?? 'Enemy'}...`, 6300);
  //   if (Math.random() < captureChance) {
  //     console.log('cap', captureChance)
  //     triggerEndAnimation.current = 'captureSuccess';
  //     addCharacterToOwned(enemy?.name ?? 'Enemy');
  //     setTimeout(() => {
  //       addAnnouncement(`${enemy?.name ?? 'Enemy'} captured!`, 8500);
  //       updateBattleResult('captured')
  //     }, 1000)
  //     setTimeout(() => {
  //       updateBattleExperience(5);
  //       addExperienceToTeam(5);
  //       onBattleEnd();
  //     }, 8500)
      
  //   } else {
  //     triggerEndAnimation.current = 'captureFailure';
  //     setCaptureChanceModifier(captureChanceModifier * 1.5);
  //     setSkillsDisabled(true);
  //     setTimeout(() => {
  //       addAnnouncement(`${enemy?.name ?? 'Enemy'} escaped!`, 2000);
  //       addAnnouncement(`${enemy?.name ?? 'Enemy'} turn!`, 4000);
  //       setCurrentTurn('enemy');
  //     }, 6600)
  //   }
  // };

  // useEffect(() => {
  //   console.log("battleResult", battleResult)
  // }, [battleResult])

  // // SWITCHING CHARACTERS
  // const handleCharacterSwitch = (index: number) => {
  //   fetchAccountDetails();
  //   if (index !== currentPlayerIndex && team[index]?.currentHealth > 0) {
  //     setSkillsDisabled(true);
  //     addAnnouncement(`${team[index]?.name ?? 'Player'} takes ${team[currentPlayerIndex]?.name ?? 'Player'}'s place!`, 3000);
  //     triggerEndAnimation.current = 'playerDefeated';
  //     setTimeout(() => {
  //       setCurrentPlayerIndex(index);
  //       setCurrentTurn('enemy');
  //     }, 2000);
  //     setTimeout(() => {
  //       addAnnouncement(`${enemy?.name ?? 'Enemy'} turn!`, 4000);
  //     }, 3000);
  //   }
  // };

  // const switchToNextCharacter = () => {
  //   fetchAccountDetails();
  //   const nextIndex = team.findIndex((char, index) => index > currentPlayerIndex && char.currentHealth > 0);
  //   if (nextIndex !== -1) {
  //     triggerEndAnimation.current = 'playerDefeated';
  //     setTimeout(() => {
  //       setCurrentPlayerIndex(nextIndex);
  //     }, 2000)
  //     setCurrentTurn('player');
  //   } else {
  //     const firstAvailableIndex = team.findIndex(char => char.currentHealth > 0);
  //     if (firstAvailableIndex !== -1) {
  //       triggerEndAnimation.current = 'playerDefeated';
  //       setTimeout(() => {
  //         setCurrentPlayerIndex(firstAvailableIndex);
  //       }, 2000)
  //       setCurrentTurn('player');
  //     } else {
  //       triggerEndAnimation.current = 'lastPlayerDefeated';
  //       addAnnouncement('Defeat!', 5000);
  //       updateBattleResult('defeat')
  //       setTimeout(() => {
  //         updateBattleExperience(3);
  //         addExperienceToTeam(3);
  //         onBattleEnd();
  //       }, 4000);
  //     }
  //   }
  // };

  return {
    handleAttackRef,
    skillsDisabled,
    captureChance,
    announcement: currentAnnouncement,
  };
};
