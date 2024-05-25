// SkillsUI.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import attacksData from '../attacks.json';
import SkillCard from '../SkillCard';
import { Image } from 'expo-image';

const SkillsUI = ({ onAttackPress, skills, disabled }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const itemsPerPage = 4;


  const iconMap = {
    normal: require('../assets/normalskill.png'),
    fire: require('../assets/fireskill.png'),
    grass: require('../assets/grassskill.png'),
  };

  const totalPages = Math.ceil(skills.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

 const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const renderSkills = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return skills.slice(startIndex, endIndex).map((skill, index) => {
      const attack = attacksData.find(a => a.name === skill.name);
      return (
        <SkillCard
          key={index}
          skill={skill}
          attack={attack}
          iconMap={iconMap}
          onPress={() => !disabled ? onAttackPress(skill.name, attack.damage, attack.type, attack.multiplier) : null}
          disabled={disabled}
          showDetails={showDetails}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.skillsContainer}>
        {renderSkills()}
      </View>
        <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 0}>
          <Text style={[styles.arrowLeft, currentPage === 0 && styles.disabledArrow]}>{'←'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextPage} disabled={currentPage >= totalPages - 1}>
          <Text style={[styles.arrowRight, currentPage >= totalPages - 1 && styles.disabledArrow]}>{'→'}</Text>
        </TouchableOpacity>
      <TouchableOpacity onPress={toggleShowDetails} style={styles.detailsButton}>
          <Image source={require('../assets/flipping-arrows.png')} contentFit='cover' style={styles.flipImage} />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333', // Dark grey background
    borderRadius: 10,
    padding: 10,
  },
  skillsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  arrowLeft: {
    position: 'absolute',
    bottom: '0%',
    fontSize: 60,
    color: '#fff',
    right: '50%',
    fontFamily: 'Nunito-Black',
  },
  arrowRight: {
    position: 'absolute',
    fontSize: 60,
    color: '#fff',
    bottom: '0%',
    left: '50%',
    fontFamily: 'Nunito-Black',
  },
  disabledArrow: {
    color: '#888',
  },
  detailsButton: {
    position: 'absolute',
    backgroundColor: '#333',
    borderRadius: 5,
    bottom: '1%',
    right: '1%',
    width: '13%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipImage: {
   width: '100%',
   height: '100%', 
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
  },

});

export default SkillsUI;
