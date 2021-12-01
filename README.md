# MedNET: A Blockchain Solution for the Detection of Fraudulent Medical Tests

This application was developed for a *Blockchain Hackathon* held by Leipzig University's *Chair of Application Systems*.
The given task was to develop a blockchain-based application, that allows organisations to fight against forged medical consumer devices.

MedNET is a prototype for detecting fraudulent medical tests for self-diagnosis (MTSD).
Especially in developing countries either fraudulent or already used medical tests are sold to consumers on the black market, which can have serious consequences for them concerning their health and safety.
The application allows permitted organisations to associate each produced unit of a MTSD with a digital represetation in a blockchain.
Each produced unit is then provided with a NFC-chip that can be scanned by the consumer, to authenticate a product and to check wether it was already used or not.



## 1. Project Structure

The project consists of the following components:

- the MedNET
- the MedNET-CRUD UI
- the MedSAVE UI


### 1.1. MedNET

This component consists of an implementation of the Hyperledger Fabric Blockchain v2.2 and a Node.js Express backend.

#### 1.1.1. Blockchain
The project's underlying blockchain was forked from [Hyperledger Fabric repository](https://github.com/hyperledger/fabric) on January 22nd 2021.
Hyperledger Fabric is an "open source enterprise-grade permissioned distributed ledger technology (DLT)" [[1]](https://hyperledger-fabric.readthedocs.io/en/latest/whatis.html#hyperledger-fabric), that provides an architecture to build a permissioned blockchain.

The implemented blockchain includes one **orderer organisation**, two **peer organisations**, one **channel** associated with a **chain code** (Smart Contract).
Each organisation has one certification authority.
The chain code is implemented in JavaScript and allows CRUD-operations for an instance of the entity *MedTest*.

A MedTest has the following properties:

```javascript
struct MedTest 
{
  key: string,
  id: string,
  medProductId: string,
  isUsed: boolean,
  docType = 'medTest'
}
```

The blockchain allows permitted organisations to create, read, update, and delete only their own tests.

#### 1.1.2. Backend

By using the backend, permitted organisations can execute these CRUD operations via HTTPS.
The endpoint ``/api/medTests`` allows fetching all created tests via a GET operation and the endpoint ``/api/medTest/:key`` allows creating, updating, fetching, and deleting a MedTest with its respective key.
