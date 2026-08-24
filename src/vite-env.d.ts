/// <reference types="vite/client" />

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString(): string };
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
  disconnect: () => Promise<void>;
}

interface Window {
  solana?: PhantomProvider;
}
