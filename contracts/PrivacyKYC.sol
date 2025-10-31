// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { FHE, ebool, euint32, euint8, externalEuint32, externalEuint8 } from "@fhevm/solidity/lib/FHE.sol";

/// @title PrivacyKYC - Privacy-preserving KYC with FHE
/// @notice Users submit encrypted personal information that remains confidential on-chain
contract PrivacyKYC is SepoliaConfig {
    struct KYCData {
        euint32 age;           // Encrypted age
        euint8 nationality;    // Encrypted nationality code (0-255)
        euint8 documentType;   // Encrypted document type (1=Passport, 2=ID, 3=Driver's License)
        ebool isVerified;      // Encrypted verification status
        uint256 submissionTime;
    }

    struct DecryptedKYC {
        uint32 age;
        uint8 nationality;
        uint8 documentType;
        bool isVerified;
    }

    address public admin;
    mapping(address => KYCData) public kycRecords;
    mapping(address => bool) public hasSubmitted;

    // Mapping for decryption requests
    event KYCSubmitted(address indexed user, uint256 timestamp);
    event KYCVerified(address indexed user, bool verified);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Submit encrypted KYC information
    /// @param encryptedAge Encrypted age value
    /// @param encryptedNationality Encrypted nationality code
    /// @param encryptedDocType Encrypted document type
    /// @param inputProof Proof for the encrypted inputs
    function submitKYC(
        externalEuint32 encryptedAge,
        externalEuint8 encryptedNationality,
        externalEuint8 encryptedDocType,
        bytes calldata inputProof
    ) external {
        // Convert encrypted inputs to euint types
        euint32 age = FHE.fromExternal(encryptedAge, inputProof);
        euint8 nationality = FHE.fromExternal(encryptedNationality, inputProof);
        euint8 docType = FHE.fromExternal(encryptedDocType, inputProof);

        // Store encrypted KYC data
        kycRecords[msg.sender] = KYCData({
            age: age,
            nationality: nationality,
            documentType: docType,
            isVerified: FHE.asEbool(false),
            submissionTime: block.timestamp
        });

        hasSubmitted[msg.sender] = true;

        // Allow user to access their own encrypted data
        FHE.allowThis(age);
        FHE.allowThis(nationality);
        FHE.allowThis(docType);
        FHE.allow(age, msg.sender);
        FHE.allow(nationality, msg.sender);
        FHE.allow(docType, msg.sender);

        emit KYCSubmitted(msg.sender, block.timestamp);
    }

    /// @notice Verify KYC status (admin only)
    /// @param user Address of the user to verify
    /// @param verified Whether the user is verified
    function verifyKYC(address user, bool verified) external onlyAdmin {
        require(hasSubmitted[user], "No KYC submission");

        kycRecords[user].isVerified = FHE.asEbool(verified);
        FHE.allowThis(kycRecords[user].isVerified);
        FHE.allow(kycRecords[user].isVerified, user);

        emit KYCVerified(user, verified);
    }

    /// @notice Check if age is above minimum (e.g., 18)
    /// @param user Address to check
    /// @param minAge Minimum age requirement
    /// @return Encrypted boolean result
    function isAgeAbove(address user, uint32 minAge) external returns (ebool) {
        require(hasSubmitted[user], "No KYC submission");
        return FHE.ge(kycRecords[user].age, minAge);
    }

    /// @notice Get encrypted KYC data for a user
    /// @param user Address of the user
    function getKYCData(address user) external view returns (
        euint32 age,
        euint8 nationality,
        euint8 documentType,
        ebool isVerified,
        uint256 submissionTime
    ) {
        require(hasSubmitted[user], "No KYC submission");
        KYCData memory data = kycRecords[user];
        return (
            data.age,
            data.nationality,
            data.documentType,
            data.isVerified,
            data.submissionTime
        );
    }

    /// @notice Check if user has submitted KYC
    function hasKYC(address user) external view returns (bool) {
        return hasSubmitted[user];
    }
}
