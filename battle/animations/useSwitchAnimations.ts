import { useSharedValue, withTiming, withSequence, Easing } from 'react-native-reanimated';

export const useSwitchAnimations = (triggerSwitchAnimations: React.MutableRefObject<boolean>) => {
  const playerScale = useSharedValue(0);
  const playerOpacity = useSharedValue(0);

  const switchCharacterAnimations = () => {
    playerScale.value = withSequence(
      withTiming(1.2, { duration: 600, easing: Easing.ease }),
      withTiming(0, { duration: 600, easing: Easing.ease })
    );
    playerOpacity.value = withTiming(1, { duration: 300 });
    setTimeout(() => {
      playerScale.value = withTiming(1, { duration: 600, easing: Easing.ease });
    }, 3000);
  };

  return {
    playerScale,
    playerOpacity,
    switchCharacterAnimations
  };
};
