import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import ThemedView from '@/components/ThemedView';

export default function ParallaxScrollView({ children, style, ...props }: ScrollViewProps) {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={style} {...props}>
        {children}
      </ScrollView>
    </ThemedView>
  );
}