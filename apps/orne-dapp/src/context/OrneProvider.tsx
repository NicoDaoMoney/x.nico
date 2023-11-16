import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { createContext, useMemo } from 'react';
import { Triangle } from 'react-loader-spinner';
import type { ReactNode } from 'react';

type Contracts = 'token' | 'orneLunaPair' | 'lunaUsdcPair' | 'lp' | 'company' | 'astroGenerator' | 'presale';
export type ContractAddress = Record<Contracts, string>;

const kTestnetContract: ContractAddress = {
	token: 'terra1e0efrrrj8d55pflme3dmtyuj7klzcef5cfmz6r2jyqz77kk2jz3qa6drg3',
	orneLunaPair: 'terra1s2txvndlu5fezsq3f7zgtrw0pk3ryw0lxq9nfgzuqr3hhlnc92xsghwnzm',
	lunaUsdcPair: 'terra16u6xa76krku3ykxck44x39s62za7qhsh8gr7sk9jwgt8nndwwjnq7c2zr4',
	lp: 'terra1h2um6wajtjsea2kec0saajlxrqghfmzm98hpkxhnn97utvszzyuqds6qa8',
	company: 'terra102d7hvknwqegydy03kfpapj3zn3m7hschy90qy',
	astroGenerator: 'terra1gc4d4v82vjgkz0ag28lrmlxx3tf6sq69tmaujjpe7jwmnqakkx0qm28j2l',
	presale: 'terra17wzrjl43t7wen3fd67t5qg9nzxeqkdffa7wrgr3k4rnv6fz5cv4qyff6c2',
};

const kMainnetContract: ContractAddress = {
	token: 'terra1e0efrrrj8d55pflme3dmtyuj7klzcef5cfmz6r2jyqz77kk2jz3qa6drg3',
	orneLunaPair: 'terra1s2txvndlu5fezsq3f7zgtrw0pk3ryw0lxq9nfgzuqr3hhlnc92xsghwnzm',
	lunaUsdcPair: 'terra1fd68ah02gr2y8ze7tm9te7m70zlmc7vjyyhs6xlhsdmqqcjud4dql4wpxr',
	lp: 'terra1h2um6wajtjsea2kec0saajlxrqghfmzm98hpkxhnn97utvszzyuqds6qa8',
	company: 'terra1swvw2l2ttg685usu660qql09yefy3mec5l08eu',
	astroGenerator: 'terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9',
	presale: 'terra17wzrjl43t7wen3fd67t5qg9nzxeqkdffa7wrgr3k4rnv6fz5cv4qyff6c2',
};

export type OrneContextData = {
	contract: ContractAddress;
};

export const OrneContext = createContext<OrneContextData | null>(null);

export function OrneProvider({ children }: { children: ReactNode }) {
	const { network, status } = useWallet();

	const contract = useMemo(() => {
		const isMainnet = Object.keys(network).some((chainId) => chainId.startsWith('phoenix'));

		return isMainnet ? kMainnetContract : kTestnetContract;
	}, [network]);

	if (status === WalletStatus.INITIALIZING) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					gap: '8px',
				}}
			>
				<Triangle ariaLabel="Loading the dApp" color="hsl(203,23%,42%)" />
				<h1>Orne.io</h1>
			</div>
		);
	}

	return <OrneContext.Provider value={{ contract }}>{children}</OrneContext.Provider>;
}
