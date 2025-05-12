import { View } from 'react-native';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from './src/services/database';

export default function App() {
  useEffect(() => {
    (async () => {
      try {
        await initDatabase();
        console.log('Banco de dados inicializado com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}