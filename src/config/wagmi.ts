import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'IdentityChain',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [sepolia],
  ssr: false,
});
