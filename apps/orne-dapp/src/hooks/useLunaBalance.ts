import { oneMinute } from '@orne/utils/src/time';
import { useQuery } from '@tanstack/react-query';
import { useLCDClient } from '@terra-money/wallet-provider';
import { queryKeys } from '~/hooks/queryKeys';
import { useConnectedWallet } from '~/hooks/useConnectedWallet';

export function useLunaBalance() {
	const lcd = useLCDClient();
	const connectedWallet = useConnectedWallet();

	if (!connectedWallet) {
		throw new Error("Can't get balance without connected wallet");
	}

	return useQuery({
		queryKey: queryKeys.balanceLuna(connectedWallet.terraAddress),
		queryFn: async () => {
			const [coins] = await lcd.bank.balance(connectedWallet.terraAddress);

			return { balance: coins.get('ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4')?.amount.toString() };
		},
		staleTime: oneMinute,
	});
}
