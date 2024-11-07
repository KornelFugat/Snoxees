import { useSharedValue, withSpring, withTiming, withSequence, withDelay, Easing, runOnJS, runOnUI } from 'react-native-reanimated';

export const useStartAnimations = (triggerStartAnimation: React.MutableRefObject<boolean>, resetPlayerTintColor: () => void, resetEnemyTintColor: () => void) => {
  const playerScale = useSharedValue(0);
  const enemyScale = useSharedValue(0);
  const startAnimationPlayer = useSharedValue(0);
  const startAnimationEnemy = useSharedValue(0);
  const playerOpacityMain = useSharedValue(0);
  const enemyOpacityMain = useSharedValue(0);

  const startBattleAnimations = () => {
    runOnUI(() => {
      playerScale.value = withSequence(withSpring(0, { duration: 500 }), withSpring(1, { duration: 500 }));
      startAnimationPlayer.value = withSequence(
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease }),
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease }, () => {
          runOnJS(resetPlayerTintColor)();
        })
      );
      playerOpacityMain.value = withTiming(1, { duration: 500, easing: Easing.ease });

      enemyScale.value = withDelay(1500, withSequence(withSpring(0, { duration: 500 }), withSpring(1, { duration: 500 })));
      startAnimationEnemy.value = withDelay(1500, withSequence(
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease }),
        withTiming(1, { duration: 250, easing: Easing.ease }),
        withTiming(0, { duration: 250, easing: Easing.ease }, () => {
          runOnJS(resetEnemyTintColor)();
        })
      ));
      enemyOpacityMain.value = withDelay(1500, withTiming(1, { duration: 500, easing: Easing.ease }));
    })();
  };

  return {
    playerScale,
    enemyScale,
    startAnimationPlayer,
    startAnimationEnemy,
    playerOpacityMain,
    enemyOpacityMain,
    startBattleAnimations
  };
};
