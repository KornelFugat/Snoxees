import { ImageSourcePropType } from 'react-native';
import { characters } from '../charactersData';
import { AccountStore, Character, Enemy } from '../types';

export const createAccountStore = (set: any, get: any): AccountStore => ({
  playerName: '',
  team: [],
  ownedCharacters: [],
  enemy: null,
  gold: 0,
  diamonds: 0,
  nextCharacterId: 1,
  battleExperience: 0,
  battleResult: null,
  updatePlayerName: (name: string) => set({ playerName: name }),
  updateGold: (amount: number) => set((state: AccountStore) => ({ gold: state.gold + amount })),
  updateDiamonds: (amount: number) => set((state: AccountStore) => ({ diamonds: state.diamonds + amount })),
  updateBattleExperience: (amount: number) => set({ battleExperience: amount }),
  updateBattleResult: (result: string) => set(() => ({ battleResult: result })),
  addCharacterToOwned: (characterName: string) => {
    const character = characters[characterName as keyof typeof characters];
    if (character) {
      const newCharacter: Character = {
        ...character,
        id: get().nextCharacterId,
        level: 9,
        experience: 0,
        experienceForNextLevel: 15,
        currentImages: {
          full: character.currentImages.full as ImageSourcePropType,
          portrait: character.currentImages.portrait as ImageSourcePropType,
          head: character.currentImages.head as ImageSourcePropType
        },
        temporaryStats: character.baseStats,
      };
      set((state: AccountStore) => ({
        ownedCharacters: [...state.ownedCharacters, newCharacter],
        nextCharacterId: state.nextCharacterId + 1,
      }));
    }
  },
  addToTeam: (characterId: number) => {
    const character = get().ownedCharacters.find((char: Character) => char.id === characterId);
    if (character && get().team.length < 4 && !get().team.some((char: Character) => char.id === characterId)) {
      set((state: AccountStore) => ({ team: [...state.team, character] }));
    }
  },
  removeCharacterFromTeam: (characterId: number) => {
    set((state: AccountStore) => ({
      team: state.team.filter((char: Character) => char.id !== characterId),
    }));
  },
  updateTeam: (newTeam: Character[]) => {
    set({ team: newTeam });
  },
  removeCharacterFromOwned: (characterId: number) => {
    set((state: AccountStore) => ({
      ownedCharacters: state.ownedCharacters.filter((char: Character) => char.id !== characterId),
      team: state.team.filter((char: Character) => char.id !== characterId),
    }));
  },
  setEnemy: (enemy: Enemy) => set({ enemy }),
  updateEnemyHealth: (newHealth: number) => {
    const safeHealth = Math.max(0, newHealth);
    const updatedEnemy = get().enemy ? { ...get().enemy, currentHealth: safeHealth } : null;
    set({ enemy: updatedEnemy });
  },
  updateHealth: (characterId: number, health: number) => {
    let updatedTeam = get().team.map((char: Character) => {
      if (char.id === characterId) {
        return {
          ...char,
          currentHealth: Math.max(0, health),
        };
      }
      return char;
    });

    let updatedOwnedCharacters = get().ownedCharacters.map((ownedChar: Character) => {
      const updatedChar = updatedTeam.find((teamChar: Character) => teamChar.id === ownedChar.id);
      return updatedChar || ownedChar;
    });

    set({
      team: updatedTeam,
      ownedCharacters: updatedOwnedCharacters,
    });
  },
  resetCurrentHealth: () => {
    const updatedCharacters = get().ownedCharacters.map((character: Character) => ({
      ...character,
      currentHealth: character.baseStats.maxHealth,
    }));

    const updatedTeam = get().team.map((teamChar: Character) =>
      updatedCharacters.find((char: Character) => char.id === teamChar.id) || teamChar
    );

    set({
      ownedCharacters: updatedCharacters,
      team: updatedTeam,
    });
  },
  addExperienceToTeam: (experience: number) => {
    const updatedTeam = get().team.map((character: Character) => {
      if (character.level < 30 && character.experience < character.experienceForNextLevel) {
        let newExperience = character.experience + experience;
        if (newExperience >= character.experienceForNextLevel) {
          newExperience = character.experienceForNextLevel;
        }
        return { ...character, experience: newExperience };
      }
      return character;
    });

    const updatedOwnedCharacters = get().ownedCharacters.map((ownedChar: Character) => {
      const updatedChar = updatedTeam.find((teamChar: Character) => teamChar.id === ownedChar.id);
      return updatedChar || ownedChar;
    });

    set({
      ownedCharacters: updatedOwnedCharacters,
      team: updatedTeam,
    });
  },
  levelUpCharacter: (characterId: number) => {
    set((state: AccountStore) => {
      let updatedOwnedCharacters = state.ownedCharacters.map((char: Character) => {
        if (char.id === characterId && char.level < char.maxLevel) {
          const newLevel = char.level + 1;
          let newImages = char.evolutions[0].images;

          if (newLevel >= 21) {
            newImages = char.evolutions[2].images;
          } else if (newLevel >= 11) {
            newImages = char.evolutions[1].images;
          }

          const newBaseStats = {
            maxHealth: char.baseStats.maxHealth + char.levelUpStats.health,
            speed: char.baseStats.speed + char.levelUpStats.speed,
            normalDamage: char.baseStats.normalDamage + char.levelUpStats.normalDamage,
            elementalDamage: char.baseStats.elementalDamage + char.levelUpStats.elementalDamage,
            normalDefence: char.baseStats.normalDefence + char.levelUpStats.normalDefence,
            elementalDefence: char.baseStats.elementalDefence + char.levelUpStats.elementalDefence,
          };

          return {
            ...char,
            level: newLevel,
            experience: 0,
            experienceForNextLevel: Math.floor(char.experienceForNextLevel * 1.2),
            baseStats: newBaseStats,
            currentHealth: char.baseStats.maxHealth + char.levelUpStats.health,
            currentImages: newImages,
            temporaryStats: newBaseStats,
          };
        }
        return char;
      });

      const updatedTeam = state.team.map((teamChar: Character) =>
        updatedOwnedCharacters.find((char) => char.id === teamChar.id) || teamChar
      );

      return { ownedCharacters: updatedOwnedCharacters, team: updatedTeam };
    });
  },
});
