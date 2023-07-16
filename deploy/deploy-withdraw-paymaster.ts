import { Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// DAI
const TOKEN_ADDRESS = "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b";

export default async function (hre: HardhatRuntimeEnvironment, deployerPK: string, bounty: number) {
  const wallet = new Wallet(deployerPK);

  const deployer = new Deployer(hre, wallet);

  // Deploying the paymaster
  const paymasterArtifact = await deployer.loadArtifact(
    "WithdrawPaymaster"
  );
  const paymaster = await deployer.deploy(paymasterArtifact, [
    TOKEN_ADDRESS,
    bounty
  ]);
  console.log(`Paymaster address: ${paymaster.address}`);

  // Supplying paymaster with ETH.
  // await (
  //   await deployer.zkWallet.sendTransaction({
  //     to: paymaster.address,
  //     value: ethers.utils.parseEther("0.05"),
  //   })
  // ).wait();

  return paymaster.address;
}