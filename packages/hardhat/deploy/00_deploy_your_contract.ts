import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the "AdSlotController" contract using the deployer account.
 * This contract will manage the creation and administration of ad slots and their bidding processes.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployAdSlotController: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Get the deployer account
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy the AdSlotController contract
  const deployResult = await deploy("AdSlotController", {
    from: deployer,
    args: [], // Constructor doesn't take any arguments
    log: true,
    autoMine: true, // Speeds up deployment on local networks
    waitConfirmations: 5,
  });

  // Get the deployed contract instance for post-deployment verification
  const adSlotController = await hre.ethers.getContract<Contract>("AdSlotController", deployer);
  console.log("🎮 AdSlotController deployed at:", adSlotController.target);

  // If we're on a live network (not localhost), verify the contract
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    // Verify the contract on Etherscan
    try {
      await hre.run("verify:verify", {
        address: deployResult.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Error verifying contract:", error);
    }
  }
};

export default deployAdSlotController;

// Tags for selective deployment
deployAdSlotController.tags = ["AdSlotController"];
deployAdSlotController.dependencies = []; // Add dependencies if needed in the future
