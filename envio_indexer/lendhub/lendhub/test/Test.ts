import assert from "assert";
import { 
  TestHelpers,
  Nftlendhub_LoanClaimed
} from "generated";
const { MockDb, Nftlendhub } = TestHelpers;

describe("Nftlendhub contract LoanClaimed event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Nftlendhub contract LoanClaimed event
  const event = Nftlendhub.LoanClaimed.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Nftlendhub_LoanClaimed is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Nftlendhub.LoanClaimed.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualNftlendhubLoanClaimed = mockDbUpdated.entities.Nftlendhub_LoanClaimed.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedNftlendhubLoanClaimed: Nftlendhub_LoanClaimed = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      loanId: event.params.loanId,
      borrower: event.params.borrower,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualNftlendhubLoanClaimed, expectedNftlendhubLoanClaimed, "Actual NftlendhubLoanClaimed should be the same as the expectedNftlendhubLoanClaimed");
  });
});
