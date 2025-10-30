const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment of PrivacyKYC contract...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy PrivacyKYC contract
  console.log("📝 Deploying PrivacyKYC...");
  const PrivacyKYC = await hre.ethers.getContractFactory("PrivacyKYC");
  const privacyKYC = await PrivacyKYC.deploy();

  await privacyKYC.waitForDeployment();
  const contractAddress = await privacyKYC.getAddress();

  console.log("✅ PrivacyKYC deployed to:", contractAddress);
  console.log("👤 Admin address:", deployer.address);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    adminAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(
    deploymentsDir,
    `${hre.network.name}-deployment.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n📄 Deployment info saved to:", deploymentFile);

  // Update .env file with contract address
  const envPath = path.join(__dirname, "../.env");
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  // Update or add VITE_KYC_CONTRACT_ADDRESS
  const contractAddressLine = `VITE_KYC_CONTRACT_ADDRESS=${contractAddress}`;
  if (envContent.includes("VITE_KYC_CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(
      /VITE_KYC_CONTRACT_ADDRESS=.*/,
      contractAddressLine
    );
  } else {
    envContent += `\n${contractAddressLine}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("✅ Updated .env with contract address\n");

  // Update KYCForm.tsx with contract address
  const kycFormPath = path.join(
    __dirname,
    "../src/components/KYCForm.tsx"
  );
  if (fs.existsSync(kycFormPath)) {
    let kycFormContent = fs.readFileSync(kycFormPath, "utf8");
    kycFormContent = kycFormContent.replace(
      /const KYC_CONTRACT_ADDRESS = "0x[0-9a-fA-F]+";/,
      `const KYC_CONTRACT_ADDRESS = "${contractAddress}";`
    );
    fs.writeFileSync(kycFormPath, kycFormContent);
    console.log("✅ Updated KYCForm.tsx with contract address\n");
  }

  console.log("=" .repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=" .repeat(60));
  console.log("\n📋 Next Steps:");
  console.log("1. Verify contract on Etherscan (optional):");
  console.log(`   npx hardhat verify --network sepolia ${contractAddress}`);
  console.log("\n2. Start the frontend:");
  console.log("   npm run dev");
  console.log("\n3. Connect your wallet and submit KYC information");
  console.log("=" .repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
