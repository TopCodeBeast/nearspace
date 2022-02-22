





let contract_id = null;
let tokenid = null;
let price =0;

const config = {
  networkId: "testnet",
  keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};

if(!window.near){
  (async  () =>{
    window.near = await nearApi.connect(config);
  })()
}
  


const signIn = () => {
  // create wallet connection
  const wallet = new nearApi.WalletConnection(window.near);
  wallet.requestSignIn(
    "example-contract.testnet", // contract requesting access
    "Eclectica" // optional
  );
};

document.addEventListener('DOMContentLoaded',async function () {

  if(window.near){
    const wallet = new nearApi.WalletConnection(window.near);
    if(wallet.isSignedIn()){
        $( "#wfh" ).text("Buy")
    }else{
        $( "#wfh" ).text("Connect")
    }
  }

  let url_string = window.location.href;
  let url = new URL(url_string);
  let transactionHashes = url.searchParams.get("transactionHashes");
  let nftid = url.searchParams.get("nftid");
  
  if(transactionHashes){
    $("#popup").css('display','flex')
    $("#txhash_url").attr('href',`https://explorer.testnet.near.org/transactions/${transactionHashes}`)
    $("#txhash_url").text(transactionHashes)
  }else if(nftid){
   
    $("#loader").show()
    let req =  await fetch('https://nfteclectica.herokuapp.com/nftsingle',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({  
        "tokenid":nftid
      })
    })
    let res = await req.json()

    //console.log(res)

    contract_id = res['contractid']
    tokenid = res['tokenid']
    price = res['price'] || '0'
    
    let meta_ = await fetch(`https://${res['metadata'].split("/")[2]}.ipfs.infura-ipfs.io/metadata.json`)
    let meta_res = await meta_.json()
    let t = meta_res['image'].split("/")
    let img_url = `https://${t[2]}.ipfs.infura-ipfs.io/${t[t.length-1]}`
    //$("#olks").css('background',`url('${img_url}')`)
    $("#zxcas").attr('src',img_url)
    $("#pricex").text(`${price} NEAR`)
    $("#loader").hide()
    $("#xuid").show()
    $("#xuidb").css('display','flex')
  }



  $( "#wfh" ).click(async()=> {
    if($( "#wfh" ).text()!="Connect"){
      const wallet = new nearApi.WalletConnection(window.near);
    
      await fetch('https://nfteclectica.herokuapp.com/nftbought',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({  
          "contract_token_id": `${contract_id}.${tokenid}`,
          "ownerid": wallet.getAccountId()
        })
      })
    
      const walletAccountObj = wallet.account();
      const BOATLOAD_OF_GAS = Big(30).times(10 ** 13).toFixed();
      const contract = new nearApi.Contract(
        walletAccountObj, // the account object that is connecting
        "shopp.eclectica.testnet",
        {
          // name of contract you're connecting to
          viewMethods: ["storage_balance_of","get_sales_by_owner_id","get_supply_by_owner_id"], // view methods do not change state but usually return a value
          changeMethods: ["storage_deposit","offer"], // change methods modify state
          sender: walletAccountObj // account object to initialize and sign transactions.
        }
      );
      contract.offer(
        { nft_contract_id: contract_id ,token_id: tokenid},
        BOATLOAD_OF_GAS,
        Big(price || '0').times(10 ** 24).toFixed()
      )
    }else{
        signIn()
    }
  });
});

