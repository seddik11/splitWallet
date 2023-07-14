import { Wallet, utils, Provider, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const FACTORY_ADDRESS = "0xbB89aF8bF49680f155c6Ce94743828bA293F3957";
const TOKEN_ADDRESS = "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b";

 async function deployAA (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider(hre.config.networks.zkSyncTestnet.url);
  
  const wallet = new Wallet("0xcc1149669c0f288ae228c316d93a8fd39b766a7d5ac3f41054f74e4ee7f1a09c").connect(provider);
  
  const deployer = new Deployer(hre, wallet);
  const deployAllocationArtifact = await deployer.loadArtifact("SplitWallet");
  const allocationArtifact = await hre.artifacts.readArtifact("SplitWallet");
  const daiArtifact = await hre.artifacts.readArtifact("@matterlabs/zksync-contracts/l2/system-contracts/openzeppelin/token/ERC20/IERC20.sol:IERC20");

  const L2_ETH_TOKEN_ADDRESS = '0x000000000000000000000000000000000000800A';
  
  // console.log(`Deploying Facotry...`);
  
  const factoryArtifact = await deployer.loadArtifact('AAFactory');
  // const bytecodeHash = utils.hashBytecode(deployAllocationArtifact.bytecode);
  
  // const factory = await deployer.deploy(
  //   factoryArtifact,
  //   [bytecodeHash],
  //   undefined,
  //   [
  //     deployAllocationArtifact.bytecode,
  //   ]
  // );

  // console.log(`AA factory address: ${factory.address}`);

  const aaFactory = new ethers.Contract(
    FACTORY_ADDRESS,
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
    FACTORY_ADDRESS,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(['address', 'address', 'uint256', 'uint256'], [owner1.address, owner2.address, 70, 30])
  );
  console.log(`owner1 address: ${owner1.address} \n owner2 address: ${owner2.address}`);
  console.log(`Multisig account deployed on address ${multisigAddress}`);
  
  console.log('Sending dai to multisig address..');

  const daiWallet = new ethers.Contract(
    '0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b',
    daiArtifact.abi,
    wallet
  );
  
  let owner1Balance = await daiWallet.balanceOf(owner1.address);
  let owner2Balance = await daiWallet.balanceOf(owner2.address);

  console.log(`Before Sending Eth: owner1 and owner 2 balance ${owner1Balance} ${owner2Balance}`);

  await daiWallet.transfer(multisigAddress, ethers.utils.parseEther("0.001"));
  
  let multiDaiBalance = await daiWallet.balanceOf(multisigAddress);
  console.log(`Multisig dai balance ${multiDaiBalance}`);

  let multiEthBalance = await provider.getBalance(multisigAddress);
  console.log(`Multisig eth balance is ${multiEthBalance.toString()}`);
  
  // const allocationWallet = new ethers.Contract(
  //   multisigAddress,
  //   allocationArtifact.abi,
  //   wallet
  // );

  // let multisigBalance = await provider.getBalance(multisigAddress);

  // console.log(`Multisig eth balance is ${multisigBalance.toString()}`);
  
  // console.log('Sending funds from multisig..');

  // await allocationWallet.withdraw('0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b');
  
  // owner1Balance = await daiWallet.balanceOf(owner1.address);
  // owner2Balance = await daiWallet.balanceOf(owner2.address);
  // console.log(`After forwarding Eth: owner1 and owner 2 balance ${owner1Balance.toString()} ${owner2Balance.toString()}`);

  // multiBalance = await daiWallet.balanceOf(multisigAddress);
  // console.log(`Multisig dai balance ${multiBalance.toString()}`);
}

export default async function (hre: HardhatRuntimeEnvironment) {
  // 1. deploy AA factory and multisig account
  await deployAA(hre);

  // 3. use Paymaster to pat transaction fees to split and withdraw funds
  // DAI 0x07bd5ed37a946e4c54f1efb26f013245406fbf760ded5db962a9ce054570aa28
}

