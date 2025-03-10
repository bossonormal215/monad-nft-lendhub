export interface Wallet {
  address: string;
  getEthereumProvider: () => Promise<any>;
}
