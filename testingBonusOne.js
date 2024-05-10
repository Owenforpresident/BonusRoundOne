import { fetchBalance } from "./bonusOne";

async function testSingleBatch() {
  const addresses = [
    "0xF7B31119c2682c88d88D455dBb9d5932c65Cf1bE",
    "0x3CBdeD43EFdAf0FC77b9C55F6fC9988fCC9b757d",
    "0x53b6936513e738f44FB50d2b9476730C0Ab3Bfc1",
    "0x72a5843cc08275C8171E582972Aa4fDa8C397B2A",
    "0x1da5821544e25c636c1417Ba96Ade4Cf6D2f9B5A",
  ];

  console.log("Testing single batch request");

  try {
    const balances = await Promise.all(
      addresses.map((address) => fetchBalance(address))
    );
    console.log("Balances from single batch:", balances);
  } catch (error) {
    console.error("Error during single batch test:", error);
  }
}

async function testMultipleBatches() {
    const addresses = [
      "0xF7B31119c2682c88d88D455dBb9d5932c65Cf1bE",
      "0x3CBdeD43EFdAf0FC77b9C55F6fC9988fCC9b757d",
      "0x53b6936513e738f44FB50d2b9476730C0Ab3Bfc1",
      "0x72a5843cc08275C8171E582972Aa4fDa8C397B2A",
      "0x1da5821544e25c636c1417Ba96Ade4Cf6D2f9B5A",
    ];
  
    console.log("Testing multiple batch requests");
  
    try {
      const batch1 = addresses.map(fetchBalance);
      const batch2 = addresses.map(fetchBalance);
      const batch3 = [...addresses.map(fetchBalance), ...addresses.map(fetchBalance)];
  
      const [balances1, balances2, balances3] = await Promise.all([
        Promise.all(batch1),
        Promise.all(batch2),
        Promise.all(batch3)
      ]);
  
      console.log("Balances from first batch:", balances1);
      console.log("Balances from second batch:", balances2);
      console.log("Balances from combined batches:", balances3);
    } catch (error) {
      console.error("Error during multiple batches test:", error);
    }
  }

testSingleBatch();


// testMultipleBatches();
  
