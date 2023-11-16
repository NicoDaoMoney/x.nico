import { string } from '@orne/utils';
import { Dec } from '@terra-money/feather.js';
import { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { useDebounce } from 'use-debounce';
import swapCurrency from '~/assets/swap-currency.svg';
import { AmountInput } from '~/components/form/AmountInput';
import { useLPBalance } from '~/hooks/useLPBalance';
import { useShare } from '~/hooks/useShare';
import { useWithdrawLiquidity } from '~/hooks/useWithdrawLiquidity';
import { Token } from '~/utils/constants';
import { readAmount } from '~/utils/readAmount';
import { readAmounts } from '~/utils/readAmounts';
import { Button } from '../ui/Button';
import { IconToken } from '../ui/IconToken';

export function WithdrawForm() {
	const { data: lpBalance, isLoading } = useLPBalance();

	const [amount, setAmount] = useState('');
	const [debouncedAmount] = useDebounce(amount, 700);
	const { data: withdrawing, isLoading: isLoadingShare } = useShare(+debouncedAmount);
	const { mutate: withdraw } = useWithdrawLiquidity();

	function handleSubmit() {
		withdraw(
			{ amount: new Dec(string.transformToValidInput(amount)) },
			{
				onSuccess() {
					setAmount('');
				},
			}
		);
	}

	return (
  <>
    <div className="mb-5 flex items-center gap-2">
      <h2 className="text-3xl font-semibold">
        Withdraw <span className="text-green">LP</span>
      </h2>
      {/* <button className="border-green bg-green25 hover:bg-green flex h-7 items-center justify-center rounded-lg border px-3 font-semibold transition-colors hover:text-white">
        Max
      </button> */}
    </div>

    <div className="mb-10 flex flex-col items-center gap-8">
      <div className="w-full flex-1">
        <div className="bg-offWhite flex h-32 flex-1 flex-col justify-center rounded-lg p-8 shadow-sm">
          <div className="flex w-full justify-between">
            <span className="text-darkBlue50 mb-3">Balance</span>
            <div className="-mt-2 flex items-center gap-2">
              <span className="text-darkBlue50">
                {isLoading ? (
                  <ThreeDots color="hsl(203,23%,42%)" height="10" />
                ) : (
                  readAmounts(lpBalance?.stakedLPBalance)
                )}
              </span>
              {/* <button className="border-green bg-green25 hover:bg-green flex h-7 items-center justify-center rounded-lg border px-3 font-semibold transition-colors hover:text-white">
                Max
              </button> */}
            </div>
          </div>
          <div className="flex justify-between">
            <AmountInput className="bg-offWhite text-2xl font-semibold" value={amount} onChange={setAmount} />
            {/* Removed columns for ORNE and LUNA */}
          </div>
        </div>
      </div>

      {/* Removed "Swap currency" section */}
      
      {/* Removed columns for ORNE and LUNA */}
    </div>

    <Button className="mb-14" onClick={handleSubmit}>
      Burn xNICO
    </Button>
  </>
);
};
