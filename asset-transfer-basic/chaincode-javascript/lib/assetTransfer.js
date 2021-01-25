/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {
    async InitLedger(ctx) {
        const medTest = {
            id: 'dummyTest',
            medProductId: 'dummyProduct',
            isUsed: false,
        };
        medTest.docType = 'medTest';
        const key = medTest.medProductId + "-" + medTest.id;
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(medTest)));
        console.info(`MedTest ${medTest.id} initialized`);
    }

    async GetMedTests(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all medTests in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ key: result.value.key, record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    // CreateMedTest, creates new asset with ID and MedProduct ID
    async CreateMedTest(ctx, id, medProductId) {
        const medTest = {
            id: id,
            medProductId: medProductId,
            isUsed: false,
            docType: 'medTest'
        };
        const key = medProductId + "-" + id;
        ctx.stub.putState(key, Buffer.from(JSON.stringify(medTest)));
        return JSON.stringify(medTest);
    }

    // ReadMedTest returns the medTest stored in the world state with given id.
    async ReadMedTest(ctx, id) {
        const medTestJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!medTestJSON || medTestJSON.length === 0) {
            throw new Error(`The medTest ${id} does not exist`);
        }
        return medTestJSON.toString();
    }

    // UpdateMedTest updates an existing asset in the world state with provided parameters.
    async UpdateMedTest(ctx, key, id, medProductId, isUsed) {
        const exists = await this.MedTestExists(ctx, key);
        if (!exists) {
            throw new Error(`The medtest ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            id: id,
            medProductId,
            isUsed,
            docType: 'medTest'
        };
        return ctx.stub.putState(key, Buffer.from(JSON.stringify(updatedAsset)));
    }

    // DeleteMedTest deletes an given asset from the world state.
    async DeleteMedTest(ctx, key) {
        const exists = await this.MedTestExists(ctx, key);
        if (!exists) {
            throw new Error(`The asset ${key} does not exist`);
        }
        return ctx.stub.deleteState(key);
    }

    // MedTestExists returns true when asset with given id exists in world state.
    async MedTestExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}

module.exports = AssetTransfer;
