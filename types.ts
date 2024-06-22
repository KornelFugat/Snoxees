import { ImageSourcePropType } from "react-native";

export interface BaseStats {
    maxHealth: number;
    speed: number;
    normalDamage: number;
    elementalDamage: number;
    normalDefence: number;
    elementalDefence: number;
  }
  
  export interface LevelUpStats {
    health: number;
    speed: number;
    normalDamage: number;
    elementalDamage: number;
    normalDefence: number;
    elementalDefence: number;
  }
  
  export interface Evolution {
    level: number;
    images: {
      full: string;
      portrait: string;
      head: string;
    };
  }
  
  export interface Skill {
    level: number;
    name: string;
  }

  export interface Attack {
    type: string;
    damage: number;
    accuracy: number;
    name: string;
  }

  export interface Announcement {
    text: string;
    timestamp: number;
    displayTime: number;
  }
  
  export interface Character {
    name: string;
    type: string;
    currentHealth: number;
    baseStats: BaseStats;
    levelUpStats: LevelUpStats;
    evolutions: Evolution[];
    skills: Skill[];
    level: number;
    experience: number;
    experienceForNextLevel: number;
    currentImages: {
      full: ImageSourcePropType;
      portrait: ImageSourcePropType;
      head: ImageSourcePropType;
    };
    temporaryStats: BaseStats;
    maxLevel: number;
    id: number;
  }
  
  export interface Enemy extends Character {}

  export type BattleResult = 'victory' | 'defeat' | 'captured' | 'default' | null;
  export type BattleAnimationResult = 'enemyDefeated' | 'playerDefeated' | 'lastPlayerDefeated' | 'captureSuccess' | 'captureFailure' | null;
  export interface AccountStore {
    playerName: string;
    team: Character[];
    ownedCharacters: Character[];
    enemy: Enemy | null;
    gold: number;
    diamonds: number;
    nextCharacterId: number;
    battleExperience: number;
    battleResult: BattleResult;
    updatePlayerName: (name: string) => void;
    updateGold: (amount: number) => void;
    updateDiamonds: (amount: number) => void;
    updateBattleExperience: (amount: number) => void;
    updateBattleResult: (result: string) => void;
    addCharacterToOwned: (characterName: string) => void;
    addToTeam: (characterId: number) => void;
    removeCharacterFromTeam: (characterId: number) => void;
    updateTeam: (newTeam: Character[]) => void;
    removeCharacterFromOwned: (characterId: number) => void;
    setEnemy: (enemy: Enemy) => void;
    updateEnemyHealth: (newHealth: number) => void;
    updateHealth: (characterId: number, health: number) => void;
    resetCurrentHealth: () => void;
    addExperienceToTeam: (experience: number) => void;
    levelUpCharacter: (characterId: number) => void;
  }
  