import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from '@/services/database'; // Importar para inicializar o banco

export default function RootLayout() {
  // Inicializar o banco de dados na inicialização do app
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#333',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="receita"
        options={{
          title: 'Receita',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="despesa"
        options={{
          title: 'Despesa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="remove-circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="movimentacoes"
        options={{
          title: 'Movimentações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

// Componente Ionicons para os ícones das tabs
import Ionicons from '@expo/vector-icons/Ionicons';