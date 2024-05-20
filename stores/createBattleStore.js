export  const createBattleStore = (set) => ({
    playerHealth: 0,
    enemyHealth: 0,
    playerAttack: 0,
    enemyAttack: 0,
    updatePlayerHealth: (health) => set({ playerHealth: health }),
    
    updatePlayerAttack: (attack) => set({ playerAttack: attack }),
    updateEnemyAttack: (attack) => set({ enemyAttack: attack }),
})