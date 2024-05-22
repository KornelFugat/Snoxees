const evolution1Images = {
    full: require('../assets/characters/Tigravine/1full.png'),
    portrait: require('../assets/characters/Tigravine/1gap.png'),
    head: require('../assets/characters/Tigravine/1head.png'),
  };
  
  const evolution2Images = {
    full: require('../assets/characters/Tigravine/2full.png'),
    portrait: require('../assets/characters/Tigravine/2gap.png'),
    head: require('../assets/characters/Tigravine/2head.png'),
  };
  
  const evolution3Images = {
    full: require('../assets/characters/Tigravine/3full.png'),
    portrait: require('../assets/characters/Tigravine/3gap.png'),
    head: require('../assets/characters/Tigravine/3head.png'),
  };
  
  export const Tigravine = {
    name: "Tigravine",
    type: "grass",
    currentHealth: 80,
    baseStats: {
      maxHealth: 80,
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