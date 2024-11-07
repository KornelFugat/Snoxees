
export type ScreenType = 'home' | 'team' | 'characters' | 'battle' | 'afterBattle' | 'screen' | 'town' | 'snoexes';

export interface BattlegroundHandle {
  triggerPlayerGettingHit: ( damageResults?: DamageResult[], attackClasses?: string[]) => void;
  triggerEnemyGettingHit: ( damageResults?: DamageResult[], attackClasses?: string[]) => void;
  triggerPlayerAttacking: (attackClasses?: string[]) => void;
  triggerEnemyAttacking: (attackClasses?: string[]) => void;
}

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

  export interface PlayerMark {
    isOn: boolean;
    value?: number;
    turns?: number;
    damage?: number;
  }
  
  export interface PlayerMarks {
    asleep: PlayerMark;
    freeze: PlayerMark;
    poison: PlayerMark;
    paralysis: PlayerMark;
    defEleBuff: PlayerMark;
    defEleDebuff: PlayerMark;
    defNorBuff: PlayerMark;
    defNorDebuff: PlayerMark;
    dmgEleBuff: PlayerMark;
    dmgEleDebuff: PlayerMark;
    dmgNorBuff: PlayerMark;
    dmgNorDebuff: PlayerMark;
  }
  
  export type EnemyMarks = PlayerMarks;

  export type DamageResult = number | 'miss' | { effectName: string; value?: number };

  export interface BattleStore {
    isInitialized: boolean;
    enemy: Enemy | null;
    currentTurn: 'start' | 'player' | 'enemy' | 'end';
    currentAnnouncement: Announcement[];
    isUIEnabled: boolean;
    currentPlayerIndex: number;
    chosenAttack: string | null;
    damageResults: DamageResult[];
    changedPlayerStats: { stat: string, newValue: number }[];
    changedEnemyStats: { stat: string, newValue: number }[];
    isSwitching: boolean;
    captureChance: number;
    baseCaptureChance: number;
    captureChanceModifier: number;
    turnCounter: number;
    result: BattleResult | null;
    experienceGained: number;
    playerMarks: PlayerMarks;
    enemyMarks: EnemyMarks;
    setIsInitialized: (isInitialized: boolean) => void;
    setEnemy: (enemy: Enemy | null) => void;
    setCurrentAnnouncement: (announcement: Announcement[] | null) => void;
    setIsUIEnabled: (enabled: boolean) => void;
    updateEnemyHealth: (newHealth: number) => void;
    setCurrentTurn: (turn: 'player' | 'enemy' | 'end') => void;
    setCurrentPlayerIndex: (index: number) => void;
    setChosenAttack: (attack: string | null) => void;
    setIsSwitching: (isSwitching: boolean) => void;
    setCaptureChance: (chance: number) => void;
    setCaptureChanceModifier: (modifier: number) => void;
    setTurnCounter: (counter: number) => void;
    setPlayerMarks: (marks: Partial<PlayerMarks>) => void;
    setEnemyMarks: (marks: Partial<EnemyMarks>) => void;
  }
  
  export interface Skill {
    level: number;
    name: string;
  }

  export interface Attack {
    name: string;
    class: string[];
    type: string;
    damage: number;
    multiplier: number;
    accuracy: number;
    ticks: number;
    damageOverTime: boolean;
    damageOverTimeDuration?: number;
    sleep: boolean;
    buff?: {stat: string, value: number};
    debuff?: {stat: string, value: number};
    upgrade?: string;
    upgradeDescription?: string;
    description: string;
  }

  export interface Announcement {
    text: string;
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
      full: string;
      portrait: string;
      head: string;
    };
    temporaryStats: BaseStats;
    trainingCost: number;
    evolveCost: number;
    maxLevel: number;
    id: number;
  }
  
  export interface Enemy extends Character {}

  export type CurrentTurn = 'start' | 'player' | 'enemy' | 'end';
  export type BattleResult = 'victory' | 'defeat' | 'captured' | 'default' | null;
  export type BattleAnimationResult = 'enemyDefeated' | 'playerDefeated' | 'lastPlayerDefeated' | 'captureSuccess' | 'captureFailure' | null;
  export interface AccountStore {
    playerName: string;
    team: Character[];
    ownedCharacters: Character[];
    gold: number;
    diamonds: number;
    nextCharacterId: number;
    fetchAccountDetails: () => void;
    updatePlayerName: (name: string) => void;
    updateGold: (amount: number) => void;
    updateDiamonds: (amount: number) => void;
    addCharacterToOwned: (characterName: string) => void;
    addToTeam: (characterId: number) => void;
    removeCharacterFromTeam: (characterId: number) => void;
    removeCharacterFromOwned: (characterId: number) => void;
    // setEnemy: (enemy: Enemy) => void;
    // updateEnemyHealth: (newHealth: number) => void;
    updateHealth: (characterId: number, health: number) => void;
    resetCurrentHealth: () => void;
    addExperienceToTeam: (experience: number) => void;
    levelUpCharacter: (characterId: number) => void;
    evolveCharacter: (characterId: number) => void;
  }
  