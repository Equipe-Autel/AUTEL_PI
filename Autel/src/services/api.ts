import { Platform } from 'react-native';

// URL base da API
// - Emulador Android: usa 'http://10.0.2.2:3000'
// - Simulador iOS / Web: usa 'http://localhost:3000'
// - Celular Físico (Expo Go): Mude para o IP do seu computador na rede local (ex: 'http://192.168.1.15:3000')
export const API_URL = Platform.select({
  android: 'http://192.168.1.15:3000',
  default: 'http://localhost:3000',
});

console.log('[API] URL base configurada:', API_URL);
