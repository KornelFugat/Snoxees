const evolution1Images = {
    full: require('../assets/characters/Fruigle/1full.png'),
    portrait: require('../assets/characters/Fruigle/1gap.png'),
    head: require('../assets/characters/Fruigle/1head.png'),
  };
  
  const evolution2Images = {
    full: require('../assets/characters/Fruigle/2full.png'),
    portrait: require('../assets/characters/Fruigle/2gap.png'),
    head: require('../assets/characters/Fruigle/2head.png'),
  };
  
  const evolution3Images = {
    full: require('../assets/characters/Fruigle/3full.png'),
    portrait: require('../assets/characters/Fruigle/3gap.png'),
    head: require('../assets/characters/Fruigle/3head.png'),
  };
  
  export const Fruigle = {
    name: "Fruigle",
    type: "grass",
    currentHealth: 90,
    baseStats: {
      maxHealth: 90,
      speed: 20,
      normalDamage: 15,
      elementalDamage: 25,
      normalDefence: 10,
      elementalDefence: 5
    },
    temporaryStats: {
      speed: 20,
      normalDamage: 15,
      elementalDamage: 25,
      normalDefence: 10,
      elementalDefence: 5
    },
    levelUpStats: {
      health: 10,
      speed: 2,
      normalDamage: 1,
      elementalDamage: 2,
      normalDefence: 1,
      elementalDefence: 1
    },
    currentImages: evolution1Images,
    skills: [
      { level: 1, name: "Punch" },
      { level: 5, name: "Thorns" },
      
    ],
    evolutions: [
      { level: 1, images: evolution1Images },
      { level: 11, images: evolution2Images },
      { level: 21, images: evolution3Images }
    ],
    maxLevel: 30
  };