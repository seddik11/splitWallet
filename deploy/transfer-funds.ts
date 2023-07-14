import { Wallet, utils, Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://testnet.era.zksync.dev");
  // Private key of the account used to deploy
  const wallet = new Wallet("0xcc1149669c0f288ae228c316d93a8fd39b766a7d5ac3f41054f74e4ee7f1a09c").connect(provider);
  
  await (
    await wallet.sendTransaction({
      to: '0x621698EfE5F6F936591B0e0CA1dC6b8746d2dA20',
      // You can increase the amount of ETH sent to the multisig
      value: ethers.utils.parseEther("0.35"),
    })
  ).wait();
  
  console.log(ethers.utils.parseEther("0.00000000002"));
}
