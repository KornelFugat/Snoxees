// BattleLogic.js
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useMainStore } from '../stores/useMainStore';
import attacksData from '../attacks.json';
import { Announcement } from 'types';

export const useBattleLogic = (
  onBattleEnd: () => void,
  triggerStartAnimation: React.MutableRefObject<boolean | null>,
  triggerEndAnimation: React.MutableRefObject<string | null>
) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const handleAttackRef = useRef<((attackName: string, damage: number) => void) | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy' | 'end'>('player');
  const [skillsDisabled, setSkillsDisabled] = useState(true);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [captureChance, setCaptureChance] = useState(0);
  const [baseCaptureChance] = useState(0.1);
  const [captureChanceModifier, setCaptureChanceModifier] = useState(1);
  const [announcementQueue, setAnnouncementQueue] = useState<Announcement[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState('');
  const [turnCounter, setTurnCounter] = useState(0);

  const { team, enemy, updateEnemyHealth, updateHealth, battleResult, addExperienceToTeam, addCharacterToOwned, updateBattleExperience, updateBattleResult } = useMainStore(state => ({
    team: state.team,
    enemy: state.enemy,
    updateBattleExperience: state.updateBattleExperience,
    updateEnemyHealth: state.updateEnemyHealth,
    updateHealth: state.updateHealth,
    addExperienceToTeam: state.addExperienceToTeam,
    addCharacterToOwned: state.addCharacterToOwned,
    updateBattleResult: state.updateBattleResult,
    battleResult: state.battleResult
  }));

  useEffect(() => {
    console.log(2, triggerStartAnimation);
    console.log(3, triggerStartAnimation);
  }, [triggerStartAnimation]);

  // ANNOUNCEMENTS
  const addAnnouncement = (text: string, displayTime = 3000) => {
    const timestamp = Date.now();
    setAnnouncementQueue(prevQueue => [...prevQueue, { text, timestamp, displayTime }]);
  };

  useEffect(() => {
    if (announcementQueue.length > 0) {
      const { text, timestamp, displayTime } = announcementQueue[0];
      setCurrentAnnouncement(text);
      const timeElapsed = Date.now() - timestamp;

      const timeout = setTimeout(() => {
        setAnnouncementQueue(prevQueue => prevQueue.slice(1));
      }, Math.max(displayTime - timeElapsed, 0));

      return () => clearTimeout(timeout);
    } else {
      setCurrentAnnouncement('');
    }
  }, [announcementQueue]);

  // CHECKING IF THERE IS ANYONE IN THE TEAM
  useEffect(() => {
    if (team.length > 0) {
      triggerStartAnimation.current = true;
      addAnnouncement('Get ready!');
      setTimeout(() => {
        setIsInitialized(true);
      }, 3000);
    } else {
      onBattleEnd();
    }
  }, []);

  useEffect(() => {
    console.log('skillsDisabled', skillsDisabled);
  }, [skillsDisabled]);

  // WHAT IF HP GOES TO 0
  useEffect(() => {
    if (isInitialized && (enemy?.currentHealth ?? 0) <= 0) {
      addAnnouncement(`${enemy?.name ?? 'Enemy'} has been defeated!`, 3000);
      triggerEndAnimation.current = 'enemyDefeated';
      setTimeout(() => {
        updateBattleResult('victory');
        updateBattleExperience(4);
        addExperienceToTeam(4);
        onBattleEnd();
      }, 5000);
    } else if (isInitialized && team[currentPlayerIndex]?.currentHealth <= 0) {
      addAnnouncement(`${team[currentPlayerIndex]?.name ?? 'Player'} has been defeated!`, 4000);
      setSkillsDisabled(true);
      switchToNextCharacter();
    }
  }, [
    team[currentPlayerIndex]?.currentHealth,
    enemy?.currentHealth,
    isInitialized
  ]);

  useEffect(() => {
    console.log('turnCounter', turnCounter);
  }, [turnCounter]);

  // UNLOCKING UI IF PLAYER'S TURN
  useEffect(() => {
    if (currentTurn === 'player' && turnCounter === 0) {
      console.log('start');
      addAnnouncement(`${team[currentPlayerIndex]?.name ?? 'Player'} turn!`, 5000);
      setTimeout(() => {
        setSkillsDisabled(false);
      }, 4500);
      setTurnCounter(1);
      
    } else if (currentTurn === 'player' && turnCounter !== 0) {
      console.log('start2');
      addAnnouncement(`${team[currentPlayerIndex]?.name ?? 'Player'} turn!`, 2500);
      setTimeout(() => {
        setSkillsDisabled(false);
      }, 1500);
    }
  }, [currentTurn]);

  // CALCULATING DAMAGE
  const calculateDamage = (
    baseDamage: number,
    attackType: string,
    characterStats: { normalDamage: number; elementalDamage: number },
    multiplier: number
  ) => {
    return attackType === 'normal'
      ? baseDamage * characterStats.normalDamage * multiplier
      : baseDamage * characterStats.elementalDamage * multiplier;
  };

  // HANDLING PLAYER'S ATTACK
  const handlePlayerAttack = (attackName: string, damage: number, attackType: string, multiplier: number) => {
    const player = team[currentPlayerIndex];
    const actualDamage = calculateDamage(damage, attackType, player.temporaryStats, multiplier);

    handleAttackRef.current && handleAttackRef.current(attackName, actualDamage);
    addAnnouncement(`${player.name} uses ${attackName}!`);
    setSkillsDisabled(true);
    setTimeout(() => {
      const newEnemyHealth = Math.max(0, (enemy?.currentHealth ?? 0) - actualDamage);
      addAnnouncement(newEnemyHealth > 0 ? `Wild ${enemy?.name ?? 'Enemy'} turn!` : 'Victory!', 2000);
      newEnemyHealth > 0 ? updateBattleResult('victory') : null;
    }, 3000);
    setTimeout(() => {
      const newEnemyHealth = Math.max(0, (enemy?.currentHealth ?? 0) - actualDamage);
      updateEnemyHealth(newEnemyHealth);
      setCurrentTurn(newEnemyHealth > 0 ? 'enemy' : 'end');
    }, 3500);
  };

  useEffect(() => {
    console.log('current turn', currentTurn);
  }, [currentTurn]);

  // HANDLING ENEMY'S ATTACK
  useEffect(() => {
    if (team[currentPlayerIndex]?.currentHealth > 0 && (enemy?.currentHealth ?? 0) > 0 && currentTurn === 'enemy') {
      setTimeout(() => {
        const randomAttack = enemy?.skills[Math.floor(Math.random() * enemy.skills.length)];
        const attackData = attacksData.find(attack => attack.name === randomAttack?.name);
        handleAttackRef.current && handleAttackRef.current(attackData?.name ?? '', attackData?.damage ?? 0);
        addAnnouncement(`${enemy?.name ?? 'Enemy'} uses ${randomAttack?.name ?? 'Attack'}!`, 3500);
        setTimeout(() => {
          const newPlayerHealth = (team[currentPlayerIndex]?.currentHealth ?? 0) - (attackData?.damage ?? 0);
          updateHealth(team[currentPlayerIndex]?.id, newPlayerHealth);
          setCurrentTurn(newPlayerHealth > 0 ? 'player' : 'end');
        }, 3500);
      }, 2000);
    }
  }, [currentTurn]);

  // CAPTURING ENEMY
  const calculateCaptureChance = () => {
    const enemyHealth = enemy?.currentHealth ?? 0;
    const enemyMaxHealth = enemy?.baseStats.maxHealth ?? 1;
    const meanPlayerMaxHealth = team.reduce((acc, char) => acc + char.baseStats.maxHealth, 0) / team.length;
    const healthRatio = (enemyMaxHealth - enemyHealth) / enemyMaxHealth;
    const healthDifferenceFactor = meanPlayerMaxHealth / enemyMaxHealth;
    const lowHealthFactor = healthRatio;
    const captureChance = baseCaptureChance + healthDifferenceFactor * 0.3 + lowHealthFactor * 0.6;
    return Math.min(1, Math.max(0, captureChance)) * captureChanceModifier;
  };

  useEffect(() => {
    setCaptureChance(calculateCaptureChance());
  }, [team, enemy?.currentHealth, captureChanceModifier]);

  const handleCatchEnemy = () => {
    const chance = calculateCaptureChance();
    setSkillsDisabled(true);
    addAnnouncement(`Capturing ${enemy?.name ?? 'Enemy'}...`, 6300);
    if (Math.random() < chance) {
      triggerEndAnimation.current = 'captureSuccess';
      addCharacterToOwned(enemy?.name ?? 'Enemy');
      setTimeout(() => {
        addAnnouncement(`${enemy?.name ?? 'Enemy'} captured!`, 8500);
        updateBattleResult('captured')
      }, 1000)
      setTimeout(() => {
        updateBattleExperience(5);
        addExperienceToTeam(5);
        onBattleEnd();
      }, 8500)
      
    } else {
      triggerEndAnimation.current = 'captureFailed';
      setCaptureChanceModifier(prevModifier => Math.max(0, prevModifier * 0.75));
      setSkillsDisabled(true);
      setTimeout(() => {
        addAnnouncement(`${enemy?.name ?? 'Enemy'} escaped!`, 2000);
        addAnnouncement(`${enemy?.name ?? 'Enemy'} turn!`, 4000);
        setCurrentTurn('enemy');
      }, 6600)
    }
  };

  useEffect(() => {
    console.log("battleResult", battleResult)
  }, [battleResult])

  // SWITCHING CHARACTERS
  const handleCharacterSwitch = (index: number) => {
    if (index !== currentPlayerIndex && team[index]?.currentHealth > 0) {
      setSkillsDisabled(true);
      addAnnouncement(`${team[index]?.name ?? 'Player'} takes ${team[currentPlayerIndex]?.name ?? 'Player'}'s place!`, 3000);
      triggerEndAnimation.current = 'playerDefeated';
      setTimeout(() => {
        setCurrentPlayerIndex(index);
        setCurrentTurn('enemy');
      }, 2000);
      setTimeout(() => {
        addAnnouncement(`${enemy?.name ?? 'Enemy'} turn!`, 4000);
      }, 3000);
    }
  };

  const switchToNextCharacter = () => {
    const nextIndex = team.findIndex((char, index) => index > currentPlayerIndex && char.currentHealth > 0);
    if (nextIndex !== -1) {
      triggerEndAnimation.current = 'playerDefeated';
      setTimeout(() => {
        setCurrentPlayerIndex(nextIndex);
      }, 2000)
      setCurrentTurn('player');
    } else {
      const firstAvailableIndex = team.findIndex(char => char.currentHealth > 0);
      if (firstAvailableIndex !== -1) {
        triggerEndAnimation.current = 'playerDefeated';
        setTimeout(() => {
          setCurrentPlayerIndex(firstAvailableIndex);
        }, 2000)
        setCurrentTurn('player');
      } else {
        triggerEndAnimation.current = 'lastPlayerDefeated';
        addAnnouncement('Defeat!', 5000);
        updateBattleResult('defeat')
        setTimeout(() => {
          updateBattleExperience(3);
          addExperienceToTeam(3);
          onBattleEnd();
        }, 4000);
      }
    }
  };

  return {
    handleAttackRef,
    currentTurn,
    skillsDisabled,
    currentPlayerIndex,
    captureChance,
    announcement: currentAnnouncement,
    handlePlayerAttack,
    handleCatchEnemy,
    handleCharacterSwitch,
  };
};
