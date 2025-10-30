import { hexlify, getAddress } from "ethers";

declare global {
  interface Window {
    relayerSDK?: {
      initSDK: () => Promise<void>;
      createInstance: (config: Record<string, unknown>) => Promise<any>;
      SepoliaConfig: Record<string, unknown>;
    };
    ethereum?: any;
    okxwallet?: any;
  }
}

let fheInstance: any = null;
let sdkPromise: Promise<any> | null = null;

const SDK_URL = 'https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.js';

/**
 * Dynamically load Zama FHE SDK from CDN
 */
const loadSdk = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    throw new Error('FHE SDK requires browser environment');
  }

  if (window.relayerSDK) {
    return window.relayerSDK;
  }

  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SDK_URL}"]`) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve(window.relayerSDK));
        existing.addEventListener('error', () => reject(new Error('Failed to load FHE SDK')));
        return;
      }

      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      script.onload = () => {
        if (window.relayerSDK) {
          resolve(window.relayerSDK);
        } else {
          reject(new Error('relayerSDK unavailable after load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load FHE SDK'));
      document.body.appendChild(script);
    });
  }

  return sdkPromise;
};

/**
 * Initialize FHE instance with Sepolia network configuration
 */
export async function initializeFHE(provider?: any): Promise<any> {
  if (fheInstance) {
    return fheInstance;
  }

  if (typeof window === 'undefined') {
    throw new Error('FHE SDK requires browser environment');
  }

  const ethereumProvider = provider ||
    window.ethereum ||
    (window as any).okxwallet?.provider ||
    (window as any).okxwallet ||
    (window as any).coinbaseWalletExtension;

  if (!ethereumProvider) {
    throw new Error('Ethereum provider not found. Please connect your wallet first.');
  }

  console.log('🔌 Using Ethereum provider');

  const sdk = await loadSdk();
  if (!sdk) {
    throw new Error('FHE SDK not available');
  }

  await sdk.initSDK();

  const config = {
    ...sdk.SepoliaConfig,
    network: ethereumProvider,
  };

  fheInstance = await sdk.createInstance(config);
  console.log('✅ FHE instance initialized for Sepolia');

  return fheInstance;
}

/**
 * Encrypt uint32 value (for age)
 */
export async function encryptAge(
  age: number,
  contractAddress: string,
  userAddress: string,
  provider?: any
): Promise<{ handle: string; proof: string }> {
  const fhe = await initializeFHE(provider);
  const checksumAddress = getAddress(contractAddress);

  const input = fhe.createEncryptedInput(checksumAddress, userAddress);
  input.add32(age);

  const { handles, inputProof } = await input.encrypt();

  return {
    handle: hexlify(handles[0]),
    proof: hexlify(inputProof),
  };
}

/**
 * Encrypt uint8 value (for nationality code, document type)
 */
export async function encryptUint8(
  value: number,
  contractAddress: string,
  userAddress: string,
  provider?: any
): Promise<{ handle: string; proof: string }> {
  const fhe = await initializeFHE(provider);
  const checksumAddress = getAddress(contractAddress);

  const input = fhe.createEncryptedInput(checksumAddress, userAddress);
  input.add8(value);

  const { handles, inputProof } = await input.encrypt();

  return {
    handle: hexlify(handles[0]),
    proof: hexlify(inputProof),
  };
}

/**
 * Encrypt complete KYC data in single proof
 * @param age User's age
 * @param nationality Nationality code (0-255)
 * @param documentType Document type (1=Passport, 2=ID, 3=Driver's License)
 * @param contractAddress KYC contract address
 * @param userAddress User's wallet address
 * @param provider Ethereum provider
 */
export async function encryptKYC(
  age: number,
  nationality: number,
  documentType: number,
  contractAddress: string,
  userAddress: string,
  provider?: any
): Promise<{
  ageHandle: string;
  nationalityHandle: string;
  docTypeHandle: string;
  proof: string;
}> {
  const fhe = await initializeFHE(provider);
  const checksumAddress = getAddress(contractAddress);

  const input = fhe.createEncryptedInput(checksumAddress, userAddress);

  input.add32(age);
  input.add8(nationality);
  input.add8(documentType);

  const { handles, inputProof } = await input.encrypt();

  return {
    ageHandle: hexlify(handles[0]),
    nationalityHandle: hexlify(handles[1]),
    docTypeHandle: hexlify(handles[2]),
    proof: hexlify(inputProof),
  };
}
