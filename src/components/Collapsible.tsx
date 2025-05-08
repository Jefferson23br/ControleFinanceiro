import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export default function Collapsible({ title, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.title}>{title}</Text>
        <FontAwesome name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#007AFF" />
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
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
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: 4,
  },
});