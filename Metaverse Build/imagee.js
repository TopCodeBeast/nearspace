const  getImagess =async () => {
  console.log("fuck the whole universe")
  let res = await fetch("https://nfteclectica.herokuapp.com/contract",{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"contractid":window.config1.contract})
    })
  let data = await res.json()
  window.nfts = {nfts:[]};
  for (i = 0; i < data.length; i++) {
      console.log(data[i])
      isSold = data[i].isonsale
      if (isSold) {
        
          window.nfts.nfts.push({ tokenid: data[i].tokenid, uri: data[i].metadata })
      }
  }
  window.nfts = JSON.stringify(window.nfts)
}