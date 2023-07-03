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

  const L2_ETH_TOKEN_ADDRESS = '0x000000000000000000000000000000000000800A';
  
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

  await daiWallet.transfer(multisigAddress, ethers.utils.parseEther("0.01"));
  
  let multiBalance = await daiWallet.balanceOf(multisigAddress);
  console.log(`Multisig dai balance ${multiBalance}`);
  
  const allocationWallet = new ethers.Contract(
    multisigAddress,
    allocationArtifact.abi,
    wallet
  );

  console.log("Sending fees funds to multisig account");
  // Send funds to the multisig account we just deployed
  const ethTx = await (
    await wallet.sendTransaction({
      to: multisigAddress,
      // You can increase the amount of ETH sent to the multisig
      value: ethers.utils.parseEther("0.01"),
    })
  ).wait();

  let multisigBalance = await provider.getBalance(multisigAddress);

  console.log(`Eth trx: ${ethTx}`);
  console.log(`Multisig eth balance is ${multisigBalance.toString()}`);
  
  console.log('Sending funds from multisig..');

  // Transaction to end offer
  // let aaTx = await daiWallet.populateTransaction.transfer(
  //   owner1.address,
  //   ethers.utils.parseEther("0.00035")
  // );

  // const gasPrice = await provider.getGasPrice();

  // aaTx = {
  //   ...aaTx,
  //   from: multisigAddress,
  //   gasLimit: ethers.utils.parseEther("0.00000000002"),
  //   gasPrice: gasPrice,
  //   chainId: (await provider.getNetwork()).chainId,
  //   nonce: await provider.getTransactionCount(multisigAddress),
  //   type: 113,
  //   customData: {
  //     gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
  //   } as types.Eip712Meta,
  //   value: ethers.BigNumber.from(0),
  // };
  // const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

  // const multiSignature = ethers.utils.concat([
  //   // Note, that `signMessage` wouldn't work here, since we don't want
  //   // the signed hash to be prefixed with `\x19Ethereum Signed Message:\n`
  //   ethers.utils.joinSignature(owner1._signingKey().signDigest(signedTxHash)),
  //   ethers.utils.joinSignature(owner2._signingKey().signDigest(signedTxHash)),
  // ]);

  // aaTx.customData = {
  //   ...aaTx.customData,
  //   customSignature: multiSignature,
  // };

  // console.log(
  //   `The multisig's nonce before the first tx is ${await provider.getTransactionCount(
  //     multisigAddress
  //   )}`
  // );

  // console.log(aaTx);

  // const sentTx = await provider.sendTransaction(utils.serialize(aaTx));
  // await sentTx.wait();
  
  const trx = await allocationWallet.forward('0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b');
  // console.log(trx);
  
  owner1Balance = await daiWallet.balanceOf(owner1.address);
  owner2Balance = await daiWallet.balanceOf(owner2.address);
  console.log(`After forwarding Eth: owner1 and owner 2 balance ${owner1Balance.toString()} ${owner2Balance.toString()}`);

  multiBalance = await daiWallet.balanceOf(multisigAddress);
  console.log(`Multisig dai balance ${multiBalance.toString()}`);
  
  multiBalance = await provider.getBalance(multisigAddress);
  console.log(`After forwarding Eth: Multisig account balance ${multiBalance.toString()}`);
}