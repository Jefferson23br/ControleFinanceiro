import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from 'react';
import { initDatabase } from '@/services/database';

export default function Layout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="receita"
        options={{
          title: 'Receita',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="despesa"
        options={{
          title: 'Despesa',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="minus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="movimentacoes"
        options={{
          title: 'Movimentações',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="metas"
        options={{
          title: 'Metas',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bullseye" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}