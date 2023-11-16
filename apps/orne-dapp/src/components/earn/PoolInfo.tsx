import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { ThreeDots } from 'react-loader-spinner';
import { PoolStakedToken } from '~/components/earn/PoolStakedToken';
import { IconToken } from '~/components/ui/IconToken';
import { useOrneTokenData } from '~/hooks/useOrneTokenData';
import { Token } from '~/utils/constants';
import { readAmount } from '~/utils/readAmount';
import { readAmounts } from '~/utils/readAmounts';
import { readPercent } from '~/utils/readPercent';

export function PoolInfo() {
	const { status } = useWallet();
	const { totalLiquidity, APR, isLoading } = useOrneTokenData();

	return (
		<div className="bg-offWhite flex flex-1 flex-col justify-between gap-10 rounded-lg p-8 pb-14 shadow-sm lg:flex-row lg:items-center lg:pb-8">
			<div className="flex flex-col">
				<span className="mb-2 text-lg font-semibold">NICO / axlUSDC</span>
				<div className="flex gap-2">
					<IconToken name={Token.Orne} size={36} />
					<IconToken name={Token.Luna} size={36} />
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<span className="text-darkBlue50">APR</span>

				<span className="text-2xl font-semibold">
					{isLoading ? <ThreeDots color="hsl(203,23%,42%)" height="10" /> : `${readPercent(APR)}%`}
				</span>
			</div>
			<div className="flex flex-col gap-2">
				<span className="text-darkBlue50">Liquidity</span>
				<span className="text-2xl font-semibold">
					<span className="text-base">$</span>{' '}
					{isLoading ? <ThreeDots color="hsl(203,23%,42%)" height="10" /> : readAmounts(totalLiquidity)}
				</span>
			</div>
			{status === WalletStatus.WALLET_NOT_CONNECTED && <span>Connect your wallet to see your info</span>}{' '}
			{status === WalletStatus.WALLET_CONNECTED && <PoolStakedToken />}
			{/*<div className="flex flex-col gap-2">*/}
			{/*	<span className="text-darkBlue50">Rewards</span>*/}
			{/*	<div className="relative flex gap-3">*/}
			{/*		<div>*/}
			{/*			<span className="text-2xl font-semibold">*/}
			{/*				145.68 <span className="text-base font-normal">ORNE</span>*/}
			{/*			</span>*/}
			{/*			<span className="text-green absolute -bottom-5 left-0 text-sm">+ 45.68 ASTRO</span>*/}
			{/*		</div>*/}
			{/*		<button className="border-green hover:bg-green flex h-7 items-center justify-center rounded-lg border px-3 font-semibold transition-colors hover:text-white">*/}
			{/*			Claim*/}
			{/*		</button>*/}
			{/*	</div>*/}
			{/*</div>*/}
		</div>
	);
}
