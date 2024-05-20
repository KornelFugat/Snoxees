import React, { useEffect } from 'react'
import { Text, TouchableOpacity, StyleSheet, ImageBackground, Image, View } from'react-native'
import attacksData from '../attacks.json';

const SkillsUI = ({ onAttackPress, skills, disabled, multiplier }) => {
    const iconMap = {
        normal: require('../assets/normalskill.png'),
        fire: require('../assets/fireskill.png'),
        grass: require('../assets/grassskill.png'),
    };

    useEffect(() => {
      console.log(onAttackPress)
    }, [onAttackPress])

    return (
        <ImageBackground
            source={require('../assets/light-gradient.png')}
            resizeMode="cover"
            style={styles.bottomPart}>
            {skills.map((skill, index) => {
                const attack = attacksData.find(a => a.name === skill.name);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, disabled  && styles.disabledContainer]}
                    onPress={() => !disabled ? onAttackPress(skill.name, attack.damage, attack.type, attack.multiplier) : null}
                    disabled={disabled}>
                    <Image source={require('../assets/wooden-board.png')} style={styles.buttonimage} />
                    <Image source={iconMap[attack.type]} style={styles.roundskill} />
                    <Text style={styles.buttonTextOverlay}>{skill.name}</Text>
                  </TouchableOpacity>
                );
            })}
        </ImageBackground>
    )
    }

    const styles = StyleSheet.create({
        bottomPart: {
          flex: 3, // 40% of the screen
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap', // Wrap the buttons to fit the screen
          width: '100%',
          // paddingHorizontal: 5, // Add padding to ensure the dashed lines don't touch the screen edges
          backgroundColor: '#FFFFFF', // White text
          color: '#000000', // Dark background
        },
        disabledContainer: {
          opacity: 0.5, // Or any other visual effect you prefer
      },
        button: {
          flex: 1,
          alignItems: 'center',
          minHeight: '50%',  // Ensure at least 50% height of each button
          minWidth: '50%',
          position: 'relative',
        },
        buttonTextOverlay: {
            position: 'absolute',
            color: '#FFFFFF', // White text for visibility
            fontSize: 35, // Adjust the font size as needed
            textAlign: 'center', // Center the text horizontally
            width: '100%', // Cover the full width of the button
            textShadowColor:'#000000',
            textShadowOffset:{width: 2, height: 2},
            textShadowRadius:3,
            paddingTop: 90,
        },
        buttonimage: {
          flex: 1,
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        },
        paperimage: {
            position: 'absolute',
            width: 100,
            height: 100,
        },
        roundskill: {
            position: 'absolute',
            width: 90,
            height: 90,
            resizeMode: 'contain',
            top:13
        },
        button2: {
          flex: 1, // Take up 1/4th of the bottomPart's flex
          alignItems: 'center', // Center content horizontally
          minHeight: '50%', // Set minimum height
          minWidth: '50%', // Set minimum width
          position: 'relative',
        },
        button3: {
          flex: 1, // Take up 1/4th of the bottomPart's flex
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
          minHeight: '50%', 
          minWidth: '50%', // Set minimum width
        },
        button4: {
          flex: 1, // Take up 1/4th of the bottomPart's flex
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
          minHeight: '50%', 
          minWidth: '50%',
      
      
        },
        
      });

export default SkillsUI;