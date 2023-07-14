import { Wallet, utils, Provider, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://testnet.era.zksync.dev");
  
  const wallet1 = new Wallet("0xcc1149669c0f288ae228c316d93a8fd39b766a7d5ac3f41054f74e4ee7f1a09c").connect(provider);
  const deployer = new Deployer(hre, wallet1);

  const VotingToken = await hre.artifacts.readArtifact("MyToken");
  const deployVotingTokenArtifact = await deployer.loadArtifact("MyToken");
  
  // deploy contract
  const votingTokenContract = await deployer.deploy(deployVotingTokenArtifact, ['0xE5397854e5Efa5b487DcB5D39B1173608F74b728']);

  console.log(votingTokenContract.address);
}