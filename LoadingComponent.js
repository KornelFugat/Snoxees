import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import ProgressBar from './ProgressBar';

const LoadingComponent = ({ duration }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text style={styles.loadingText}>Loading...</Text>
    <ProgressBar duration={duration} />
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0208',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffff',
  },
});

export default LoadingComponent;
