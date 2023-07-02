import { utils, Wallet } from 'zksync-web3';
import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

export default async function (hre: HardhatRuntimeEnvironment) {
  // Private key of the account used to deploy
  const wallet = new Wallet('0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110');
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact('AAFactory');
  const aaArtifact = await deployer.loadArtifact('TwoUserMultisig');
  
  // Getting the bytecodeHash of the account
  const bytecodeHash = utils.hashBytecode(aaArtifact.bytecode);
  
//   const deploymentFee = await deployer.estimateDeployFee(factoryArtifact, [bytecodeHash]);
  
//   // OPTIONAL: Deposit funds to L2
//   // Comment this block if you already have funds on zkSync.
//   const depositHandle = await deployer.zkWallet.deposit({
//     to: deployer.zkWallet.address,
//     token: utils.ETH_ADDRESS,
//     amount: deploymentFee.mul(2),
//   });
//   // Wait until the deposit is processed on zkSync
//   await depositHandle.wait();

  const factory = await deployer.deploy(
    factoryArtifact,
    [bytecodeHash],
    undefined,
    [
      // Since the factory requires the code of the multisig to be available,
      // we should pass it here as well.
      aaArtifact.bytecode,
    ]
  );

  console.log(`AA factory address: ${factory.address}`);
//   AA factory address
//   0x5fE58d975604E6aF62328d9E505181B94Fc0718C
}
