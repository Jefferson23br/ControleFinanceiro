import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import TabBarBackground from '@/components/ui/TabBarBackground';

interface ParallaxScrollViewProps {
  children: ReactNode;
  headerImage?: ReactNode;
}

export default function ParallaxScrollView({ children, headerImage }: ParallaxScrollViewProps) {
  const theme = useColorScheme();
  const backgroundColor = {
    light: '#FFF',
    dark: '#333',
  }[theme];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {headerImage && <View style={styles.header}>{headerImage}</View>}
      <ScrollView style={styles.scrollView}>
        {Platform.OS === 'ios' && <TabBarBackground />}
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    width: Dimensions.get('window').width,
  },
  scrollView: {
    flex: 1,
  },
});