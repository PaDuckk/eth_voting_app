const fs = require("fs");
const Web3 = require("web3");

/**
 *
 */

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const account = "0x5295CD266c7ADB96D39A773e51879D5731f2E049";
let constractAddr = "0x93e4a52ab076acf1d7559fed6b2c593de522215f";

const main = async () => {
  const abi = JSON.parse(
    fs.readFileSync("src_contracts_voting_sol_Voting.abi", "utf-8")
  );

  const bytecode = fs
    .readFileSync("src_contracts_voting_sol_Voting.bin")
    .toString();

  const contract = new web3.eth.Contract(abi, constractAddr);

  if (!constractAddr) {
    const newContract = await contract
      .deploy({
        data: bytecode,
        arguments: [
          ["Rama", "Nick", "Jose"].map((name) => web3.utils.asciiToHex(name)),
        ],
      })
      .send({
        from: account,
        gas: 1500000,
        gasPrice: web3.utils.toWei("0.0003", "ether"),
      });

    contract.options.address = newContract.options.address;
    constractAddr = address;
    console.log(address);
  }

  const ramaTotalVotes = await contract.methods
    .totalVotesFor(web3.utils.asciiToHex("Rama"))
    .call();

  // Send tx
  await contract.methods
    .voteForCandidate(web3.utils.asciiToHex("Rama"))
    .send({ from: account });

  const afterRamaTotalVotes = await contract.methods
    .totalVotesFor(web3.utils.asciiToHex("Rama"))
    .call();

  console.log({
    ramaTotalVotes,
    afterRamaTotalVotes,
  });
};

main();
