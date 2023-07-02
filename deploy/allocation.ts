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
  
  console.log(`Deploying Facotry...`);
  
  const factoryArtifact = await deployer.loadArtifact('AAFactory');
  const bytecodeHash = utils.hashBytecode(deployAllocationArtifact.bytecode);
  
  const factory = await deployer.deploy(
    factoryArtifact,
    [bytecodeHash],
    undefined,
    [
      // Since the factory requires the code of the multisig to be available,
      // we should pass it here as well.
      deployAllocationArtifact.bytecode,
    ]
  );

  console.log(`AA factory address: ${factory.address}`);

  const aaFactory = new ethers.Contract(
    factory.address,
    factoryArtifact.abi,
    wallet
  );
  
  // The two owners of the multisig
  const owner1 = Wallet.createRandom();
  const owner2 = Wallet.createRandom();

  const salt = ethers.constants.HashZero;

 
  console.log(`deploying account owned by owner1 & owner2..`)
  // deploy account owned by owner1 & owner2
  const tx = await aaFactory.deployAccount(
    salt,
    owner1.address,
    owner2.address,
    70,
    30
  );
  await tx.wait();

  // Getting the address of the deployed contract account
  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    factory.address,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(['address', 'address'], [owner1.address, owner2.address])
  );
  console.log(`Multisig account deployed on address ${multisigAddress}`);
  
  await (
     await wallet.sendTransaction({
       to: multisigAddress,
       // You can increase the amount of ETH sent to the multisig
       value: ethers.utils.parseEther("0.01"),
     })
   ).wait();
  
  let owner1Balance = await provider.getBalance(owner1.address);
  let owner2Balance = await provider.getBalance(owner2.address);

  console.log(`Before Sending Eth: owner1 and owner 2 balance ${owner1Balance} ${owner2Balance}`);
  
   await (
     await wallet.sendTransaction({
       to: multisigAddress,
       // You can increase the amount of ETH sent to the multisig
       value: ethers.utils.parseEther("0.01"),
     })
   ).wait();
  
  owner1Balance = await provider.getBalance(owner1.address);
  owner2Balance = await provider.getBalance(owner2.address);
  console.log(`After Sending Eth: owner1 and owner 2 balance ${owner1Balance} ${owner2Balance}`);
  
  let multiBalance = await provider.getBalance(multisigAddress);
  console.log(`Multisig account balance ${multiBalance}`);
  
  const allocationWallet = new ethers.Contract(
    multisigAddress,
    allocationArtifact.abi,
    wallet
  );
  
  console.log('Sending funds from multisig..');
  
  const trx = await allocationWallet.forwardEth();
  console.log(trx);
  
  owner1Balance = await provider.getBalance(owner1.address);
  owner2Balance = await provider.getBalance(owner2.address);
  console.log(`After forwarding Eth: owner1 and owner 2 balance ${owner1Balance} ${owner2Balance}`);
  
  multiBalance = await provider.getBalance(multisigAddress);
  console.log(`After forwarding Eth: Multisig account balance ${multiBalance}`);
  
}