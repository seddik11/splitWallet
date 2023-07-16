import { utils, Wallet, Provider } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import * as ethers from "ethers";

export default async function (hre: HardhatRuntimeEnvironment, paymasterAddress: string, supplierPK: string) {
    const provider = new Provider(hre.config.networks.zkSyncTestnet.url);
    const wallet = new Wallet(supplierPK).connect(provider);
  
    let paymasterBalance = await provider.getBalance(paymasterAddress);
    console.log(`Paymaster ETH balance is ${paymasterBalance.toString()}`);
  
    const paymasterReadArtifact = hre.artifacts.readArtifactSync("WithdrawPaymaster");
  
    const paymaster = new ethers.Contract(
      paymasterAddress,
      paymasterReadArtifact.abi,
      wallet
    );
  
    await (
      await paymaster.supply(
        {
        value: ethers.utils.parseEther("0.06")
      })
    ).wait();

    paymasterBalance = await provider.getBalance(paymasterAddress);
    console.log(`Paymaster ETH balance is ${paymasterBalance.toString()}`);
}
