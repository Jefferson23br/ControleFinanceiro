import { useColorScheme } from './useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  defaultColor: string
): string {
  const theme = useColorScheme();
  return props[theme] ?? defaultColor;
}