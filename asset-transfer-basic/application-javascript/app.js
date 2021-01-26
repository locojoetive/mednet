'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');


const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

let contract;

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function authenticate(asyncMethod) {
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

async function InitLedger()  {
	console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	await contract.submitTransaction('InitLedger');
	console.log('*** Result: committed');
}

async function GetMedTests() {
	const result = await contract.evaluateTransaction('GetMedTests');
	return result;
}

async function CreateMedTest(id, medProductId) {
	console.log('\n--> Submit Transaction: CreateMedTest, creates new asset with ID and MedProduct ID');
	const result = await contract.submitTransaction('CreateMedTest', id, medProductId);
	console.log('*** Result: committed');
	return result;
}

async function ReadMedTest(id) {
	console.log('\n--> Evaluate Transaction: ReadMedTest, function returns a medTest with a given medTestId');
	const result = await contract.evaluateTransaction('ReadMedTest', id);
	console.log(`*** Result: ${prettyJSONString(result.toString())}`);	
	return result;
}

async function UpdateMedTest(key, id, medProductId, isUsed) {
	console.log('\n--> Submit Transaction: Update medtest, with given ID');
	const result = await contract.submitTransaction('UpdateMedTest', key, id, medProductId, isUsed);
	console.log('*** Result: committed');
	return result;
}

async function DeleteMedTest(key) {
	console.log('\n--> Submit Transaction: Delete medtest, with given ID');
	const result = await contract.submitTransaction('DeleteMedTest', key);
	console.log('*** Result: committed');
	return result;
}

app.listen(8080, () => {
	authenticate(InitLedger)
		.then( v => console.log('Server started!'))
		.catch(v => console.log("Something's wrong in the jellies....."));
});

app.get('/api/medTest', async (req, res) => {
	res.send(JSON.parse((await GetMedTests()).toString()));
});

app.get('/api/medTest/:key', async (req, res) => {
	const key = req.params.key;
	res.send(JSON.parse((await ReadMedTest(key)).toString()));
});

app.post('/api/medTest', async (req, res) => {
	const { id, medProductId } = req.body;
	console.log("ID: " + id + " MedProductId: " + medProductId);
	await CreateMedTest(id, medProductId);
	res.sendStatus(200);
});

app.put('/api/medTest', async (req, res) => {
	const {key, id, medProductId, isUsed} = req.body;
	console.log("Key:" + key + " ID:" + id + " MedProductId:" + medProductId + " IsUsed:" + isUsed);
	await UpdateMedTest(key, id, medProductId, isUsed);
	res.sendStatus(200);
});

app.delete('/api/medTest/:key', async (req, res) => {
	const {key} = req.params;
	console.log("Key: " + key);
	await DeleteMedTest(key)
	res.sendStatus(200);
});
