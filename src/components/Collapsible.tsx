import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/useColorScheme';
import Colors from '../../constants/Colors';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export default function Collapsible({ title, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'dark'].icon }]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'dark'].text }]}>
          {title}
        </Text>
        <FontAwesome
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors[colorScheme ?? 'dark'].tint}
        />
      </TouchableOpacity>
      {isOpen && (
        <View
          style={[styles.content, { backgroundColor: Colors[colorScheme ?? 'dark'].background }]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
});