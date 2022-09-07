async function main() {
   const MGContract = await ethers.getContractFactory("MGIBDevTaskContract");
   
   // Start deployment, returning a promise that resolves to a contract object
   const mg_contract = await MGContract.deploy();
   console.log("Contract deployed to address:", mg_contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
