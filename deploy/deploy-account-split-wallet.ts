import { utils, Wallet, Provider } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import * as ethers from "ethers";
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

export default async function (hre: HardhatRuntimeEnvironment, deployerPK: string, factoryAddress: string, owner1: Wallet, owner2: Wallet, bounty?: ethers.BigNumber) {
  // Private key of the account used to deploy
  const provider = new Provider(hre.config.networks.zkSyncTestnet.url);
  const wallet = new Wallet(deployerPK).connect(provider);
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact('AAFactory');
  
  const aaFactory = new ethers.Contract(
    factoryAddress,
    factoryArtifact.abi,
    wallet
  );

  const salt = ethers.constants.HashZero;

 
  // deploy account owned by owner1 & owner2
  const tx = await aaFactory.deployAccount(
    salt,
    owner1.address,
    owner2.address,
    70,
    30,
    bounty ?? ethers.utils.parseEther("0.01")
  );
  await tx.wait();

  // Getting the address of the deployed contract account
  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    factoryAddress,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(['address', 'address', 'uint256', 'uint256', 'uint256'], [owner1.address, owner2.address, 70, 30, bounty ?? ethers.utils.parseEther("0.01")])
  );
  
  console.log(`Multisig account deployed on address ${multisigAddress}`);

  return multisigAddress;
}
