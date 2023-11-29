import { useMutation } from '@tanstack/react-query';
import { Dec } from '@terra-money/feather.js';
import { useLCDClient } from '@terra-money/wallet-provider';
import { useApp } from '~/hooks/useApp';
import { SimulationSchema } from '~/schema/simulation';
import { Token } from '~/utils/constants';

type SwapParams = { amount: string; token: Token };

export function useSwapSimulation() {
	const lcd = useLCDClient();
	const { contract } = useApp();

	return useMutation(async (params: SwapParams) => {
		let query: any;

		if (params.token === Token.Luna) {
			const amount = new Dec(params.amount).times(1_000_000).toString();
			query = {
				simulation: {
					offer_asset: {
						amount,
						info: { native_token: { denom: 'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4' } },
					},
				},
			};
		} else {
			const amount = new Dec(params.amount).times(1_000_000).toString();
			query = {
				simulation: {
					offer_asset: {
						amount,
						info: { token: { contract_addr: contract.token } },
					},
				},
			};
		}

		const response = await lcd.wasm.contractQuery(contract.orneLunaPair, query);
		return SimulationSchema.parse(response);
	});
}
