import path from "path";
import { ContractMutator } from "../core/ContractMutator";
import { ConstantMutation } from "../core/ConstantMutation";
import { CompilationInputProviderSolidity } from "../core/CompilationInputProviderSolidity";
import { CompilatorSolidity } from "../core/CompilatorSolidity";

const createPaths = () => {
  const root = path.join(__dirname, "../..");
  const sources = path.join(__dirname, "../testContracts");
  return {
    root,
    sources,
  };
};

describe("Contract Mutator", () => {
  const TEST_ABI = [
    {
      inputs: [],
      name: "getMyConstant",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const TEST_BYTECODE = {
    object:
      "608060405234801561000f575f80fd5b5060af8061001c5f395ff3fe6080604052348015600e575f80fd5b50600436106026575f3560e01c8063ff90b23a14602a575b5f80fd5b60306044565b604051603b91906062565b60405180910390f35b5f6038905090565b5f819050919050565b605c81604c565b82525050565b5f60208201905060735f8301846055565b9291505056fea264697066735822122058e6277448c66df3543708ef3a5b3aeef530e7e35cbf6472d53e8b086827283d64736f6c63430008150033",
    opcodes:
      "PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0xF JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH1 0xAF DUP1 PUSH2 0x1C PUSH0 CODECOPY PUSH0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH1 0xE JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH1 0x26 JUMPI PUSH0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0xFF90B23A EQ PUSH1 0x2A JUMPI JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH1 0x30 PUSH1 0x44 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH1 0x3B SWAP2 SWAP1 PUSH1 0x62 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH0 PUSH1 0x38 SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x5C DUP2 PUSH1 0x4C JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH1 0x73 PUSH0 DUP4 ADD DUP5 PUSH1 0x55 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 PC 0xE6 0x27 PUSH21 0x48C66DF3543708EF3A5B3AEEF530E7E35CBF6472D5 RETURNDATACOPY DUP12 ADDMOD PUSH9 0x27283D64736F6C6343 STOP ADDMOD ISZERO STOP CALLER ",
    sourceMap: "25:165:0:-:0;;;;;;;;;;;;;;;;;;;",
  };

  it("should compile contract with mutated constants", async () => {
    const paths = createPaths();
    const mutator = new ContractMutator(
      new CompilationInputProviderSolidity(paths),
      new CompilatorSolidity(paths)
    );
    const contractName = "MyContract";
    const mutation = new ConstantMutation(paths, contractName);
    mutation.setConstant("myConstant", { value: "56" });

    const actualOutput = await mutator.mutate(mutation);

    expect(actualOutput.abi).toStrictEqual(TEST_ABI);
    expect(actualOutput.evm.bytecode).toMatchObject(TEST_BYTECODE);
  });
});
