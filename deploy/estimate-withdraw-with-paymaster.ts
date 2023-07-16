import { utils, Wallet, Provider } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import * as ethers from "ethers";

export default async function (hre: HardhatRuntimeEnvironment, paymasterAddress: string, splitWalletAddress: string) {
    const provider = new Provider("https://testnet.era.zksync.dev");

    // The wallet that will execute the withdraw via the paymaster
    const emptyWallet = Wallet.createRandom().connect(provider);
  
    const paymasterReadArtifact = hre.artifacts.readArtifactSync("WithdrawPaymaster");
  
    const paymaster = new ethers.Contract(
      paymasterAddress,
      paymasterReadArtifact.abi,
      emptyWallet
    );

    const gasPrice = await provider.getGasPrice();

    // Estimate gas fee for the transaction
    const gasLimit = await paymaster.estimateGas.executeWithdraw(splitWalletAddress, {
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams: utils.getPaymasterParams(paymasterAddress, {
          type: "General",
          innerInput: new Uint8Array(),
        }),
      },
    });

    // Gas estimation:
    const fee = gasPrice.mul(gasLimit.toString());
    console.log(`Estimated ETH FEE (gasPrice * gasLimit): ${fee}`);

    return fee;
}
