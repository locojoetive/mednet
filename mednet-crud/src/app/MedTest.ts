import { IMedTest } from "./IMedTest";

export class MedTest {
    id: string;
    medProductId: string;
    isUsed: boolean;

    constructor(medTest: IMedTest) {
        this.id = medTest.record.id;
        this.medProductId = medTest.record.medProductId;
        this.isUsed = medTest.record.isUsed;
    }
}