import { utils, Wallet } from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

export default async function (hre: HardhatRuntimeEnvironment, deployerPK: string) {
  // Private key of the account used to deploy
  const wallet = new Wallet(deployerPK);
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact('AAFactory');
  const aaArtifact = await deployer.loadArtifact('SplitWallet');
  
  // Getting the bytecodeHash of the account
  const bytecodeHash = utils.hashBytecode(aaArtifact.bytecode);

  const factory = await deployer.deploy(
    factoryArtifact,
    [bytecodeHash],
    undefined,
    [
      aaArtifact.bytecode,
    ]
  );

  console.log(`AA factory address: ${factory.address}`);
  return factory.address;
}
