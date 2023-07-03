import { Wallet, utils, Provider, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider(hre.config.networks.zkSyncTestnet.url);
  
  const wallet = new Wallet("0xcc1149669c0f288ae228c316d93a8fd39b766a7d5ac3f41054f74e4ee7f1a09c").connect(provider);
  
  const deployer = new Deployer(hre, wallet);
  const deployAllocationArtifact = await deployer.loadArtifact("AllocationContract");
  const allocationArtifact = await hre.artifacts.readArtifact("AllocationContract");
  const daiArtifact = await hre.artifacts.readArtifact("@matterlabs/zksync-contracts/l2/system-contracts/openzeppelin/token/ERC20/IERC20.sol:IERC20");

  const daiWallet = new ethers.Contract(
    '0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b',
    daiArtifact.abi,
    wallet
  );
  
  let owner1Balance = await daiWallet.balanceOf('0x22d4B03b4bb34df01f5475875aeF671D802f0131');
  let owner2Balance = await daiWallet.balanceOf('0x21ea7171f198D5Cc53edF35984597Ce06A1Df572');
  let multisigBalance = await daiWallet.balanceOf('0x59E205078832B65439Ed2f0CE44bCd4C9f8145b4');

  console.log(`Before Sending Eth: owner1 and owner 2 balance ${owner1Balance} ${owner2Balance} ${multisigBalance}`);

};