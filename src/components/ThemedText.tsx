import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'default';
}

export default function ThemedText({ type = 'default', style, ...props }: ThemedTextProps) {
  return (
    <Text
      style={[styles[type], style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  default: {
    fontSize: 16,
    color: '#333',
  },
});