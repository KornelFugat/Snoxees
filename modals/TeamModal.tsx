import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';
import { Image } from 'expo-image';
import TeamCharacterCard from './TeamCharacterCard';
import { LinearGradient } from 'expo-linear-gradient';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';
import OwnedCharacterCard from './OwnedCharacterCard';
import { Character } from '../types'; // Ensure the types are correctly imported
import { addToTeam, BASE_URL, fetchAccountDetails, removeCharacterFromTeam, saveTeam } from 'api/accountApi';

const { width, height } = Dimensions.get('screen');

const responsiveFontSize = (size: number) => Math.round((size * width) / 375);
const responsiveHeight = (size: number) => Math.round((size * height) / 667);


const TeamModal: React.FC = () => {
  const [team, setTeam] = React.useState<Character[]>([]);
  const [ownedCharacters, setOwnedCharacters] = React.useState<Character[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await fetchAccountDetails();
        setTeam(result.team);
        setOwnedCharacters(result.ownedCharacters);
      } catch (error) {
        console.error('Failed to fetch team:', error);
      }
    };

    fetch();
  }, []);

  const handleAddToTeam = async (characterId: number) => {
    const character = ownedCharacters.find((char: Character) => char.id === characterId);
    if (character && team.length < 4 && !team.some((char: Character) => char.id === characterId)) {
      setTeam([...team, character]);
    }
  };

  const handleRemoveFromTeam = async (characterId: number) => {
    setTeam(team.filter((char: Character) => char.id !== characterId));
  };

  const saveNewTeam = async (team: Character[]) => {
    try {
      const result = await saveTeam(team);
      setTeam(result.team);
    } catch (error) {
      console.error('Failed to save team:', error);
    }
  };

  const handleSave = async () => {
    await saveNewTeam(team);
  };

  const isCharacterInTeam = (character: Character) => {
    return team.some(teamMember => teamMember.id === character.id);
  };

  const sortedOwnedCharacters = ownedCharacters.sort((a, b) => {
    const aInTeam = isCharacterInTeam(a);
    const bInTeam = isCharacterInTeam(b);

    if (aInTeam && !bInTeam) {
      return -1;
    } else if (!aInTeam && bInTeam) {
      return 1;
    } else {
      return 0;
    }
  });

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


  const renderTeamSlot = (char: Character | undefined, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.teamCharacterContainer}
      onPress={() => char && handleRemoveFromTeam(char.id)}
    >
      {char ? (
        <>
          <Image source={{ uri: `${BASE_URL}${char.currentImages.full}` }} style={styles.fullCharacterImage} contentFit='cover' />
          <Image source={getCharacterTypeIcon(char.type)} style={styles.typeIcon} contentFit='cover' />
          <TeamCharacterCard character={char} getCharacterTypeIcon={getCharacterTypeIcon} getCharacterTypeColor={getCharacterTypeColor} />
        </>
      ) : (
        <LinearGradient style={styles.emptySlot} colors={['#ffffff','silver']}  />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.modal}>
      <ImageBackground source={require('../assets/wooden-background.png')} resizeMode="cover" style={styles.modalContent}>
        <View style={styles.content}>
        <View style={{ marginBottom: 10 }}>
          <StrokeText
            text="MANAGE YOUR TEAM"
            fontSize={responsiveFontSize(18)}
            color="#FFFFFF"
            strokeColor="#333000"
            strokeWidth={4}
            fontFamily='Nunito-Black'
            align='center'
            numberOfLines={1}
          />
        </View>

        <LinearGradient style={styles.teamSection} colors={['#FFF8E1', '#FFF8E1']} start={{ x: 0, y: 0 }}>
          <View style={styles.teamGrid}>
            {Array.from({ length: 4 }).map((_, index) => renderTeamSlot(team[index], index))}
          </View>
        </LinearGradient>

        <View style={styles.ownedSection}>
          <FlatList
            data={sortedOwnedCharacters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.characterContainer}
                onPress={() => handleAddToTeam(item.id)}
                disabled={isCharacterInTeam(item)}
              >
                <OwnedCharacterCard
                  character={item}
                  getCharacterTypeIcon={getCharacterTypeIcon}
                  getCharacterTypeColor={getCharacterTypeColor}
                  isInTeam={isCharacterInTeam(item)}
                  isSelected={team.some(teamMember => teamMember.id === item.id)}
                />
              </TouchableOpacity>
            )}
            numColumns={3}
            contentContainerStyle={styles.charactersGrid}
          />
        </View>

        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save Team</Text>
        </TouchableOpacity>
        </View>
      </ImageBackground>
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
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
    top: '-7%'
  },
  teamSection: {
    flex: 2,
    width: '100%',
    height: '50%',
    backgroundColor: '#333',
    marginBottom: 15,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 10,
    borderWidth: 4,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    height: '50%', // Adjusted to fit two rows of larger characters
  },
  teamCharacterContainer: {
    width: '45%', // Adjusted to fit two columns
    height: '95%', // Adjusted to fit within the container
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderRadius: 15,
    margin: 5,
    backgroundColor: 'white',
  },
  fullCharacterImage: {
    width: '58%',
    height: '50%',
  },
  typeIcon: {
    position: 'absolute',
    top: '1%',
    right: '1%',
    width: '25%',
    height: '20%',
    maxHeight: 50,
    maxWidth: 50,
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
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
  characterName: {
    fontFamily: 'Nunito-Black',
  },
  grayTint: {
    tintColor: 'rgba(128, 128, 128, 0.5)',
  },
  button: {
    backgroundColor: '#1F1F1F',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6C541E',
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  typeIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
  },
});

export default TeamModal;
