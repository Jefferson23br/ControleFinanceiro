import { useColorScheme } from './useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  defaultColor: string
): string {
  const theme = useColorScheme() ?? 'light';
  const colors = {
    light: '#FFF',
    dark: '#333',
  };
  return props[theme] ?? colors[theme] ?? defaultColor;
}