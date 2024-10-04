import axios from 'axios';
import { AccountStore, Announcement, BattleStore, CurrentTurn, Enemy } from 'types';
import { API_URL } from './accountApi';



// export const startBattle = async (accountStore: AccountStore): Promise<BattleStore> => {
//     const response = await axios.post(`${API_URL}/battle/start-battle`, { accountStore });
//     return response.data;
// };

export const fetchBattleDetails = async (): Promise<BattleStore> => {
    const response = await axios.get(`${API_URL}/battle`);
    return response.data;
};

export const checkBattleRequirements = async (): Promise<BattleStore> => {
    const response = await axios.get(`${API_URL}/battle/check-requirements`);    
    return response.data;
}

export const initialize = async (): Promise<BattleStore> => {
    const response = await axios.get(`${API_URL}/battle/initialize`);
    return response.data;
};

export const playerAttack = async (attackName: string): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/player-attack`, { attackName });
    return response.data;
};

export const playerSwitch = async (characterId: number): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/player-switch`, { characterId });
    return response.data;
};

export const playerCatch = async (): Promise<BattleStore> => {
    const response = await axios.get(`${API_URL}/battle/player-catch`);
    return response.data;
}

export const enemyAttack = async (): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/enemy-attack`);
    return response.data;
}


export const setIsInitialized = async (isInitialized: boolean): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/set-is-initialized`, { isInitialized });
    return response.data;
};
export const setEnemy = async (enemy: Enemy): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/set-enemy`, { enemy });
    return response.data;
};
export const updateEnemyHealth = async (health: number): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/update-enemy-health`, { health });
    return response.data;
};
export const setCurrentTurn = async (turn: CurrentTurn): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/set-current-turn`, { turn });
    return response.data;
};
export const setCurrentPlayerIndex = async (index: number): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/set-current-player-index`, { index });
    return response.data;
};
export const setCaptureChance = async (chance: number): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/set-capture-chance`, { chance });
    return response.data;
};
export const setBaseCaptureChance = async (chance: number): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/set-base-capture-chance`, { chance });
    return response.data;
};
export const setCaptureChanceModifier = async (modifier: number): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/set-capture-chance-modifier`, { modifier });
    return response.data;
};
export const setTurnCounter = async (counter: number): Promise<BattleStore> => {
    const response = await axios.post(`${API_URL}/battle/set-turn-counter`, { counter });
    return response.data;
};
