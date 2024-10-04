import axios from 'axios';
import { AccountStore, Attack, BattleResult, Character, Enemy } from 'types';

export const BASE_URL = 'http://192.168.1.124:3000/';
// export const BASE_URL = 'http://10.0.2.2:3000/';

export const API_URL = `${BASE_URL}api`


export const fetchAccountDetails = async (): Promise<AccountStore> => {
    const response = await axios.get(`${API_URL}/account`);
    return response.data;
};

export const updatePlayerName = async (name: string): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/update-player-name`, { name });
    return response.data;
};

export const updateGold = async (amount: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/update-gold`, { amount });
    return response.data;
};

export const updateDiamonds = async (amount: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/update-diamonds`, { amount });
    return response.data;
};

export const updateBattleExperience = async (amount: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/update-battle-experience`, { amount });
    return response.data;
};

export const updateBattleResult = async (result: BattleResult): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/update-battle-result`, { result });
    return response.data;
};

export const addCharacterToOwned = async (characterName: string): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/add-character-to-owned`, { characterName });
    return response.data;
};

export const addToTeam = async (characterId: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/add-character-to-team`, { characterId });
    return response.data;
};

export const saveTeam = async (team: Character[]): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/set-team`, { team });
    return response.data;
};
  
export const removeCharacterFromTeam = async (characterId: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/remove-character-from-team`, { characterId });
    return response.data;
};

export const removeCharacterFromOwned = async (characterId: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/remove-character-from-owned`, { characterId });
    return response.data;
};
  
export const updateHealth = async (characterId: number, health: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/update-health`, { characterId, health });
    return response.data;
};

export const setEnemy = async (enemy: Enemy): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/set-enemy`, { enemy });
    return response.data;
};
  
export const updateEnemyHealth = async (health: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/update-enemy-health`, { health });
    return response.data;
};

export const resetCurrentHealth = async (): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/reset-current-health`);
    return response.data;
};
  
export const addExperienceToTeam = async (experience: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/add-experience-to-team`, { experience });
    return response.data;
};

export const levelUpCharacter = async (characterId: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/level-up-character`, { characterId });
    return response.data;
  };

export const evolveCharacter = async (characterId: number): Promise<AccountStore> => {
    const response = await axios.post(`${API_URL}/account/evolve-character`, { characterId });
    return response.data;
  };

export const getCharacterAttacks = async (characterId: number): Promise<Attack[]> => {
    const response = await axios.post(`${API_URL}/account/get-character-attacks`, { characterId });
    return response.data;
  };