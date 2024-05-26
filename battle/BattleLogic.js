// BattleLogic.js
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useMainStore } from '../stores/useMainStore';
import attacksData from '../attacks.json';

export const useBattleLogic = (onBattleEnd, triggerStartAnimation, triggerEndAnimation) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const handleAttackRef = useRef(null);
  const [currentTurn, setCurrentTurn] = useState('player'); // 'player' or 'enemy'
  const [skillsDisabled, setSkillsDisabled] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [captureChance, setCaptureChance] = useState(0);
  const [baseCaptureChance] = useState(0.1);
  const [captureChanceModifier, setCaptureChanceModifier] = useState(1);
  const [announcementQueue, setAnnouncementQueue] = useState([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState('');


  const { team, enemy, updateEnemyHealth, updateHealth, addExperienceToTeam, addCharacterToOwned } = useMainStore(state => ({
    team: state.team,
    enemy: state.enemy,
    updateEnemyHealth: state.updateEnemyHealth,
    updateHealth: state.updateHealth,
    addExperienceToTeam: state.addExperienceToTeam,
    addCharacterToOwned: state.addCharacterToOwned
  }));

  useEffect(() => {
    console.log(2, triggerStartAnimation)
    
    console.log(3, triggerStartAnimation)
  }, [triggerStartAnimation]);


  //ANNOUNCEMENTS
  const addAnnouncement = (text, displayTime = 3000) => {
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

  //CHECKING IF THERE IS ANYONE IN THE TEAM

  useEffect(() => {
    if (team.length > 0) {
        triggerStartAnimation.current = true
        addAnnouncement('Get ready!');
        setTimeout(() => {
        }, 1000)
        
      setTimeout(() => {
        setIsInitialized(true);
      }, 3000);
    } else {
      onBattleEnd();
    }
  }, []);
  
  //WHAT IF HP GOES TO 0

  useEffect(() => {
    if (isInitialized && enemy.currentHealth <= 0) {
        addAnnouncement('Victory!');
        triggerEndAnimation.current = 'defeated';
      setTimeout(() => {
        onBattleEnd();
        addExperienceToTeam(100);
      }, 3000);
    } else if (isInitialized && team[currentPlayerIndex].currentHealth <= 0) {
      addAnnouncement(`${team[currentPlayerIndex].name} has been defeated!`, 4000);
      setSkillsDisabled(true);
      switchToNextCharacter();
    }
  }, [team[currentPlayerIndex].currentHealth, enemy.currentHealth, isInitialized]);

  //UNLOCKING UI IF PLAYER'S TURN

  useEffect(() => {
    if (currentTurn === 'player') {
      addAnnouncement(`${team[currentPlayerIndex].name} turn!`, 5000);
      setSkillsDisabled(false);
    }
  }, [currentTurn]);

  //CALCULATING DAMAGE

  const calculateDamage = (baseDamage, attackType, characterStats, multiplier) => {
    return attackType === 'normal'
      ? baseDamage * characterStats.normalDamage * multiplier
      : baseDamage * characterStats.elementalDamage * multiplier;
  };

  //HANDLING PLAYER'S ATTACK

  const handlePlayerAttack = (attackName, damage, attackType, multiplier) => {
    const player = team[currentPlayerIndex];
    const actualDamage = calculateDamage(damage, attackType, player.temporaryStats, multiplier);

    handleAttackRef.current && handleAttackRef.current(attackName, actualDamage);
    addAnnouncement(`${player.name} uses ${attackName}!`);
    setSkillsDisabled(true);
    setTimeout(() => {
      const newEnemyHealth = Math.max(0, enemy.currentHealth - actualDamage);
      updateEnemyHealth(newEnemyHealth);
      setCurrentTurn(newEnemyHealth > 0 ? 'enemy' : 'end');
      addAnnouncement(`Wild ${enemy.name} turn!`, 2000);
    }, 3000);
  };

  //HANDLING ENEMY'S ATTACK

  useEffect(() => {
    if (team[currentPlayerIndex].currentHealth > 0 && enemy.currentHealth > 0 && currentTurn === 'enemy') {
      setTimeout(() => {
        const randomAttack = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
        const attackData = attacksData.find(attack => attack.name === randomAttack.name);
        handleAttackRef.current && handleAttackRef.current(attackData.name, attackData.damage);
        addAnnouncement(`${enemy.name} uses ${randomAttack.name}!`);
        setTimeout(() => {
          updateHealth(team[currentPlayerIndex].id, team[currentPlayerIndex].currentHealth - attackData.damage);
          setCurrentTurn('player');
        }, 2000);
      }, 3000);
    }
  }, [currentTurn]);


  //CAPTURING ENEMY

  const calculateCaptureChance = () => {
    const enemyHealth = enemy.currentHealth;
    const enemyMaxHealth = enemy.baseStats.maxHealth;
    const meanPlayerMaxHealth = team.reduce((acc, char) => acc + char.baseStats.maxHealth, 0) / team.length;
    const healthRatio = (enemyMaxHealth - enemyHealth) / enemyMaxHealth;
    const healthDifferenceFactor = meanPlayerMaxHealth / enemyMaxHealth;
    const lowHealthFactor = healthRatio;
    const captureChance = baseCaptureChance + healthDifferenceFactor * 0.3 + lowHealthFactor * 0.6;
    return Math.min(1, Math.max(0, captureChance)) * captureChanceModifier;
  };

  useEffect(() => {
    setCaptureChance(calculateCaptureChance());
  }, [team, enemy.currentHealth, captureChanceModifier]);

  const handleCatchEnemy = () => {
    const chance = calculateCaptureChance();
    if (Math.random() < chance) {
      triggerEndAnimation.current = 'captureSuccess';
      addCharacterToOwned(enemy.name);
      // Alert.alert("Success", `${enemy.name} has been added to your team!`);
      setTimeout(() => {
        onBattleEnd();
      }, 7000)
      
    } else {
      triggerEndAnimation.current = 'captureFailed';
      // Alert.alert("Failed", `${enemy.name} escaped!`);
      setCaptureChanceModifier(prevModifier => Math.max(0, prevModifier * 0.75));
      setSkillsDisabled(true);
      setTimeout(() => {
        addAnnouncement(`${enemy.name} escaped!`, 2000);
        setCurrentTurn('enemy');
      }, 7000)
    }
  };

  //SWITCHING CHARACTERS

  const handleCharacterSwitch = (index) => {
    if (index !== currentPlayerIndex && team[index].currentHealth > 0) {
      setSkillsDisabled(true);
      setTimeout(() => {
        setCurrentPlayerIndex(index);
        setCurrentTurn('enemy');
      }, 500);
    }
  };

  const switchToNextCharacter = () => {
    const nextIndex = team.findIndex((char, index) => index > currentPlayerIndex && char.currentHealth > 0);
    if (nextIndex !== -1) {
      setCurrentPlayerIndex(nextIndex);
      setCurrentTurn('player');
    } else {
      const firstAvailableIndex = team.findIndex(char => char.currentHealth > 0);
      if (firstAvailableIndex !== -1) {
        setCurrentPlayerIndex(firstAvailableIndex);
        setCurrentTurn('player');
      } else {
        setTimeout(() => {
          onBattleEnd();
        }, 2000);
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
