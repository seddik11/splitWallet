// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPaymaster, ExecutionResult, PAYMASTER_VALIDATION_SUCCESS_MAGIC} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFlow} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
import {TransactionHelper, Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "./IWithdraw.sol";

contract WithdrawPaymaster is IPaymaster {
    address public allowedToken;
    mapping(address => uint256) public balances;
    uint256 totalSupply;
    struct Strategy {
        uint256 bounty;
    }

    Strategy public strategy;

    modifier onlyBootloader() {
        require(
            msg.sender == BOOTLOADER_FORMAL_ADDRESS,
            "Only bootloader can call this method"
        );
        // Continue execution if called from the bootloader.
        _;
    }

    uint constant EXECUTOR_BOUNTY = 1000000000;

    constructor(address _erc20, uint256 bounty) {
        allowedToken = _erc20;
        strategy = Strategy(bounty);
    }

    function supply() external payable {
        balances[msg.sender] += msg.value;
        totalSupply += msg.value;
    }

    function claim() external {
        // calculate rewards for this user which are proportial to the amount of Eth staked
        uint256 rewards = (address(this).balance - totalSupply) / balances[msg.sender];
        (bool success, ) = payable(msg.sender).call{value: rewards}("");
        require(success, "Bot share withdrawal failed");
    }

    function executeWithdraw(address walletAddress) public {
        IWithdraw(walletAddress).withdraw(allowedToken);
        // send bounty to the executor
        (bool success, ) = payable(msg.sender).call{value: EXECUTOR_BOUNTY}("");
        require(success, "Executor bounty failed");
    }

    function validateAndPayForPaymasterTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    )
        external
        payable
        onlyBootloader
        returns (bytes4 magic, bytes memory context)
    {
        // By default we consider the transaction as accepted.
        magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;
        require(
            _transaction.paymasterInput.length >= 4,
            "The standard paymaster input must be at least 4 bytes long"
        );

        bytes4 paymasterInputSelector = bytes4(
            _transaction.paymasterInput[0:4]
        );
        if (paymasterInputSelector == IPaymasterFlow.general.selector) {
            // get wallet address
            bytes memory addressBytes = new bytes(32);
            for (uint256 i = 0; i < 32; i++) {
                addressBytes[i] = _transaction.data[i + 4];
            }

            address walletAddress = abi.decode(addressBytes, (address));

            // Note, that while the minimal amount of ETH needed is tx.gasPrice * tx.gasLimit,
            // neither paymaster nor account are allowed to access this context variable.
            uint256 requiredETH = _transaction.gasLimit *
                _transaction.maxFeePerGas;

            uint256 walletBalance = IERC20(allowedToken).balanceOf(
                walletAddress
            );

            // calculate if balance covers transaction fees + bounty amount specified in the Strategy of this Paymaster
            // for simplicity we suppose Eth and ERC20 token prices are 1 (use API3 to get real data)
            uint256 requiredERC20 = (requiredETH * 1)/1;
            uint256 strategyBounty = (walletBalance - requiredERC20) * strategy.bounty / 100; // bounty amount after paying fees
            uint256 requiredBalance = requiredERC20 + strategyBounty;
            uint256 walletBounty = IWithdraw(walletAddress).getBounty();

            require(
                walletBounty >= requiredBalance,
                "Bounty is too low"
            );

            require(
                walletBounty <= walletBalance,
                "Wallet balance too low to cover Tx fees and bounty"
            );

            // The bootloader never returns any data, so it can safely be ignored here.
            (bool success, ) = payable(BOOTLOADER_FORMAL_ADDRESS).call{
                value: requiredETH
            }("");
            require(
                success,
                "Failed to transfer tx fee to the bootloader. Paymaster balance might not be enough."
            );
        } else {
            revert("Unsupported paymaster flow");
        }
    }

    function postTransaction(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32,
        bytes32,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external payable override onlyBootloader {
    }

    receive() external payable {}
}