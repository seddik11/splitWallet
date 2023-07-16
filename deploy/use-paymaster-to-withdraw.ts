import { utils, Wallet, Provider } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import * as ethers from "ethers";

export default async function (hre: HardhatRuntimeEnvironment, paymasterAddress: string, splitWalletAddress: string) {
    const provider = new Provider("https://testnet.era.zksync.dev");

    // The wallet that will receive ERC20 tokens
    const emptyWallet = Wallet.createRandom().connect(provider);
    console.log(`Empty wallet's address: ${emptyWallet.address}`);
  
     // Encoding the "ApprovalBased" paymaster flow's input
     const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
       type: "General",
       innerInput: new Uint8Array(),
     });
  
    const paymasterReadArtifact = hre.artifacts.readArtifactSync("WithdrawPaymaster");
  
    const paymaster = new ethers.Contract(
      paymasterAddress,
      paymasterReadArtifact.abi,
      emptyWallet
    );
  
    await (
      await paymaster.executeWithdraw(
        splitWalletAddress,
        {
        // paymaster info
        customData: {
          paymasterParams: paymasterParams,
          gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        },
      })
    ).wait();
  
}
