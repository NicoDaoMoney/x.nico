import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Coin, Dec, MsgExecuteContract } from '@terra-money/feather.js';
import { ContractAddress } from '~/context/OrneProvider';
import { queryKeys } from '~/hooks/queryKeys';
import { useApp } from '~/hooks/useApp';
import { useConnectedWallet } from '~/hooks/useConnectedWallet';
import { useTerraNetwork } from '~/hooks/useTerraNetwork';
import { useTransactionResolver } from '~/stores/transactionResolver';

export function useProvideLiquidity() {
	const app = useApp();
	const network = useTerraNetwork();
	const connectedWallet = useConnectedWallet();
	const queryClient = useQueryClient();
	const push = useTransactionResolver((state) => state.push);

	if (!connectedWallet || !network) {
		throw new Error('useProvideLiquidity must be used within a connected wallet and network context');
	}

	return useMutation({
		mutationFn: async (params: Omit<ProvideLiquidityParams, 'contract' | 'terraAddress'>) => {
			const { increaseAllowanceMsg, provideLiquidityMsg } = computeProvideLiquidityMessage({
				...params,
				contract: app.contract,
				terraAddress: connectedWallet.terraAddress,
			});

			const tx = await connectedWallet.post({
				chainID: network.chainID,
				feeDenoms: ['uluna'],
				gasAdjustment: 1.6,
				gasPrices: { uluna: '0.015' },
				msgs: [increaseAllowanceMsg, provideLiquidityMsg],
			});

			push({
				txResult: tx,
				callback() {
					void queryClient.invalidateQueries(queryKeys.poolRoot);
					void queryClient.invalidateQueries(queryKeys.balanceRoot);
				},
			});
		},
	});
}

interface ProvideLiquidityParams {
	amountOrne: Dec;
	amountLuna: Dec;
	contract: ContractAddress;
	terraAddress: string;
}

function computeProvideLiquidityMessage(params: ProvideLiquidityParams) {
	const amountOrne = params.amountOrne.times(1_000_000).toString();
	const amountLuna = params.amountLuna.times(1_000_000).toString();

	const increaseAllowanceMessage = {
		increase_allowance: {
			amount: amountOrne,
			spender: params.contract.orneLunaPair,
		},
	};

	const provideLiquidityMessage = {
		provide_liquidity: {
			assets: [
				{
					amount: amountLuna,
					info: {
						native_token: {
							denom: 'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4',
						},
					},
				},
				{
					amount: amountOrne,
					info: {
						token: {
							contract_addr: params.contract.token,
						},
					},
				},
			],
			auto_stake: true,
			slippage_tolerance: '0.02',
		},
	};

	const increaseAllowanceMsg = new MsgExecuteContract(
		params.terraAddress,
		params.contract.token,
		increaseAllowanceMessage
	);

	const provideLiquidityMsg = new MsgExecuteContract(
		params.terraAddress,
		params.contract.orneLunaPair,
		provideLiquidityMessage,
		[new Coin('ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4', amountLuna)]
	);

	return { increaseAllowanceMsg, provideLiquidityMsg };
}
