import  {characters } from '../charactersData';

const charactersData = characters;
console.log("characters", charactersData)

export const createAccountStore = (set, get) => ({
    playerName: '',
    team: [], // Team of up to 4 characters
    ownedCharacters: [], // Characters the player actually owns
    enemy: null,
    gold: 0,
    diamonds: 0,
    nextCharacterId: 1,

    updatePlayerName: (name) => set({ playerName: name }),
    updateGold: (amount) => set(state => ({ gold: state.gold + amount })),
    updateDiamonds: (amount) => set(state => ({ diamonds: state.diamonds + amount })),

    addCharacterToOwned: (characterName) => {
        const character = characters[characterName];
        if (character) {
            const newCharacter = {
                ...character,
                id: get().nextCharacterId, // Use the current counter value for ID
                level: 9,
                experience: 0,
                experienceForNextLevel: 15
            };
            set(state => ({
                ownedCharacters: [...state.ownedCharacters, newCharacter],
                nextCharacterId: state.nextCharacterId + 1 // Increment the ID counter
            }));
        }
    },


    addToTeam: (characterId) => {
        const character = get().ownedCharacters.find(char => char.id === characterId);
        if (character && get().team.length < 4 && !get().team.some(char => char.id === characterId)) {
            set(state => ({ team: [...state.team, character] }));
        }
    },

    removeCharacterFromTeam: (characterId) => {
        set(state => ({
            team: state.team.filter(char => char.id !== characterId)
        }));
    },

    updateTeam: (newTeam) => {
        set({ team: newTeam });
    },

    removeCharacterFromOwned: (characterId) => {
        set(state => ({
            ownedCharacters: state.ownedCharacters.filter(char => char.id !== characterId),
            team: state.team.filter(char => char.id !== characterId)
        }));
    },

    setEnemy: (enemy) => set({ enemy: enemy }),

    updateEnemyHealth: (newHealth) => {
        const safeHealth = Math.max(0, newHealth);
        const updatedEnemy = get().enemy ? { ...get().enemy, currentHealth: safeHealth } : null;
        set({ enemy: updatedEnemy });
    },

    updateHealth: (characterId, health) => {
        let updatedTeam = get().team.map(char => {
            if (char.id === characterId) {
                return {
                    ...char,
                    currentHealth: Math.max(0, health)
                };
            }
            return char;
        });
    
        // Now reflect these changes back to the ownedCharacters
        let updatedOwnedCharacters = get().ownedCharacters.map(ownedChar => {
            // Find this character in the updated team and update accordingly
            const updatedChar = updatedTeam.find(teamChar => teamChar.id === ownedChar.id);
            return updatedChar || ownedChar; // If the character is in the team, update, otherwise leave as is
        });
    
        // Update the state with the new lists
        set({ 
            team: updatedTeam,
            ownedCharacters: updatedOwnedCharacters
        });
    },

    resetCurrentHealth: () => {
        const updatedCharacters = get().ownedCharacters.map(character => ({
            ...character,
            currentHealth: character.baseStats.maxHealth // Assuming maxHealth is part of baseStats
        }));

        const updatedTeam = get().team.map(teamChar => 
            updatedCharacters.find(char => char.id === teamChar.id) || teamChar
        );

        set({
            ownedCharacters: updatedCharacters,
            team: updatedTeam
        });
    },

    addExperienceToTeam: (experience) => {
    // Update experience only for team members
    const updatedTeam = get().team.map(character => {
        if (character.level < 30 && character.experience < character.experienceForNextLevel) {
            let newExperience = character.experience + experience;
            if (newExperience >= character.experienceForNextLevel) {
                newExperience = character.experienceForNextLevel; // Cap at max experience
            }
            return { ...character, experience: newExperience };
        }
        return character;
    });

    // Sync the updated team back to ownedCharacters
    const updatedOwnedCharacters = get().ownedCharacters.map(ownedChar => {
        const updatedChar = updatedTeam.find(teamChar => teamChar.id === ownedChar.id);
        return updatedChar || ownedChar;
    });

    set({
        ownedCharacters: updatedOwnedCharacters,
        team: updatedTeam
    });
},




    levelUpCharacter: (characterId) => {
        set(state => {
            let updatedOwnedCharacters = state.ownedCharacters.map(char => {
                if (char.id === characterId && char.level < char.maxLevel) {
                    const newLevel = char.level + 1;
                    let newImages = char.evolutions[0].images; // default to first evolution images

                    if (newLevel >= 21) {
                        newImages = char.evolutions[2].images; // Third evolution
                    } else if (newLevel >= 11) {
                        newImages = char.evolutions[1].images; // Second evolution
                    }

                    const newBaseStats = {
                        maxHealth: char.baseStats.maxHealth + char.levelUpStats.health,
                        speed: char.baseStats.speed + char.levelUpStats.speed,
                        normalDamage: char.baseStats.normalDamage + char.levelUpStats.normalDamage,
                        elementalDamage: char.baseStats.elementalDamage + char.levelUpStats.elementalDamage,
                        normalDefence: char.baseStats.normalDefence + char.levelUpStats.normalDefence,
                        elementalDefence: char.baseStats.elementalDefence + char.levelUpStats.elementalDefence,
                    }

                    return {
                        ...char,
                        level: newLevel,
                        experience: 0,
                        experienceForNextLevel: Math.floor(char.experienceForNextLevel * 1.2),
                        baseStats: newBaseStats,
                        currentHealth: char.baseStats.maxHealth + char.levelUpStats.health,
                        currentImages: newImages,
                        temporaryStats: newBaseStats
                    };
                }
                return char;
            });

            // Update team based on updated characters
            const updatedTeam = state.team.map(teamChar => 
                updatedOwnedCharacters.find(char => char.id === teamChar.id) || teamChar
            );

            return { ownedCharacters: updatedOwnedCharacters, team: updatedTeam };
        });
    },

})