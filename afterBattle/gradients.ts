import {BattleResult} from "../types";

export const getGradientColors = (result: BattleResult): string[] => {
  switch (result) {
    case 'victory':
      return ['#45C74A', '#226C25'];
    case 'defeat':
      return ['#F44336', '#6C1F1A'];
    case 'captured':
      return ['#D17230', '#314C8C'];
    default:
      return ['#C7CED8', '#949BA4'];
  }
};

export const getContainerColors = (result: BattleResult): string[] => {
  switch (result) {
    case 'victory':
      return ['#45C74A', '#262626'];
    case 'defeat':
      return ['#6C1F1A', '#262626'];
    case 'captured':
      return ['#D17230', '#262626'];
    default:
      return ['#226C25', '#262626'];
  }
};