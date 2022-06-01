import { splitBlockRanges } from "./events";

describe("Events tests", () => {

    describe("splitBlockRanges", () => {

        it("should return single range if from and to are equal", () => {
            expect(splitBlockRanges(0, 0, 1000)).toEqual([{ from: 0, to: 0 }]);
        })

        it("should return single range if it is below the chunk size", () => {
            expect(splitBlockRanges(501, 739, 1000)).toEqual([{ from: 501, to: 739 }]);
        });

        it("should split the range if the range is greater than the chunk size", () => {
            expect(splitBlockRanges(0, 1000, 1000)).toEqual([{ from: 0, to: 999 }, { from: 1000, to: 1000 }]);
        });

        it("should split the range correctly when it is an exact multiple of the chunk size", () => {
            expect(splitBlockRanges(0, 1999, 1000)).toEqual([{ from: 0, to: 999 }, { from: 1000, to: 1999 }]);
        });

        it("should split the range correctly for a large range", () => {
            expect(splitBlockRanges(0, 10123, 1000)).toEqual([
                { from: 0, to: 999 }, 
                { from: 1000, to: 1999 },
                { from: 2000, to: 2999 },
                { from: 3000, to: 3999 },
                { from: 4000, to: 4999 },
                { from: 5000, to: 5999 },
                { from: 6000, to: 6999 },
                { from: 7000, to: 7999 },
                { from: 8000, to: 8999 },
                { from: 9000, to: 9999 },
                { from: 10000, to: 10123 },
            ]);
        });

    });

});