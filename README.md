# ZkSync Transaction Fee Subsidization with Paymasters and Account Abstraction

This repository showcases a use case of leveraging Paymasters and Account Abstraction in the ZkSync network to enable users to perform transactions on Layer 2 for free. By subsidizing transaction fees through Paymasters and utilizing Account Abstraction, users can enjoy seamless and cost-effective transactions on the ZkSync network.

## 1. Overview

In today's Ethereum ecosystem, high transaction fees have become a significant barrier to mass adoption. However, ZkSync, as a Layer 2 solution, aims to tackle this challenge by offering lower transaction fees and introducing powerful features such as Account Abstraction and Paymasters. While some users may express concerns about paying for transactions, it's important to recognize that many services we use daily, like YouTube and Spotify, require payment for premium plans or rely on advertising and user data. In a similar vein, Paymasters can be seen as a service, like Google Ads, that facilitates the monetization of transactions. Paymasters have the potential to assist businesses in achieving wider adoption and visibility by covering gas fees, ultimately fostering growth and supporting the Ethereum ecosystem's sustainability.

## 2. Use case

Imagine a scenario where a team participates in a hackathon and wins a prize. To efficiently manage the funds and ensure secure distribution among team members, the team decides to create a multisig wallet. Traditionally, creating a new wallet and performing transactions can be a cumbersome process, involving sending ETH and executing multiple transactions. However, with the help of Account Abstraction and Paymasters, this process can be simplified, benefiting both the team and others in the ecosystem.

### 2.1 Split wallet (Account Abstraction)

The Split Wallet utilizes Account Abstraction to create a multisig wallet for simplified fund distribution. With the ability to define allocations for team members and include a small bounty, owners can receive their funds without the hassle of sending ETH or paying gas fees. Additionally, other users, including smart contracts and individuals, can earn the bounty by executing the withdraw function.

### 2.2 Miners (Paymasters)

On the other hand, we introduce another set of actors called "Miners" who are Paymaster contracts responsible for executing the withdraw transactions and earning the bounty. These Miners play a vital role in facilitating the transaction process and are incentivized by the bounty offered for executing the withdrawals. By actively participating in the ecosystem, Miners contribute to the efficient and seamless distribution of funds while earning rewards for their valuable service.

#### 2.2.1 Liquidity Providers

In order to incentivize Liquidity Providers (LPs) to stake their ETH for paying transactions, rewards or incentives to LPs can be offered in the form of APYs (Annual Percentage Yields) or APRs (Annual Percentage Rates). These rewards can be structured in different ways, such as a percentage bounty from the withdrawn amount or a combination of the transaction fees paid for the transaction and additional rewards.

By offering different strategies and APYs/APRs for Paymasters, the project or DAO can attract a diverse range of LPs with varying risk-reward preferences. LPs can choose the strategy that aligns with their investment goals and contribute their ETH to the Paymasters to earn rewards.

This approach opens up possibilities for a dynamic ecosystem where multiple Paymasters with different strategies compete for LPs, fostering liquidity provision and providing opportunities for LPs to earn rewards for their participation.

#### 2.2.1 Transaction executor

The executor, as an active participant listening to blockchain events, can detect opportunities to earn the bounty and execute the transaction accordingly.
One notable advantage of this arrangement is that the executor doesn't necessarily need to have ETH in their wallet. Instead, they can rely on the liquidity provided by LPs and access the necessary funds to cover the transaction fees without having to hold ETH themselves.it is indeed possible for the executor to be an LP as well. 

This means that the executor can stake their own ETH in the liquidity pool and earn rewards alongside other LPs. In this way, the executor can benefit from both the bounty and any additional rewards provided by the liquidity pool, thereby maximizing their potential earnings. This executor will earn a reward for executing the transaction.

## Workflow

![workflow model](https://i.ibb.co/m6VxNsj/Miner-Paymaster.jpg)

## Conclusion

This approach offers several benefits and opportunities for different actors within the Ethereum ecosystem. By streamlining fund distribution and providing incentives for participation, this innovative solution fosters growth and collaboration in the ecosystem. showcasing the potential of Account Abstraction and Paymasters and their application in facilitating growth, sustainibility and create new opportunities for actors within the ecosystem.

