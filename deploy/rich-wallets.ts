import { Provider, Wallet } from "zksync-web3";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as ethers from "ethers";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script...`);
  const provider = new Provider("http://localhost:3050");

  const RICH_WALLET_1 = new Wallet(
    "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110",
  );
  const RICH_WALLET_2 = new Wallet(
    "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3",
  );
  const RICH_WALLET_3 = new Wallet(
    "0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e",
  );
  const RICH_WALLET_4 = new Wallet(
    "0x850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8",
  );
  const RICH_WALLET_5 = new Wallet(
    "0xf12e28c0eb1ef4ff90478f6805b68d63737b7f33abfa091601140805da450d93",
  );
  const RICH_WALLET_6 = new Wallet(
    "0xe667e57a9b8aaa6709e51ff7d093f1c5b73b63f9987e4ab4aa9a5c699e024ee8",
  );
  const RICH_WALLET_7 = new Wallet(
    "0x28a574ab2de8a00364d5dd4b07c4f2f574ef7fcc2a86a197f65abaec836d1959",
  );
  const RICH_WALLET_8 = new Wallet(
    "0x74d8b3a188f7260f67698eb44da07397a298df5427df681ef68c45b34b61f998",
  );
  const RICH_WALLET_9 = new Wallet(
    "0xbe79721778b48bcc679b78edac0ce48306a8578186ffcb9f2ee455ae6efeace1",
  );
  const RICH_WALLET_10 = new Wallet(
    "0x3eb15da85647edd9a1159a4a13b9e7c56877c4eb33f614546d4db06a51868b1c",
  );

  let rich_wallet_1_balance = await provider.getBalance(RICH_WALLET_1.address);
  let rich_wallet_2_balance = await provider.getBalance(RICH_WALLET_2.address);
  let rich_wallet_3_balance = await provider.getBalance(RICH_WALLET_3.address);
  let rich_wallet_4_balance = await provider.getBalance(RICH_WALLET_4.address);
  let rich_wallet_5_balance = await provider.getBalance(RICH_WALLET_5.address);
  let rich_wallet_6_balance = await provider.getBalance(RICH_WALLET_6.address);
  let rich_wallet_7_balance = await provider.getBalance(RICH_WALLET_7.address);
  let rich_wallet_8_balance = await provider.getBalance(RICH_WALLET_8.address);
  let rich_wallet_9_balance = await provider.getBalance(RICH_WALLET_9.address);
  let rich_wallet_10_balance = await provider.getBalance(
    RICH_WALLET_10.address,
  );

  console.log(
    `Rich wallet 1 ETH balance is now ${ethers.utils.formatEther(rich_wallet_1_balance).toString()}`,
  );
  console.log(
    `Rich wallet 2 ETH balance is now ${ethers.utils.formatEther(rich_wallet_2_balance).toString()}`,
  );
  console.log(
    `Rich wallet 3 ETH balance is now ${ethers.utils.formatEther(rich_wallet_3_balance).toString()}`,
  );
  console.log(
    `Rich wallet 4 ETH balance is now ${ethers.utils.formatEther(rich_wallet_4_balance).toString()}`,
  );
  console.log(
    `Rich wallet 5 ETH balance is now ${ethers.utils.formatEther(rich_wallet_5_balance).toString()}`,
  );
  console.log(
    `Rich wallet 6 ETH balance is now ${ethers.utils.formatEther(rich_wallet_6_balance).toString()}`,
  );
  console.log(
    `Rich wallet 7 ETH balance is now ${ethers.utils.formatEther(rich_wallet_7_balance).toString()}`,
  );
  console.log(
    `Rich wallet 8 ETH balance is now ${ethers.utils.formatEther(rich_wallet_8_balance).toString()}`,
  );
  console.log(
    `Rich wallet 9 ETH balance is now ${ethers.utils.formatEther(rich_wallet_9_balance).toString()}`,
  );
  console.log(
    `Rich wallet 10 ETH balance is now ${ethers.utils.formatEther(rich_wallet_10_balance).toString()}`,
  );

  console.log(`Done!`);
}