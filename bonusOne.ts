import bun from "bun";

const RPC_URL = "http://localhost:5050/v3/f1b70935143f4b22b3c165d6bdfd3021";

interface EthereumCall {
  jsonrpc: string;
  method: string;
  params: any[];
  id: number;
}

let id = 1;
let batchWindow: Promise<void> | null = null;
let batch: EthereumCall[] = [];
let resolvers: Array<(value: bigint) => void> = [];

async function executeBatch() {
  const currentBatch = batch;
  const currentResolvers = resolvers;
  
  batch = [];
  resolvers = [];
  batchWindow = null;
  
  const body = JSON.stringify(currentBatch);

  const response = await bun.fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const results = await response.json();
  
  results.forEach((result: any, index: number) => {
    const balance = BigInt(result.result);
    currentResolvers[index](balance);
  });
}

function scheduleBatch() {
  if (!batchWindow) {
    // Set a short delay to allow multiple calls to be accumulated
    batchWindow = new Promise((resolve) => setTimeout(resolve, 10));
    batchWindow.then(executeBatch);
  }
}

async function fetchBalance(address: `0x${string}`): Promise<bigint> {
  const call: EthereumCall = {
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [address, "latest"],
    id: id++,
  };
  
  batch.push(call);
  scheduleBatch();
  
  return new Promise<bigint>((resolve) => {
    resolvers.push(resolve);
  });
}

export { fetchBalance };
