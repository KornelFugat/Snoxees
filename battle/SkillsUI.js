// SkillsUI.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import attacksData from '../attacks.json';
import SkillCard from '../SkillCard';

const SkillsUI = ({ onAttackPress, skills, disabled }) => {
  const [currentPage, setCurrentPage] = useState(0);
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
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.skillsContainer}>
        {renderSkills()}
      </View>
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 0}>
          <Text style={[styles.arrowLeft, currentPage === 0 && styles.disabledArrow]}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextPage} disabled={currentPage >= totalPages - 1}>
          <Text style={[styles.arrowRight, currentPage >= totalPages - 1 && styles.disabledArrow]}>{'>'}</Text>
        </TouchableOpacity>
      </View>
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
  navigationContainer: {
    position: 'absolute',
    top: '90%',
    left: '50%',
    flexDirection: 'row',
  },
  arrowLeft: {
    fontSize: 24,
    color: '#fff',
    right: '130%',
  },
  arrowRight: {
    fontSize: 24,
    color: '#fff',
    left: '100%',
  },
  disabledArrow: {
    color: '#888',
  },
});

export default SkillsUI;
