import { Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const PRIVATE_KEY =
  "0xcc1149669c0f288ae228c316d93a8fd39b766a7d5ac3f41054f74e4ee7f1a09c";

const TOKEN_ADDRESS = "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet(PRIVATE_KEY);

  const deployer = new Deployer(hre, wallet);

  // Deploying the paymaster
  const paymasterArtifact = await deployer.loadArtifact(
    "WithdrawPaymaster"
  );
  const paymaster = await deployer.deploy(paymasterArtifact, [
    TOKEN_ADDRESS,
  ]);
  console.log(`Paymaster address: ${paymaster.address}`);

  // Supplying paymaster with ETH.
  await (
    await deployer.zkWallet.sendTransaction({
      to: paymaster.address,
      value: ethers.utils.parseEther("0.05"),
    })
  ).wait();

  console.log(`Done!`);
}

// Paymaster address: 0x1960A90406C368D17b01D63B6554b749Cbd00a1C