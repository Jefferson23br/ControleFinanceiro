import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="despesa" options={{ title: 'Despesa' }} />
        <Stack.Screen name="receita" options={{ title: 'Receita' }} />
        <Stack.Screen name="movimentacoes" options={{ title: 'Movimentações' }} />
        <Stack.Screen name="metas" options={{ title: 'Metas' }} />
        <Stack.Screen name="configuracoes" options={{ title: 'Configurações' }} />
        <Stack.Screen name="config/gerenciar-contas" options={{ title: 'Gerenciar Contas' }} />
        <Stack.Screen name="config/gerenciar-categorias" options={{ title: 'Gerenciar Categorias' }} />
      </Stack>
    </SafeAreaProvider>
  );
}