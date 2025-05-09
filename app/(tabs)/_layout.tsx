import { Tabs } from 'expo-router';
import { useColorScheme } from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'dark'].background, // #1C2526
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explorar' }} />
      <Tabs.Screen name="movimentacoes" options={{ title: 'Movimentações' }} />
      <Tabs.Screen name="despesa" options={{ title: 'Despesa' }} />
      <Tabs.Screen name="receita" options={{ title: 'Receita' }} />
      <Tabs.Screen name="metas" options={{ title: 'Metas' }} />
      <Tabs.Screen name="configuracoes" options={{ title: 'Configurações' }} />
    </Tabs>
  );
}