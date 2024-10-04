import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, FlatList, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Image } from 'expo-image';
import ExperienceBar from '../ExperienceBar';
import { Attack, Character } from '../types';
import { BASE_URL, evolveCharacter, fetchAccountDetails, getCharacterAttacks, levelUpCharacter } from 'api/accountApi';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import { LinearGradient } from 'expo-linear-gradient';
import OwnedCharacterCard from './OwnedCharacterCard';
import HealthBar from '../HealthBar'; // Import HealthBar component
import CharacterSkillCard from './CharacterSkillCard';
import AttackDetailsModal from './AttackDetailsModal';
import MoneyWidget from 'MoneyWidget';

const { width, height } = Dimensions.get('screen');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);

const responsiveHeight = (size: number) => Math.round((size * height) / 667);

interface CharacterModalProps {
  onExit: () => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ onExit }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<Character | null>(null);
  const [ownedCharacters, setOwnedCharacters] = useState<Character[]>([]);
  const [team, setTeam] = useState<Character[]>([]);
  const [sortedOwnedCharacters, setSortedOwnedCharacters] = useState<Character[]>([]);
  const [skillsOpen, setSkillsOpen] = useState<boolean>(false);
  const [characterAttacks, setCharacterAttacks] = useState<Attack[]>([]);
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
  const [gold, setGold] = useState<number>(0);
  const [diamonds, setDiamonds] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleLevelUp = async () => {
    if (selectedMember) {
      await levelUpCharacter(selectedMember.id);
      fetchAccountDetailsData();
    }
  };

  const handleEvolve = async () => {
    if (selectedMember) {
      await evolveCharacter(selectedMember.id); // Assuming this handles the evolution
      fetchAccountDetailsData();
    }
  };

  const fetchAccountDetailsData = async () => {
    try {
      const result = await fetchAccountDetails();
      setOwnedCharacters(result.ownedCharacters);
      setTeam(result.team);
      setGold(result.gold);
      setDiamonds(result.diamonds);
      setRefresh(!refresh); // Trigger re-render
    } catch (error) {
      console.error('Failed to fetch account:', error);
    }
  };

  useEffect(() => {
    fetchAccountDetailsData();
  }, []);

  useEffect(() => {
    if (ownedCharacters.length > 0) {
      setSelectedMemberId(ownedCharacters[0].id);
    }
  }, []);

  useEffect(() => {
    if (ownedCharacters.length > 0) {
      setSelectedMember(ownedCharacters.find(member => member.id === selectedMemberId) || null);
    }
  }, [selectedMemberId, ownedCharacters]);

  useEffect(() => {
    if (!selectedMember && ownedCharacters.length > 0) {
      setSelectedMemberId(ownedCharacters[0].id); // Reset to the first character if the previously selected is no longer available
    }
  }, [ownedCharacters]);

  useEffect(() => {
    if (selectedMember) {
      const fetch = async () => {
        try {
          const result = await getCharacterAttacks(selectedMember.id);
          setCharacterAttacks(result);
        } catch (error) {
          console.error('Failed to fetch character attacks:', error);
        }
      }

      fetch();
    }
  }, [selectedMember]);

  const isCharacterInTeam = (character: Character) => {
    return team.some(teamMember => teamMember.id === character.id);
  };

  useEffect(() => {
    setSortedOwnedCharacters([...team, ...ownedCharacters.filter(character => !isCharacterInTeam(character))]);
  }, [ownedCharacters, team]);

  const getCharacterTypeIcon = (type: string) => {
    const typeIconMap: { [key: string]: any } = {
      fire: require('../assets/fireskill.png'),
      grass: require('../assets/grassskill.png'),
      // Add other types as necessary
    };

    return typeIconMap[type] || null;
  };

  const getCharacterTypeColor = (type: string) => {
    const typeColorMap: { [key: string]: string } = {
      fire: '#D50B0B',
      grass: '#00A400',
      // Add other types as necessary
    };

    return typeColorMap[type] || 'white';
  };

  const getCharacterTypeBackground = (type: string) => {
    const typeBackgroundMap: { [key: string]: any } = {
      fire: require('../assets/fire-region.png'),
      grass: require('../assets/backgroundtoptest.png'),
      // Add other types as necessary
    };

    return typeBackgroundMap[type] || null;
  };

  // Determine button styles based on selectedMember's level
  const determineButtonStyles = () => {
    if (!selectedMember) return { levelUpButtonColors: ['#448EE7', '#0000FF'], evolveButtonColors: ['#FFE585', '#FFC900'], buttonText: 'TRAIN NOW', evolveText: 'EVOLVE NOW' };

    if (selectedMember.level === 30) {
      return {
        levelUpButtonColors: ['#808080', '#808080'],
        evolveButtonColors: ['#808080', '#808080'],
        buttonText: 'MAX TRAINED',
        evolveText: 'MAX EVOLVED'
      };
    }

    if (selectedMember.level === 10 || selectedMember.level === 20) {
      return {
        levelUpButtonColors: ['#FFE585', '#FFC900'],
        evolveButtonColors: ['#FFE585', '#FFC900'],
        buttonText: 'EVOLVE NOW',
        evolveText: 'EVOLVE NOW'
      };
    }

    return {
      levelUpButtonColors: ['#448EE7', '#0000FF'],
      evolveButtonColors: ['#FFE585', '#FFC900'],
      buttonText: 'TRAIN NOW',
      evolveText: 'EVOLVE NOW'
    };
  };

  const { levelUpButtonColors, evolveButtonColors, buttonText, evolveText } = determineButtonStyles();

  const getCostTextColor = (cost: number) => {
    return cost > gold ? '#808080' : '#FFFFFF';
  };

  return (
    <View style={styles.modal}>
      <ImageBackground source={require('../assets/wooden-background.png')} resizeMode="cover" style={styles.modalContent}>
        <View style={styles.content}>
          <View style={styles.moneyContainer}>
          <MoneyWidget gold={gold} diamonds={diamonds}/>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLevelUp} disabled={selectedMember?.level === 30}>
              <LinearGradient style={styles.levelUpButton} colors={levelUpButtonColors}>
                <StrokeText
                  text={buttonText}
                  fontSize={responsiveFontSize(13)}
                  color="#FFFFFF"
                  strokeColor="#333000"
                  strokeWidth={4}
                  fontFamily='Nunito-Black'
                  align='center'
                  numberOfLines={1}
                />
                {/* Show the training cost if not enough experience and not at max level */}
                {selectedMember && selectedMember.experience < selectedMember.experienceForNextLevel && selectedMember.level < 30 && (
                  <View style={styles.costContainer}>
                    <Image source={require('../assets/gold.png')} style={styles.goldIcon} contentFit='cover'/>
                    <StrokeText
                    text={selectedMember.trainingCost.toString()}
                    fontSize={responsiveFontSize(13)}
                    color={getCostTextColor(selectedMember.trainingCost)}
                    strokeColor="#333000"
                    strokeWidth={3}
                    fontFamily='Nunito-Black'
                    align='center'
                    numberOfLines={1}
                  />
                    
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleEvolve} disabled={selectedMember?.level === 30}>
              <LinearGradient style={styles.evolveButton} colors={evolveButtonColors}>
                <StrokeText
                  text={evolveText}
                  fontSize={responsiveFontSize(13)}
                  color="#FFFFFF"
                  strokeColor="#333000"
                  strokeWidth={4}
                  fontFamily='Nunito-Black'
                  align='center'
                  numberOfLines={1}
                />
                {/* Show the evolve cost if not at evolution level and not at max level */}
                {selectedMember && selectedMember.experience < selectedMember.experienceForNextLevel && selectedMember.level < 30 && (
                  <View style={styles.costContainer}>
                    <Image source={require('../assets/gold.png')} style={styles.goldIcon} contentFit='cover'/>
                    <StrokeText
                    text={selectedMember.evolveCost.toString()}
                    fontSize={responsiveFontSize(13)}
                    color={getCostTextColor(selectedMember.evolveCost)}
                    strokeColor="#333000"
                    strokeWidth={3}
                    fontFamily='Nunito-Black'
                    align='center'
                    numberOfLines={1}
                  />
                    
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {/* The rest of your component code remains the same */}
          {selectedMember && (
            <>
              <TouchableOpacity style={styles.skillsIconContainer} onPress={() => setSkillsOpen(!skillsOpen)}>
                <Image source={require('../assets/skills-icon.png')} style={styles.skillsIcon} contentFit="cover" />
              </TouchableOpacity>
              <Image source={getCharacterTypeIcon(selectedMember.type)} style={styles.typeIcon} contentFit="cover" />
              <View style={styles.imageContainer}>
                <Image
                  source={getCharacterTypeBackground(selectedMember.type)}
                  style={styles.fullImageBackground}
                  contentFit="cover"
                />
                <Image contentFit='contain' source={{ uri: `${BASE_URL}${selectedMember.currentImages.full}` }} style={styles.fullImage} />
              </View>
            </>
          )}
          <View style={styles.parentContainer}>
            <View style={styles.statsParent}>
              <StrokeText
                text="STATS"
                fontSize={responsiveFontSize(13)}
                color="#FFFFFF"
                strokeColor="#333000"
                strokeWidth={4}
                fontFamily='Nunito-Black'
                align='center'
                numberOfLines={1}
              />
              <View style={styles.statsContainer}>
                <View style={styles.statsColumn}>
                  <View style={styles.statsRow}>
                    <Image source={require('../assets/health.png')} style={styles.statIcon} contentFit="cover" />
                    <StrokeText
                      text={selectedMember ? `${selectedMember.baseStats.maxHealth}` : 'N/A'}
                      fontSize={responsiveFontSize(14)}
                      color="#FFFFFF"
                      strokeColor="#333000"
                      strokeWidth={4}
                      fontFamily='Nunito-Black'
                      align='left'
                    />
                  </View>
                  <View style={styles.statsRow}>
                    <Image source={require('../assets/normal-damage.png')} style={styles.statIcon} contentFit="cover" />
                    <StrokeText
                      text={selectedMember ? `${selectedMember.baseStats.normalDamage}` : 'N/A'}
                      fontSize={responsiveFontSize(14)}
                      color="#FFFFFF"
                      strokeColor="#333000"
                      strokeWidth={4}
                      fontFamily='Nunito-Black'
                      align='left'
                    />
                  </View>
                  <View style={styles.statsRow}>
                    <Image source={require('../assets/elemental-damage.png')} style={styles.statIcon} contentFit="cover" />
                    <StrokeText
                      text={selectedMember ? `${selectedMember.baseStats.elementalDamage}` : 'N/A'}
                      fontSize={responsiveFontSize(14)}
                      color="#FFFFFF"
                      strokeColor="#333000"
                      strokeWidth={4}
                      fontFamily='Nunito-Black'
                      align='left'
                    />
                  </View>
                </View>
                <View style={styles.statsColumn}>
                  <View style={styles.statsRow}>
                    <Image source={require('../assets/normal-defence.png')} style={styles.statIcon} contentFit="cover" />
                    <StrokeText
                      text={selectedMember ? `${selectedMember.baseStats.normalDefence}` : 'N/A'}
                      fontSize={responsiveFontSize(14)}
                      color="#FFFFFF"
                      strokeColor="#333000"
                      strokeWidth={4}
                      fontFamily='Nunito-Black'
                      align='left'
                    />
                  </View>
                  <View style={styles.statsRow}>
                    <Image source={require('../assets/elemental-defence.png')} style={styles.statIcon} contentFit="cover" />
                    <StrokeText
                      text={selectedMember ? `${selectedMember.baseStats.elementalDefence}` : 'N/A'}
                      fontSize={responsiveFontSize(14)}
                      color="#FFFFFF"
                      strokeColor="#333000"
                      strokeWidth={4}
                      fontFamily='Nunito-Black'
                      align='left'
                    />
                  </View>
                  <View style={styles.statsRow}>
                    <Image source={require('../assets/speed.png')} style={styles.statIcon} contentFit="cover" />
                    <StrokeText
                      text={selectedMember ? `${selectedMember.baseStats.speed}` : 'N/A'}
                      fontSize={responsiveFontSize(14)}
                      color="#FFFFFF"
                      strokeColor="#333000"
                      strokeWidth={4}
                      fontFamily='Nunito-Black'
                      align='left'
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.infoContainer}>
              {selectedMember && (
                <>
                  <StrokeText
                    text={selectedMember.name}
                    fontSize={responsiveFontSize(14)}
                    color="#FFFFFF"
                    strokeColor="#333000"
                    strokeWidth={3}
                    fontFamily='Nunito-Black'
                    align='center'
                  />
                  <HealthBar
                    currentHealth={selectedMember.currentHealth}
                    maxHealth={selectedMember.baseStats.maxHealth}
                    style={styles.healthBar}
                    textStyle={styles.healthText}
                  />
                  <ExperienceBar
                    currentExperience={selectedMember.experience}
                    maxExperience={selectedMember.experienceForNextLevel}
                    style={styles.experienceBar}
                    textStyle={styles.experienceText}
                    textFont={responsiveFontSize(10)}
                  />
                </>
              )}
            </View>
          </View>

          {skillsOpen ? (
            <>
              <View style={styles.header}>
                <StrokeText
                  text="SKILLS"
                  fontSize={responsiveFontSize(18)}
                  color="#FFFFFF"
                  strokeColor="#333000"
                  strokeWidth={4}
                  fontFamily='Nunito-Black'
                  align='center'
                  numberOfLines={1}
                />
              </View>
              <View style={styles.skillsContainer}>
                <FlatList
                  data={characterAttacks}
                  key={skillsOpen ? 'skills' : 'characters'}
                  keyExtractor={(item) => item.name.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.skillsCard} onPress={() => setSelectedAttack(item)}>
                      <CharacterSkillCard attack={item} />
                    </TouchableOpacity>
                  )}
                  numColumns={2}
                  contentContainerStyle={styles.skillsGrid}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <StrokeText
                  text="OWNED SNOXEES"
                  fontSize={responsiveFontSize(18)}
                  color="#FFFFFF"
                  strokeColor="#333000"
                  strokeWidth={4}
                  fontFamily='Nunito-Black'
                  align='center'
                  numberOfLines={1}
                />
              </View>
              <View style={styles.ownedSection}>
                <FlatList
                  data={sortedOwnedCharacters}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.characterContainer}
                      onPress={() => setSelectedMemberId(item.id)}
                    >
                      <OwnedCharacterCard
                        character={item}
                        getCharacterTypeIcon={getCharacterTypeIcon}
                        getCharacterTypeColor={getCharacterTypeColor}
                        isInTeam={isCharacterInTeam(item)}
                        isSelected={item.id === selectedMemberId}
                      />
                    </TouchableOpacity>
                  )}
                  numColumns={3}
                  contentContainerStyle={styles.charactersGrid}
                  extraData={refresh} // Add this line to trigger re-render when refresh changes
                />
              </View>
            </>
          )}
        <View/>
      </View>
      </ImageBackground>
      <AttackDetailsModal
        isVisible={!!selectedAttack}
        attack={selectedAttack}
        onClose={() => setSelectedAttack(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: width,
    height: height,
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '85%',
  },
  moneyContainer: {
    position: 'absolute',
    left: '3%',
    top: '9%',
    width: '26%',
    height: '8%',
    zIndex: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '8%',
    zIndex: 2,
  },
  button: {
    backgroundColor: '#333000',
    borderRadius: 10,
    margin: 3,
    width: '40%',
    borderWidth: 4,
  },
  levelUpButton: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evolveButton: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    top: '1%',
    zIndex: 1,
    backgroundColor: 'red',
  },
  skillsIconContainer: {
    position: 'absolute',
    top: '8%',
    right: '4%',
    width: responsiveFontSize(67),
    maxWidth: 80,
    height: responsiveHeight(55),
    maxHeight: 80,
    zIndex: 5,
  },
  skillsIcon: {
    height: '100%',
    width: '100%',
  },
  typeIcon: {
    position: 'absolute',
    top: '39%',
    left: '40%',
    width: responsiveFontSize(61),
    height: responsiveHeight(55),
    zIndex: 5,
  },
  fullImageBackground: {
    width: '106%',
    height: '120%',
    alignItems: 'center',
    borderRadius: 20,
    zIndex: 1,
    borderWidth: 4,
  },
  fullImage: {
    position: 'absolute',
    width: '100%',
    height: '70%',
    marginBottom: 20,
    top: '20%',
    zIndex: 3,
  },

  parentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '18%',
    width: '100%',
    marginBottom: 18,
    zIndex: 3,
  },
  statsParent: {
    flex: 1,
    height: '100%',
    backgroundColor: '#FFF8E1',
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statsColumn: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    width: '40%',
    height: '150%',
    marginRight: 5,
  },
  stat: {
    flex: 1,
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 4,
  },
  healthBar: {
    width: '65%',
    maxWidth: 210,
    height: '20%',
    marginBottom: '5%',
    left: '-7%',
  },
  experienceBar: {
    width: '65%',
    maxWidth: 210,
    height: '21%',
    marginBottom: '15%',
    left: '-7%',

  },
  healthText: {
    position: 'absolute',
    top: '50%',
    minWidth: '65%',
    zIndex: 1,
    left: '50%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  experienceText: {
    left: '35%',
  },
  header: {
  },
  ownedSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    borderWidth: 4,
  },
  charactersGrid: {
    flexDirection: 'column',
  },
  characterContainer: {
    width: '30%',
    height: responsiveHeight(60),
    margin: 5,
    left: '3%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  skillsContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    borderWidth: 4,
  },
  skillsGrid: {
    flexDirection: 'column',
  },
  skillsCard: {
    width: '46%',
    height: responsiveHeight(70),
    margin: 5,
    left: '3%',
    borderRadius: 8,
  },
  costContainer: {
    top: '-2%',
    left: '-5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  goldIcon: {
    width: 20,
    height: 20,
  },
  attackCard: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  attackName: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  attackDetail: {
    fontSize: responsiveFontSize(14),
  },
  closeButton: {
    backgroundColor: '#1F1F1F',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6C541E',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CharacterModal;