'use strict';

const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const cors = require('cors')

const app = express();
const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

let contract;

async function main(asyncMethod) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			contract = network.getContract(chaincodeName);
			await asyncMethod(contract);
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function InitLedger(contract)  {
	console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	await contract.submitTransaction('InitLedger');
	console.log('*** Result: committed');
}


async function GetAsset(contract) {
	console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
	result = await contract.evaluateTransaction('ReadAsset', 'asset13');
	console.log(`*** Result: ${prettyJSONString(result.toString())}`);	
}

async function CreateAsset(contract) {
	console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner,size and appraisedValue arguments');
	result = await contract.submitTransaction('CreateAsset', 'asset13', 'yellow', '5', 'Tom', '130');	console.log('*** Result: committed');
	if (`${result}` !== ''){		console.log(`*** Result: ${prettyJSONString(result.toString())}`);
}}
async function DoesAssetExist(contract) {
	console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
	result = await contract.evaluateTransaction('AssetExists', 'asset1');
	console.log(`*** Result: ${prettyJSONString(result.toString())}`);
}

async function UpdateAsset(contract) {
	console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
	await contract.submitTransaction('UpdateAsset', 'asset1', 'blue', '5', 'Tomoko', '350');
	console.log('*** Result: committed');
}

async function TransferAsset(contract) {
	console.log('\n--> Submit Transaction: TransferAsset asset1, transfer to new owner of Tom');
	await contract.submitTransaction('TransferAsset', 'asset1', 'Tom');
	console.log('*** Result: committed');
}

var corsOptions = {
	origin: 'http://localhost:4200',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))



async function authenicate(asyncMethod) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			contract = network.getContract(chaincodeName);
			if (asyncMethod)
				await asyncMethod(contract);
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network

		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function GetAllAssets() {
	const result = await contract.evaluateTransaction('GetAllAssets');
	return result;
}

app.listen(8080, () => {
	authenicate()
		.then( v => console.log('Server started!'))
		.catch(v => console.log("Something's wrong in the jellies....."));
});

app.route('/api/assets').get(async (req, res) => {
	const result = JSON.parse((await GetAllAssets()).toString());
	console.log(result);
	res.send(result);
});
