import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains';

export const SUPPORTED_CHAINS = [
  { key: 'ethereum', chain: mainnet, name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io' },
  { key: 'base', chain: base, name: 'Base', symbol: 'ETH', explorer: 'https://basescan.org' },
  { key: 'arbitrum', chain: arbitrum, name: 'Arbitrum', symbol: 'ETH', explorer: 'https://arbiscan.io' },
  { key: 'optimism', chain: optimism, name: 'Optimism', symbol: 'ETH', explorer: 'https://optimistic.etherscan.io' },
  { key: 'polygon', chain: polygon, name: 'Polygon', symbol: 'POL', explorer: 'https://polygonscan.com' },
] as const;

export const USDC: Record<number, `0x${string}`> = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
};

export const ERC20_ABI = [
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { type: 'function', name: 'transfer', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
] as const;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;
