# ZkSync Transaction Fee Subsidization with Paymasters and Account Abstraction

This repository showcases a use case of leveraging Paymasters and Account Abstraction in the ZkSync network to enable users to perform transactions on Layer 2 for free. By subsidizing transaction fees through Paymasters and utilizing Account Abstraction, users can enjoy seamless and cost-effective transactions on the ZkSync network. We also shows how this model will create opportunities and incentives to subsidize transaction fees.

## 1. Overview

In today's Ethereum ecosystem, high transaction fees have become a significant barrier to mass adoption. However, ZkSync, as a Layer 2 solution, aims to tackle this challenge by offering lower transaction fees and introducing powerful features such as Account Abstraction and Paymasters. While some users may express concerns about paying for transactions, it's important to recognize that many services we use daily, like YouTube and Spotify, require payment for premium plans or rely on advertising and user data. In a similar vein, Paymasters can be seen as a service, like Google Ads, that facilitates the monetization of transactions. Paymasters have the potential to assist businesses in achieving wider adoption and visibility by covering gas fees, ultimately fostering growth and supporting the Ethereum ecosystem's sustainability. For example, the paymaster can pay for you the transaction fee in exchange for some data or authorization.

## 2. Use case

Imagine a scenario where a team participates in a hackathon and wins a prize. To efficiently manage the funds and ensure secure distribution among team members, the team decides to create a multisig wallet. Traditionally, creating a new wallet and performing transactions can be a cumbersome process, involving sending ETH and executing multiple transactions. However, with the help of Account Abstraction and Paymasters, this process can be simplified, benefiting both the team and others in the ecosystem.

### 2.1 Split wallet (Account Abstraction)

The Split Wallet utilizes Account Abstraction to create a multisig wallet for simplified fund distribution. With the ability to define allocations for team members and include a small bounty, owners can receive their funds without the hassle of sending ETH or paying gas fees. Additionally, other users, including smart contracts and individuals, can earn the bounty by executing the withdraw function (This account will implement the IWithdraw interface). Increasing the bounty will increase the likelihood of execution of the transaction

### 2.2 Subsidizers (Paymasters)

On the other hand, we introduce another set of actors called "Subsidizers" who are Paymaster contracts responsible for executing the withdraw transactions and earning the bounty. These Subsidizers play a vital role in facilitating the transaction process and are incentivized by the bounty offered for executing the withdrawals. By actively participating in the ecosystem, Subsidizers contribute to the efficient and seamless distribution of funds while earning rewards for their valuable service.

#### 2.2.1 Liquidity Providers

In order to incentivize Liquidity Providers (LPs) to stake their ETH for paying transactions, rewards or incentives to LPs can be offered in the form of APYs (Annual Percentage Yields) or APRs (Annual Percentage Rates). These rewards can be structured in different ways, such as a percentage bounty from the withdrawn amount or a combination of the transaction fees paid for the transaction and additional rewards.
By offering different strategies and APYs/APRs for Paymasters, they can attract diverse range of LPs with varying risk-reward preferences. LPs can choose the strategy that aligns with their investment goals and contribute their ETH to the Paymasters to earn rewards.
This approach opens up possibilities for a dynamic ecosystem where multiple Paymasters with different strategies compete for LPs, fostering liquidity provision and providing opportunities for LPs to earn rewards for their participation. Like in AMMs, LPs earn revenue by providing liquidity.

#### 2.2.1 Transaction executor

The executor, as an active participant listening to blockchain events, can detect opportunities to earn the bounty and execute the transaction. One notable advantage of this arrangement is that the executor doesn't necessarily need to have ETH in their wallet. Instead, they can rely on the liquidity provided by LPs and access the necessary funds to cover the transaction fees without having to hold ETH themselves.It is indeed possible for the executor to be an LP as well. 
This means that the executor can stake their own ETH in the liquidity pool and earn rewards alongside other LPs. In this way, the executor can benefit from both the bounty and any additional rewards provided by the liquidity pool, thereby maximizing their potential earnings. This executor will earn a reward for executing the transaction.

## Workflow

![workflow model](https://i.ibb.co/jhvPnfG/Miner-Paymaster.jpg)

### Description

0.
- users will deploy a multisig wallet with a specific bounty amount
- A paymaster is deployed with specific strategy (for example: bounty equal to 1% or greeter)
The strategy model is open and can be based on bounty amount, on number of transaction, execution time (gas fees are cheeper at night for example) etc..
- A transaction executor has added this wallet to his list (When the WithdrawBounty event is triggered) and is listening for transfer events of ERC20 token (DAI for example).
  The executor could select which transaction bounty fit better to the Paymaster strategy (we could have multiple Paymasters with different Strategies etc..)

1.
- When the sender will transfer funds to the Split Wallet A transfer event will be emitted from the blockchain

2.
- The executor will detect this and start a withdraw transaction via the Paymaster

3.
- The Paymaster will verify and validate the transaction to pay the gas fees (verify if withdraw transaction is in accordance with Paymaster strategy)

4.
- After the transaction was successful the wallet owners will receive their funds based on their allocations and the Paymaster will receive the bounty (in our example must include transaction fees)
- In turn the paymaster will update the rewards balance for the executor and the total rewards gained (necessary for LPs rewards as well)

5.
- LPs could supply Eth and claim their rewards any time

## Technical implementation

### IWithdraw interface

This interface defines an event WithdrawBounty when an account implementing this is deployed
The other two functions are the withdraw function and getBounty

### SplitWallet (IAccount)

This is a multiSig wallet where owners will specify the allocation for each owner and bounty amount (for this example we used only two owners but it can be extended for multiple owners). The wallet can be used for Eth or any ERC20 token (we use Dai for this example)

### WithdrawPaymaster (Paymaster)

There are various ways to implement the Paymaster, and it can be a complex process that involves incorporating multiple feature. For this example, we implemented a Paymaster that support only one ERC20 and has a simple strategy (bounty must be equal or greeter than 1). It defines also a map to track LPs balances and Eth supplied. For executors, to execute the withdraw via the Paymaster they must call executeWithdraw specifying the wallet address. Before Paying the transaction fees, the Paymaster will verify the transaction and if its alighed with its Strategy. The executor will receive a small reward for executing the transaction.

### NB

Note: This implementation is intended as an experimental proof-of-concept and should not be used in production environments. It has not been audited for security vulnerabilities, and may contain bugs or errors that could result in the loss of funds. Additionally, the code quality may not meet industry standards, and the mathematical calculations used to determine the APY may not be exact.


## Running the scenario

We have implemented a scenario where two owners will create a multiSig wallet with those specifications (70% owner1 allocation, 30% owner2 allocation, 1% bounty: after paying gas fees)
Then this wallet will receive 0.5 Dai. The executor will detect this event and will use the Subsidizer to execute the withdraw transaction.

`yarn hardhat deploy-zksync --script deploy/scenario.ts`


## Conclusion

This approach offers several benefits and opportunities for different actors within the Ethereum ecosystem. By streamlining fund distribution and providing incentives for participation, this innovative solution fosters growth and collaboration in the ecosystem. showcasing the potential of Account Abstraction and Paymasters and their application in facilitating growth, sustainibility and create new opportunities for actors within the ecosystem. We are confident that this model can be adapted to various forms and extended to numerous use cases and applications, such as publishers and advertisers.

