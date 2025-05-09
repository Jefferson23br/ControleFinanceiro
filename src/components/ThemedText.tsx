import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import Colors from '../../constants/Colors';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'default';
}

export default function ThemedText({ type = 'default', style, ...props }: ThemedTextProps) {
  const colorScheme = useColorScheme();

  return (
    <Text
      style={[
        styles[type],
        { color: Colors[colorScheme ?? 'dark'].text }, // #ECEDEE
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  default: {
    fontSize: 16,
  },
});