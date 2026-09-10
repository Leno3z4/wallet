import { arbitrum, arbitrumSepolia, base, baseSepolia, mainnet, optimism, optimismSepolia, polygon, polygonAmoy, sepolia } from 'viem/chains';

export const MAINNET_CHAINS = [
  { key: 'ethereum', chain: mainnet, name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io', environment: 'mainnet' },
  { key: 'base', chain: base, name: 'Base', symbol: 'ETH', explorer: 'https://basescan.org', environment: 'mainnet' },
  { key: 'arbitrum', chain: arbitrum, name: 'Arbitrum', symbol: 'ETH', explorer: 'https://arbiscan.io', environment: 'mainnet' },
  { key: 'optimism', chain: optimism, name: 'Optimism', symbol: 'ETH', explorer: 'https://optimistic.etherscan.io', environment: 'mainnet' },
  { key: 'polygon', chain: polygon, name: 'Polygon', symbol: 'POL', explorer: 'https://polygonscan.com', environment: 'mainnet' },
] as const;

export const TESTNET_CHAINS = [
  { key: 'ethereum-sepolia', chain: sepolia, name: 'Ethereum Sepolia', symbol: 'ETH', explorer: 'https://sepolia.etherscan.io', environment: 'testnet' },
  { key: 'base-sepolia', chain: baseSepolia, name: 'Base Sepolia', symbol: 'ETH', explorer: 'https://sepolia.basescan.org', environment: 'testnet' },
  { key: 'arbitrum-sepolia', chain: arbitrumSepolia, name: 'Arbitrum Sepolia', symbol: 'ETH', explorer: 'https://sepolia.arbiscan.io', environment: 'testnet' },
  { key: 'optimism-sepolia', chain: optimismSepolia, name: 'Optimism Sepolia', symbol: 'ETH', explorer: 'https://sepolia-optimism.etherscan.io', environment: 'testnet' },
  { key: 'polygon-amoy', chain: polygonAmoy, name: 'Polygon Amoy', symbol: 'POL', explorer: 'https://amoy.polygonscan.com', environment: 'testnet' },
] as const;

export const SUPPORTED_CHAINS = [...MAINNET_CHAINS, ...TESTNET_CHAINS] as const;

export type SupportedChain = (typeof SUPPORTED_CHAINS)[number];

export const USDC: Record<number, `0x${string}`> = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
  11155420: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
  80002: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
};

export const ERC20_ABI = [
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { type: 'function', name: 'transfer', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
] as const;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

export const CIRCLE_CCTP = {
  mainnet: {
    tokenMessengerV2: '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d' as `0x${string}`,
    messageTransmitterV2: '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64' as `0x${string}`,
    domains: { ethereum: 0, arbitrum: 3, optimism: 2, base: 6, polygon: 7 },
  },
  testnet: {
    tokenMessengerV2: '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA' as `0x${string}`,
    messageTransmitterV2: '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275' as `0x${string}`,
    domains: { 'ethereum-sepolia': 0, 'arbitrum-sepolia': 3, 'optimism-sepolia': 2, 'base-sepolia': 6, 'polygon-amoy': 7 },
  },
} as const;
