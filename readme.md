# Follow along with Pat Collin's Solidity Smart Contract Development course
- Nothing much to add except adding changes made to the repo

- Some dependencies need to be overridden

 ```json
 "overrides": {
    "@nomiclabs/hardhat-waffle": {
      "@nomiclabs/hardhat-ethers": "$@nomiclabs/hardhat-ethers"
    }
 }
```
- A fix I found by going through solidity : Need to put the arguments the same way in the deploy script as you have in the solidity contract i.e. :

```solidity
constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    )
```

Then in deploy script :

```js
  const args = [
        vrfCoordinatorV2Address,
        networkConfig[chainId]["entranceFee"],
        networkConfig[chainId]["gasLane"],
        subscriptionId,
        networkConfig[chainId]["callbackGasLimit"],
        networkConfig[chainId]["interval"],
    ]
```