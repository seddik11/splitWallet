import { Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import deploySplitWalletFactory from "./deploy-split-wallet-factory";
import deployWithdrawPaymaster from "./deploy-withdraw-paymaster";
import deployAccountSplitWallet from "./deploy-account-split-wallet";
import { sendDai , printBalances} from "./balance-eth-erc20"
import usePaymasterToWithdraw from "./use-paymaster-to-withdraw";
import supplyEthToPaymaster from "./supply-eth-to-paymaster";
import estimateWithdrawWithPaymaster from "./estimate-withdraw-with-paymaster";

const walletPK = "0xcc1149669c0f288ae228c316d93a8fd39b766a7d5ac3f41054f74e4ee7f1a09c"

export default async function (hre: HardhatRuntimeEnvironment) {
  // 1. deploy Split wallet factory
  console.log(`-----------------------`);
  console.log(`Deploying Split Wallet factory..`);
  const splitwalletFactoryAddress = await deploySplitWalletFactory(hre, walletPK);

  // 2. deploy Paymaster
  console.log(`-----------------------`);
  console.log(`Deploying Paymaster with a Strategy of 1% bounty..`);
  const paymasterAddress = await deployWithdrawPaymaster(hre, walletPK, 1);


  // 3.1 Deploy the split wallet which has two owners
  console.log(`-----------------------`);
  console.log(`Deployin the multiSig wallet with those createria:\nbalance share for owner1: 70%\nbalance share for owner2: 30% \nbounty: 1%`);
  const owner1 = Wallet.createRandom();
  const owner2 = Wallet.createRandom();
  console.log(`owner1 address: ${owner1.address} \nowner2 address: ${owner2.address}`);
  // 3.2 for gas estimation pupose we will deploy a multisig wallet but we are not going to use it
  // it will cost some eth but we can do it only for one time
  // const estimationSplitWalletAddress = await deployAccountSplitWallet(hre, walletPK, splitwalletFactoryAddress, owner1, owner2);
  
  
  // 3.3 before deploying we need to estimate the bounty amount
  // and more it's bigger more likely the transaction will be executed by profit-seekers
  console.log(`Estimating the bounty amount including the gas fees needed to pay the transaction`);
  // const estimatedFee = await estimateWithdrawWithPaymaster(hre, paymasterAddress, estimationSplitWalletAddress);
  // 3.4 we will add some amount to the fee amount as a bounty
  // const bounty  = ethers.BigNumber.from(estimatedFee).add(ethers.utils.parseEther("0.1"));
  const bounty  = ethers.BigNumber.from(ethers.utils.parseEther("0.1")).add(ethers.utils.parseEther("0.1"));
  console.log(`After estimation of gas fees and adding a small amount the bounty is ${bounty}`);
  
  const splitWalletAddress = await deployAccountSplitWallet(hre, walletPK, splitwalletFactoryAddress, owner1, owner2, bounty);

  // 4. Send some DAI to the multisig wallet
  console.log(`-----------------------`);
  console.log('Sending dai to multisig address..');
  await sendDai(hre, walletPK, splitWalletAddress);
  await printBalances(hre, walletPK, owner1, owner2, splitWalletAddress);

  // 5.1 we need to supply Eth for the Paymaster (Liquidity providers will use the supply method to do that)
  console.log(`-----------------------`);
  console.log(`Supply Eth to paymaster by LPs so transaction fees could be paid`);
  await supplyEthToPaymaster(hre, paymasterAddress, walletPK);
  
  // 5.2 the transfer event was detected by a profit-seeker and want to execute the withdraw with help of Paymaster
  console.log(`-----------------------`);
  console.log(`Use paymaster to execute the withdraw transaction`);
  try {
    await usePaymasterToWithdraw(hre, paymasterAddress, splitWalletAddress);
  } catch(e) {
    console.log(e.body);
  }

  await printBalances(hre, walletPK, owner1, owner2, splitWalletAddress, paymasterAddress);
}

