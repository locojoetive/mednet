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

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var corsOptions = {
	origin: 'http://localhost:4200',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))



const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

let contract;

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

async function UpdateMedTest(id, medProductId, isUsed) {
	console.log('\n--> Submit Transaction: Update medtest, with given ID');
	const result = await contract.submitTransaction('UpdateMedTest', id, medProductId, isUsed);
	console.log('*** Result: committed');
	return result;
}

async function DeleteMedTest(id) {
	console.log('\n--> Submit Transaction: Delete medtest, with given ID');
	const result = await contract.submitTransaction('DeleteMedTest', id);
	console.log('*** Result: committed');
	return result;
}

app.listen(8080, () => {
	authenticate(InitLedger)
		.then( v => console.log('Server started!'))
		.catch(v => console.log("Something's wrong in the jellies....."));
});

app.get('/api/assets', async (req, res) => {
	if (req.body.id) {
		res.send(JSON.parse((await ReadMedTest(req.body.id)).toString()))
	} else {
		res.send(JSON.parse((await GetMedTests()).toString()))
	}
});

app.post('/api/assets', async (req, res) => {
	const { id, medProductId } = req.body;
	const result = JSON.parse((await CreateMedTest(id, medProductId)).toString());
	res.send(result);
});

app.put('/api/assets', async (req, res) => {
	const {id, medProductId, isUsed} = req.body;
	const result = JSON.parse((await UpdateMedTest(id, medProductId, isUsed)).toString());
	res.send(result);
});

app.delete('/api/assets', async (req, res) => {
	const result = JSON.parse((await DeleteMedTest(req.body.id)).toString());
	console.log(result);
	res.send(result);
});
