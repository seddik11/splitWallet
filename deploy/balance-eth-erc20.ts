import { utils, Wallet, Provider } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import * as ethers from "ethers";
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';


export async function sendDai (hre: HardhatRuntimeEnvironment, deployerPK: string, destination: string) {
  const daiArtifact = await hre.artifacts.readArtifact("@matterlabs/zksync-contracts/l2/system-contracts/openzeppelin/token/ERC20/IERC20.sol:IERC20");
    // Private key of the account used to deploy
  const provider = new Provider(hre.config.networks.zkSyncTestnet.url);
  const wallet = new Wallet(deployerPK).connect(provider);

  const daiWallet = new ethers.Contract(
    '0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b',
    daiArtifact.abi,
    wallet
  );

  await (await daiWallet.transfer(destination, ethers.utils.parseEther("0.5"))).wait();
}

export async function printBalances (hre: HardhatRuntimeEnvironment, deployerPK: string, owner1: Wallet, owner2: Wallet, multisigAddress: string, paymasterAddress?: string) {
  const daiArtifact = await hre.artifacts.readArtifact("@matterlabs/zksync-contracts/l2/system-contracts/openzeppelin/token/ERC20/IERC20.sol:IERC20");
  const provider = new Provider(hre.config.networks.zkSyncTestnet.url);
  const wallet = new Wallet(deployerPK).connect(provider);

  const daiWallet = new ethers.Contract(
    '0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b',
    daiArtifact.abi,
    wallet
  );

  let owner1Balance = await daiWallet.balanceOf(owner1.address);
  let owner2Balance = await daiWallet.balanceOf(owner2.address);
  let multiDaiBalance = await daiWallet.balanceOf(multisigAddress);
  let multiEthBalance = await provider.getBalance(multisigAddress);

  console.log(`** Dai Balance:\nowner1: ${owner1Balance}\nowner2: ${owner2Balance}\nmultisig: ${multiDaiBalance}`);
  console.log(`** Eth Balance:\nmultisig: ${multiEthBalance}`);
  if(paymasterAddress) {
    let paymasterEthBalance = await provider.getBalance(paymasterAddress);
    console.log(`paymaster: ${paymasterEthBalance}`);
  }
}
