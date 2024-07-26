import { Stack } from 'expo-router';
import 'react-native-reanimated';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{}} />
    </Stack>
  );
}
