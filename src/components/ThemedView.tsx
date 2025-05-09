import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../../constants/Colors';

interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export default function ThemedView({ style, lightColor, darkColor, ...props }: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    Colors.dark.background // #1C2526
  );

  return <View style={[styles.container, { backgroundColor }, style]} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});