import { type BigSource } from 'big.js';

export type NominalType<T extends BigSource> = { __type: T };
export type Micro = { __micro: true };
export type NoMicro = { __micro?: false };
export type u<T extends BigSource> = T & Micro;
export type WalletAddr = string & NominalType<'WalletAddr'>;
export type CW20Addr = string & NominalType<'CW20Addr'>;

export * from './tokens';
export * from './tx';
