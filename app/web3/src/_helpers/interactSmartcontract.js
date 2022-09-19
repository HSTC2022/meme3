import axios from 'axios';

export const getCommentByPageHelper = async(packedObject) => {
  var AppContract = packedObject.AppContract;
  var postId = packedObject.postID;
  var startIdx = packedObject.startIdx;
  var endIdx = packedObject.endIdx;
  var userData = [];
  await AppContract.methods.getCommentByPage(postId, startIdx, endIdx).call().then((result) => {
    for (let i=0; i< result.length; i++) {
        let uAddress = result[i].slice(0, 42);
        let commentString = removeHexByte(result[i].slice(42, result[i].length));
        userData = [{postId: postId, uAddress: uAddress, uComment: commentString}].concat(userData);
    }
  }); 
  return userData;
}

export const commentPostHelper = async(packedObject) => {
  var AppContract = packedObject.AppContract;
  var postId = packedObject.postID;
  var inputComment = packedObject.commentTxt;
  var sendOptions = {from: packedObject.account, gasLimit: 300000};
  var userData = {};
  await AppContract.methods.commentPost(postId, inputComment).send(sendOptions).then((result) => {
    if (result.status){
      userData['postId'] = postId;
      userData['sender'] = packedObject.account;
      userData['comment'] = inputComment;
    } else {
      userData['error'] = result.status;
    }
    // this.state.tmpCommentData = [{uAddress:this.senderAddress, uComment: txtInput}].concat(this.state.tmpCommentData);
  }).catch(e => {
    return null;
  });
  return userData;
}

export const upvotePostHelper = async(packedObject) => {
  var voteState = 0;
  var AppContract = packedObject.AppContract;
  var postId = packedObject.postID;
  var sendOptions = {from: packedObject.account, gasLimit: 300000};
  var userVoteObj = {};
  await AppContract.methods.upvotePost(postId).send(sendOptions).then((result) => {
      voteState = parseInt(result.events["Upvote"].returnValues.voteState);
      userVoteObj = setUserVote(voteState);
      userVoteObj['postId'] = postId;
  }).catch(e => {
    return null;
  });
  return userVoteObj;
}

export const downvotePostHelper = async(packedObject) => {
  var voteState = 0;
  var AppContract = packedObject.AppContract;
  var postId = packedObject.postID;
  var sendOptions = {from: packedObject.account, gasLimit: 300000};
  var userVoteObj = {};
  await AppContract.methods.downvotePost(postId).send(sendOptions).then((result) => {
      voteState = parseInt(result.events["Downvote"].returnValues.voteState);
      userVoteObj = setUserVote(voteState);
      userVoteObj['postId'] = postId;
  }).catch(e => {
    return null;
  });
  return userVoteObj;
}

//get araay post id newest by range
export const getPosts = async (getPostsByPagePack) => {
  //console.log("getPostsByPagePack", getPostsByPagePack)
  let postsIdArray = []
  let AppContractConnected = getPostsByPagePack.AppContractConnected
  let startPost = getPostsByPagePack.startPost
  let endPost = getPostsByPagePack.endPost
  try {
    await AppContractConnected.methods.getPostByPage(startPost, endPost).call().then((result) => {
      //console.log("array meme id", result)
      postsIdArray = result
    })
  } catch (error) {
    //nothing to do
    console.log("ERR: =====> getPosts", error)
  }
  return postsIdArray
}

//get post content by id
export const getPostContentByid = async (getPostContentidPack) => {
  //console.log("getPostContentidPack", getPostContentidPack)
  let AppContractConnected = getPostContentidPack.AppContractConnected
  let NftContractConnected = getPostContentidPack.NftContractConnected
  let senderAddress = getPostContentidPack.account;
  let postID = getPostContentidPack.postID
  let post = {
    'postID': 0,
    'publisher' : '',
    'publishTime': '',
    'upvoteCount': 0,
    'downvoteCount': 0,
    'commentCount': 0,
    'name': '',
    'description': '',
    'image': '',
    'metadata': '',
    'AppContract': AppContractConnected,
    'NftContract': NftContractConnected,
    'upVoted': false,
    'downVoted': false,
    'currentVoteState': 0
  }

  await AppContractConnected.methods.getUserVote(postID).call({from: senderAddress}).then((result) => {
    var userVoteObj = setUserVote(parseInt(result));
    post['upVoted'] = userVoteObj['upVoted'];
    post['downVoted'] = userVoteObj['downVoted'];
    post['currentVoteState'] = userVoteObj['currentVoteState'];
  })

  await AppContractConnected.methods.getPostContent(postID).call().then((result) => {
    post['postID'] = postID
    post['publisher'] = result['publisher']
    post['publishTime'] = result['publishTime']
    post['downvoteCount'] = result['downvoteCount']
    post['upvoteCount'] = result['upvoteCount']
    post['commentCount'] = result['commentCount']
  })

  await NftContractConnected.methods.getMemeURI(postID).call().then((result) => {
    post['metadata'] = result
  })

  await axios.get(post['metadata']).then(({ data })=> {
    post['name'] = data['name']
    post['description'] = data['description']
    
    let imgArray = data['image'].split("/")
    post['image'] = "https://"+imgArray[2]+".ipfs.nftstorage.link/"+imgArray[3]
  }).catch((err)=> {
    console.log("ERR: =====> axios metadata")
  })

  return post
}

//mint NFT
export const mintNFTmeme = async(mintNFTpack) => {
  let image = mintNFTpack.image
  let name = mintNFTpack.name
  let description = mintNFTpack.description
  let NFTStorageConnected = mintNFTpack.NFTStorageConnected
  let NftContractConnected = mintNFTpack.NftContractConnected
  let defaultOptions = mintNFTpack.defaultOptions
  let nftID = 0

  let result = await NFTStorageConnected.store({
    image,
    name,
    description,
  })

  let metadataURI = "https://" + result["ipnft"]+ ".ipfs.nftstorage.link/metadata.json"

  await NftContractConnected.methods.createMeme(metadataURI).send(defaultOptions).then((result) => {
    let returnValue = result.events["CreateMeme"].returnValues;
    nftID = returnValue.memeId;
  })

  return nftID
}

//get List all Nft ID minted
export const getListNft = async(getListNFTpack) => {
  let NftContractConnected = getListNFTpack.NftContractConnected
  let senderAddress = getListNFTpack.senderAddress
  let isPost = getListNFTpack.isPost
  let listNftID = []
  let listNftID_isPost = []
  let listNftID_nonPost = []
  try {
    await NftContractConnected.methods.getMemesOfOwner().call({from: senderAddress}).then((result) => {
      listNftID = result
    })

    if(isPost === 1){
      for (let index = 0; index < listNftID.length; index++) {
        let nftID = listNftID[index]
        await NftContractConnected.methods.isPostExist(nftID).call().then((result) => {
          if(result){
            listNftID_isPost.push(nftID)
          }
        })
      }
      return listNftID_isPost
    }

    if(isPost === 2){
      for (let index = 0; index < listNftID.length; index++) {
        let nftID = listNftID[index]
        await NftContractConnected.methods.isPostExist(nftID).call().then((result) => {
          if(!result){
            listNftID_nonPost.push(nftID)
          }
        })
      }
      return listNftID_nonPost
    }

  } catch (error) {
    //nothing to do
    console.log("ERR: =====> getListNft", error)
  }
  return listNftID
}

//get List NFT by page
export const getListNftByPage = async(getListNftByPagepack) => {
  //console.log(getListNFTpack)
  let NftContractConnected = getListNftByPagepack.NftContractConnected
  let listNftID = getListNftByPagepack.listNftID
  let listNftByPage = []

  if (listNftID){
    for (let index = listNftID.length - 1; index >= 0; index--) {
      let nftID = listNftID[index]
      let nftDetail = {
        id: 0,
        name: '',
        description: '',
        image: '',
        metadata: '',
        isPost: false
      }
      await NftContractConnected.methods.getMemeURI(nftID).call().then((result) => {
        nftDetail['id'] = nftID
        nftDetail['metadata'] = result
      })

      await NftContractConnected.methods.isPostExist(nftID).call().then((result) => {
        nftDetail['isPost'] = result
      })

      listNftByPage.push(nftDetail)
    }
  }

  if (listNftByPage.length === listNftID.length) {
    for (let index = 0; index < listNftByPage.length; index++) {
      await axios.get(listNftByPage[index]['metadata']).then(({ data })=> {
        listNftByPage[index]['name'] = data['name']
        listNftByPage[index]['description'] = data['description']
        
        let imgArray = data['image'].split("/")
        listNftByPage[index]['image'] = "https://"+imgArray[2]+".ipfs.nftstorage.link/"+imgArray[3]
      }).catch((err)=> {
        console.log("ERR: =====> axios metadata")
      })
    }
  }

  return listNftByPage
}


export const pushlishPost = async(pushlishPOSTpack) => {
  let AppContractConnected = pushlishPOSTpack.AppContractConnected
  let defaultOptions = pushlishPOSTpack.defaultOptions
  let nftID = pushlishPOSTpack.nftID
  let listNFT = pushlishPOSTpack.listNFT
  await AppContractConnected.methods.publishPost(nftID).send(defaultOptions)
  return [nftID, listNFT]
}

export const unpushlishPost = async(unpushlishPOSTpack) => {
  let AppContractConnected = unpushlishPOSTpack.AppContractConnected
  let defaultOptions = unpushlishPOSTpack.defaultOptions
  let nftID = unpushlishPOSTpack.nftID
  let listNFT = unpushlishPOSTpack.listNFT
  await AppContractConnected.methods.unpublishPost(nftID).send(defaultOptions)
  return [nftID, listNFT]
}

// ultility
function setUserVote(userVoteState) {
  switch(userVoteState) {
    case 0:
      return {
        'upVoted': false,
        'downVoted': false,
        'currentVoteState': userVoteState
      }
    case 1:
      return {
        'upVoted': true,
        'downVoted': false,
        'currentVoteState': userVoteState
      }
    case 2:
      return {
        'upVoted': false,
        'downVoted': true,
        'currentVoteState': userVoteState
      }
    default:
      return {
        'upVoted': false,
        'downVoted': false,
        'currentVoteState': userVoteState
      }
  }
}

function removeHexByte(s) {
  const tidy = typeof s === 'string'
      ? s.replace( /[\x00-\x1F\x7F-\xA0]+/g, '' )
      : s ;
  return tidy;
}