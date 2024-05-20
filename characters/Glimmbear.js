const evolution1Images = {
    full: require('../assets/characters/Glimmbear/1full.png'),
    portrait: require('../assets/characters/Glimmbear/1gap.png'),
    head: require('../assets/characters/Glimmbear/1head.png'),
  };
  
  const evolution2Images = {
    full: require('../assets/characters/Glimmbear/2full.png'),
    portrait: require('../assets/characters/Glimmbear/2gap.png'),
    head: require('../assets/characters/Glimmbear/2head.png'),
  };
  
  const evolution3Images = {
    full: require('../assets/characters/Glimmbear/3full.png'),
    portrait: require('../assets/characters/Glimmbear/3gap.png'),
    head: require('../assets/characters/Glimmbear/3head.png'),
  };
  
  export const Glimmbear = {
    name: "Glimmbear",
    type: "fire",
    currentHealth: 100,
    baseStats: {
      maxHealth: 100,
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
      { level: 5, name: "Small Fireball" },
      
    ],
    evolutions: [
      { level: 1, images: evolution1Images },
      { level: 11, images: evolution2Images },
      { level: 21, images: evolution3Images }
    ],
    maxLevel: 30
  };