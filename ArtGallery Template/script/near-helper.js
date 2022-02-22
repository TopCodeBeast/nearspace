const deplyContract = async (title,callback)=>{
  window.cb_url = callback;
  const wallet = new nearApi.WalletConnection(window.near);
  const walletAccountObj = wallet.account();
  const contract = new nearApi.Contract(
    walletAccountObj, // the account object that is connecting
    "pool.eclectica.testnet",
    {
      // name of contract you're connecting to
      viewMethods: ["get_account_exist"], // view methods do not change state but usually return a value
      changeMethods: ["create_nft"], // change methods modify state
      sender: walletAccountObj, // account object to initialize and sign transactions.
    }
  );
  const BOATLOAD_OF_GAS = Big(30).times(10 ** 13).toFixed();
  contract.create_nft(
    { nft_id: `${title}_${wallet.getAccountId().split(".")[0]}` ,owner_id: wallet.getAccountId() },
    BOATLOAD_OF_GAS,
    Big(5 || '0').times(10 ** 24).toFixed()
  )
}
