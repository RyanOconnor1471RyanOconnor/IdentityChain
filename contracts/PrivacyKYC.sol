// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/gateway/GatewayCaller.sol";

/// @title PrivacyKYC - Privacy-preserving KYC with FHE
/// @notice Users submit encrypted personal information that remains confidential on-chain
contract PrivacyKYC is GatewayCaller {
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
    mapping(uint256 => address) public decryptionRequests;
    uint256 public requestCounter;

    event KYCSubmitted(address indexed user, uint256 timestamp);
    event KYCVerified(address indexed user, bool verified);
    event DecryptionRequested(address indexed user, uint256 requestId);

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
        einput encryptedAge,
        einput encryptedNationality,
        einput encryptedDocType,
        bytes calldata inputProof
    ) external {
        // Convert encrypted inputs to euint types
        euint32 age = TFHE.asEuint32(encryptedAge, inputProof);
        euint8 nationality = TFHE.asEuint8(encryptedNationality, inputProof);
        euint8 docType = TFHE.asEuint8(encryptedDocType, inputProof);

        // Store encrypted KYC data
        kycRecords[msg.sender] = KYCData({
            age: age,
            nationality: nationality,
            documentType: docType,
            isVerified: TFHE.asEbool(false),
            submissionTime: block.timestamp
        });

        hasSubmitted[msg.sender] = true;

        // Allow user to access their own encrypted data
        TFHE.allowThis(age);
        TFHE.allowThis(nationality);
        TFHE.allowThis(docType);
        TFHE.allow(age, msg.sender);
        TFHE.allow(nationality, msg.sender);
        TFHE.allow(docType, msg.sender);

        emit KYCSubmitted(msg.sender, block.timestamp);
    }

    /// @notice Verify KYC status (admin only)
    /// @param user Address of the user to verify
    /// @param verified Whether the user is verified
    function verifyKYC(address user, bool verified) external onlyAdmin {
        require(hasSubmitted[user], "No KYC submission");

        kycRecords[user].isVerified = TFHE.asEbool(verified);
        TFHE.allowThis(kycRecords[user].isVerified);
        TFHE.allow(kycRecords[user].isVerified, user);

        emit KYCVerified(user, verified);
    }

    /// @notice Check if age is above minimum (e.g., 18)
    /// @param user Address to check
    /// @param minAge Minimum age requirement
    /// @return Encrypted boolean result
    function isAgeAbove(address user, uint32 minAge) external returns (ebool) {
        require(hasSubmitted[user], "No KYC submission");
        return TFHE.ge(kycRecords[user].age, minAge);
    }

    /// @notice Request decryption of KYC data (user can decrypt their own data)
    /// @param user Address of the user
    /// @return requestId The decryption request ID
    function requestDecryption(address user) external returns (uint256) {
        require(msg.sender == user || msg.sender == admin, "Unauthorized");
        require(hasSubmitted[user], "No KYC submission");

        uint256 requestId = requestCounter++;
        decryptionRequests[requestId] = user;

        emit DecryptionRequested(user, requestId);
        return requestId;
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
