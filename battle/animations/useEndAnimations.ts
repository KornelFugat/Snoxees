import { useSharedValue, withTiming, withSequence, Easing, runOnJS } from 'react-native-reanimated';
import { BattleAnimationResult } from '../../types';

export const useEndAnimations = () => {
  const playerScale = useSharedValue(0);
  const playerOpacity = useSharedValue(0);
  const enemyScale = useSharedValue(0);
  const enemyOpacity = useSharedValue(0);
  const enemyOpacityMain = useSharedValue(0);

  const endAnimations = (typeOf: { type: BattleAnimationResult; id: number }) => {
    if (typeOf.type === "enemyDefeated") {
      enemyScale.value = withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.ease }),
        withTiming(0, { duration: 600, easing: Easing.ease })
      );
      enemyOpacity.value = withTiming(0, { duration: 300 });
      setTimeout(() => {
        runOnJS(() => {
          enemyOpacityMain.value = 0;
          enemyScale.value = 0;
        })();
      }, 1200);
    } else if (typeOf.type === "playerDefeated") {
      playerScale.value = withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.ease }),
        withTiming(0, { duration: 600, easing: Easing.ease })
      );
      playerOpacity.value = withTiming(1, { duration: 300 });
      setTimeout(() => {
        playerScale.value = withTiming(1, { duration: 600, easing: Easing.ease });
      }, 3000);
    } else if (typeOf.type === "lastPlayerDefeated") {
      playerScale.value = withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.ease }),
        withTiming(0, { duration: 600, easing: Easing.ease })
      );
      playerOpacity.value = withTiming(0, { duration: 300 });
    } else if (typeOf.type === "captureSuccess") {
      enemyScale.value = withSequence(
        withTiming(0, { duration: 1000, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease }),
        withTiming(0, { duration: 2000, easing: Easing.ease }),
        withTiming(1, { duration: 2000, easing: Easing.ease }),
        withTiming(0, { duration: 600, easing: Easing.ease })
      );
      setTimeout(() => {
        enemyOpacityMain.value = withTiming(0, { duration: 500, easing: Easing.ease });
      }, 6400);
    } else if (typeOf.type === "captureFailure") {
      enemyScale.value = withSequence(
        withTiming(0, { duration: 1000, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease }),
        withTiming(0, { duration: 2000, easing: Easing.ease }),
        withTiming(1, { duration: 2000, easing: Easing.ease })
      );
      enemyOpacityMain.value = withTiming(1, { duration: 500, easing: Easing.ease });
    }
  };

  return {
    playerScale,
    playerOpacity,
    enemyScale,
    enemyOpacity,
    enemyOpacityMain,
    endAnimations,
  };
};
