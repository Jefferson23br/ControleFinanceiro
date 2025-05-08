import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import ThemedText from '@/components/ThemedText';

export function HelloWave() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '30deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <ThemedText style={{ fontSize: 24 }}>👋</ThemedText>
    </Animated.View>
  );
}