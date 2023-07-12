import AppNavigation from './navigation/appNavigation';
import { TailwindProvider } from 'tailwindcss-react-native';


export default function App() {
  return (
    <TailwindProvider>
      <AppNavigation />
    </TailwindProvider>
  );
}
