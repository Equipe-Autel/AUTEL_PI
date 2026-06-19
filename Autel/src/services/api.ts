import { Platform } from 'react-native';

// URL base da API
// - Celular Físico (Expo Go): Mude para o IP atual do seu computador na rede local (ex: 'http://172.16.215.114:3000')
// - Emulador Android: usa 'http://10.0.2.2:3000'
// - Simulador iOS / Web: usa 'http://localhost:3000'
export const API_URL = Platform.select({
  android: 'http://172.16.215.114:3000', // Mude para 'http://10.0.2.2:3000' se estiver usando o emulador Android
  ios: 'http://172.16.215.114:3000',     // Mude para 'http://localhost:3000' se estiver usando o simulador iOS
  default: 'http://172.16.215.114:3000', // Mude para 'http://localhost:3000' se estiver usando Web
});

console.log('[API] URL base configurada:', API_URL);
