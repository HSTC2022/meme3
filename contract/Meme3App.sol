// SPDX-License-Identifier: MIT
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Meme3NFT.sol";

contract Meme3App is Ownable{
    using EnumerableSet for EnumerableSet.UintSet;

    // Defind event
    event AddPaidMeme(address indexed sender, uint256 cost, uint256 id);
    event AddPaidAds(address indexed sender, uint256 cost, uint256 id);
    event RemovePaidMeme(address indexed sender, uint256 slotId, uint256 tokenId);
    event RemovePaidAds(address indexed sender, uint256 slotId, uint256 tokenId);
    event Upvote(address indexed sender, uint256 postId, ActionType voteState);
    event Downvote(address indexed sender, uint256 postId, ActionType voteState);
    event PublishPost(address indexed sender, uint256 postId);
    event UnpublishPost(address indexed sender, uint256 postId);

    uint constant MINUTE_IN_SECONDS = 60;
    uint constant HOUR_IN_SECONDS = 3600;
    uint constant DAY_IN_SECONDS = 86400;

    uint public MAX_PAID_MEME = 1;
    uint public MAX_PAID_ADS = 3;

    uint public COST_PAID_MEME = 1 ether;
    uint public COST_PAID_ADS = 1 ether;

    enum ActionType { NORMAL, UPVOTE, DOWNVOTE }

    enum ItemType { NORMAL, PAID_MEME, PAID_ADS }

    struct PaidItem{
        address customer;
        string uri;
        uint256 id;
        ItemType nftType;
        uint256 cost;
        uint256 startTime;
        uint256 endTime;
        uint256 updateTime;
    }

    struct PostItem{
        address publisher;
        uint256 publishTime;
        uint256 upvoteCount;
        uint256 downvoteCount;
        uint256 commentCount;
    }

    // postId => (usrAddress (.join)  comment)
    mapping(uint256 => string[]) private _commentInPost;
    mapping(uint256 => uint256) private _numCommentInPost;
    mapping(uint256 => mapping(address => ActionType)) private _postUserAction;//0:None 1:Up 2:Down
    
    ActionType private actionType;
    ItemType private nftType;
    Meme3NFT tokenNFT;

    mapping(uint256 => PostItem) private _publishedPost;
    EnumerableSet.UintSet private _indexPublishedPost;

    PaidItem[] public appOwnedPaidMeme;
    mapping(address => PaidItem[]) public userOwnedPaidMeme;
    mapping(uint256 => PaidItem) public paidMemeAtDetail;
    mapping(uint256 => uint256) public paidMemeAtIndex;

    PaidItem[] public appOwnedPaidAds;
    mapping(address => PaidItem[]) public userOwnedPaidAds;
    // id => items
    mapping(uint256 => PaidItem) public paidAdsAtDetail;
    // id => index
    mapping(uint256 => uint256) public paidAdsAtIndex;

    modifier onlyTokenOwner(uint256 tokenId){
        require(msg.sender == tokenNFT.ownerOf(tokenId), "You aren't token owner");
        _;
    }

    modifier isPostExist(uint256 postId){
        require(tokenNFT.isPostExist(postId) == true, "Post does not exist");
        _;
    }

    constructor(Meme3NFT _tokenNFT){
        // init nftContract
        tokenNFT = _tokenNFT;

        // init app data
        // initAppData();
    }

    // publish a post
    function publishPost(uint256 memeId) external {
        require(msg.sender == tokenNFT.ownerOf(memeId), "Only owner can post");
        require(tokenNFT.getApproved(memeId) != address(this), "You need approve first");
        PostItem memory newPost = PostItem({
            publisher: msg.sender,
            publishTime: block.timestamp,
            upvoteCount: 0,
            downvoteCount: 0,
            commentCount: 0
        });
        _publishedPost[memeId] = newPost;
        tokenNFT.addPost(msg.sender, memeId);
        _indexPublishedPost.add(memeId);

        emit PublishPost(msg.sender, memeId);
    }

    // get post content
    function getPostContent(uint256 postId) public view returns(PostItem memory){
        return(_publishedPost[postId]);
    }

    //get post by page
    function getPostByPage(uint256 startIndex, uint256 endIndex) public view returns(uint256[] memory){
        require(startIndex <= endIndex, "Wrong input");
        require(_indexPublishedPost.length() >= startIndex, "No more post");

        (,uint256 min) = max_min(_indexPublishedPost.length(), endIndex);
        uint256[] memory newestPost = new uint256[](min - startIndex);
        uint256 numPublishedPost = _indexPublishedPost.length();
        uint256 start = numPublishedPost - min;
        uint256 end = numPublishedPost - startIndex;
        for (uint256 i = 0; i < (end - start); i=unsafe_inc(i)){
            uint256 dataIdx = i + start;
            newestPost[i] = _indexPublishedPost.at(dataIdx);
        }

        return newestPost;
    }

    // unpublish a post
    function unpublishPost(uint256 postId) external isPostExist(postId){
        require(msg.sender == tokenNFT.ownerOf(postId), "Only owner");
        require(_indexPublishedPost.contains(postId) == true, "Post not exist");
        delete _publishedPost[postId];
        tokenNFT.removePost(msg.sender, postId);
        _indexPublishedPost.remove(postId);

        emit UnpublishPost(msg.sender, postId);
    }

    // upvote 
    function upvotePost(uint256 postId) external isPostExist(postId){
        ActionType userAction = ActionType.NORMAL;
        if (_postUserAction[postId][msg.sender] == ActionType.NORMAL) {
            _publishedPost[postId].upvoteCount++;
            _postUserAction[postId][msg.sender] = ActionType.UPVOTE;
            userAction = ActionType.UPVOTE;
        } else if (_postUserAction[postId][msg.sender] == ActionType.DOWNVOTE) {
            _publishedPost[postId].upvoteCount++;
            _postUserAction[postId][msg.sender] = ActionType.UPVOTE;
            _publishedPost[postId].downvoteCount--;
            userAction = ActionType.UPVOTE;
        } else {
            _publishedPost[postId].upvoteCount--;
            _postUserAction[postId][msg.sender] = ActionType.NORMAL;
            userAction = ActionType.NORMAL;
        }
        emit Upvote(msg.sender, postId, userAction);
    }

    // downvote
    function downvotePost(uint256 postId) external isPostExist(postId){
        ActionType userAction = ActionType.NORMAL;
        if (_postUserAction[postId][msg.sender] == ActionType.NORMAL) {
            _publishedPost[postId].downvoteCount++;
            _postUserAction[postId][msg.sender] = ActionType.DOWNVOTE;
            userAction = ActionType.DOWNVOTE;
        } else if (_postUserAction[postId][msg.sender] == ActionType.UPVOTE) {
            _publishedPost[postId].downvoteCount++;
            _postUserAction[postId][msg.sender] = ActionType.DOWNVOTE;
            _publishedPost[postId].upvoteCount--;
            userAction = ActionType.DOWNVOTE;
        } else {
            _publishedPost[postId].downvoteCount--;
            _postUserAction[postId][msg.sender] = ActionType.NORMAL;
            userAction = ActionType.NORMAL;
        }
        emit Downvote(msg.sender, postId, userAction);
    }

    // get vote status by user
    function getUserVote(uint256 postId) public view isPostExist(postId) returns(ActionType){
        return _postUserAction[postId][msg.sender];
    }

    // comment
    function commentPost(uint256 postId, string memory textComment) external isPostExist(postId){
        string memory uName = addressToString(msg.sender);
        _commentInPost[postId].push(string.concat(uName, textComment));
        _numCommentInPost[postId]++;
        _publishedPost[postId].commentCount++;
    }

    // loading comment
    function getCommentByPage(uint256 postId, uint256 startIndex, uint256 endIndex) public view isPostExist(postId) returns(string[] memory){
        require(startIndex <= endIndex, "Wrong input data");
        require(_commentInPost[postId].length >= startIndex, "M3App: No more comment");
        (,uint256 min) = max_min(_commentInPost[postId].length, endIndex);
        string[] memory listComment = new string[](min - startIndex);
        uint256 numComment = _commentInPost[postId].length;
        uint256 start = numComment - min;
        uint256 end = numComment - startIndex;
        for (uint256 i = 0; i < (end - start); i=unsafe_inc(i)){
            uint256 dataIdx = i + start;
            listComment[i] = _commentInPost[postId][dataIdx];
        }

        return listComment;
    }

    // Common
    // function createPaidItem(address customer, string memory uri, uint256 id, ItemType typeNFT,
    //                         uint256 cost, uint256 startTime, uint256 endTime, uint256 updateTime) 
    //                         internal pure returns(PaidItem memory){
    //     PaidItem memory newItem = PaidItem({ 
    //         customer: customer,
    //         uri: uri,
    //         id: id, 
    //         nftType: typeNFT, 
    //         cost: cost, 
    //         startTime: startTime, 
    //         endTime: endTime, 
    //         updateTime: updateTime
    //     });

    //     return newItem;
    // }

    // function initAppData() internal {
    //     PaidItem memory blankItem = createPaidItem(address(0), "", 0, ItemType.NORMAL, 0, 0, 0, 0);

    //     for (uint256 i = 0; i < MAX_PAID_MEME; i=unsafe_inc(i)){
    //         appOwnedPaidMeme.push(blankItem);
    //     }

    //     for (uint256 i = 0; i < MAX_PAID_ADS; i=unsafe_inc(i)){
    //         appOwnedPaidAds.push(blankItem);
    //     }
    // }

    // Paid meme
    // function addPaidMeme(uint256 tokenId, uint256 numDay) public payable onlyTokenOwner(tokenId){
    //     require(msg.value == COST_PAID_MEME, "Wrong price value");

    //     // add for app control
    //     bool isSuccess = false;
    //     uint256 idx; 
    //     for (uint256 i = 0; i < MAX_PAID_MEME; i=unsafe_inc(i)){
    //         if (appOwnedPaidMeme[i].id == tokenId) {
    //             revert("You paided this meme");
    //         }
    //         if (appOwnedPaidMeme[i].id == 0){
    //             idx = i;
    //             isSuccess = true;
    //             break;
    //         }
    //     }
    //     require(isSuccess == true, "No slot for promote meme");

    //     address customer = msg.sender;
    //     string memory uri = tokenNFT.tokenURI(tokenId);
    //     ItemType typeValue = ItemType.PAID_MEME;
    //     uint256 startTime = block.timestamp;
    //     uint256 endTime = block.timestamp + (numDay * HOUR_IN_SECONDS);
    //     uint256 updateTime = block.timestamp;

    //     PaidItem memory paidMemeItem = createPaidItem(customer, uri, tokenId, typeValue, msg.value, startTime, endTime, updateTime);
    //     appOwnedPaidMeme[idx] = paidMemeItem;

    //     // add for personal control
    //     userOwnedPaidMeme[msg.sender].push(paidMemeItem);
    //     paidMemeAtDetail[tokenId] = paidMemeItem;
    //     paidMemeAtIndex[tokenId] = userOwnedPaidMeme[msg.sender].length - 1;

    //     emit AddPaidMeme(msg.sender, msg.value, tokenId);
    // }

    // function removePaidMeme(uint256 slotId) external{
    //     require(tokenNFT.ownerOf(appOwnedPaidMeme[slotId].id) == msg.sender, "Only token onwer");
    //     delete appOwnedPaidMeme[slotId];
    //     emit RemovePaidMeme(msg.sender, slotId, appOwnedPaidMeme[slotId].id);
    // }

    // function setNumberPaidMeme(uint256 max_paid_meme) public onlyOwner{
    //     require(max_paid_meme >= 0, "M3APP: Invalid value");
    //     require(max_paid_meme != MAX_PAID_MEME, "M3APP: Invalid value");

    //     PaidItem memory blankItem = createPaidItem(address(0), "", 0, ItemType.PAID_MEME, 0, 0, 0, 0);
    //     (uint256 max, uint256 min) = max_min(MAX_PAID_MEME, max_paid_meme);
    //     for (uint256 i=0; i < max; i++){
    //         if (appOwnedPaidMeme.length < max) {
    //             appOwnedPaidMeme.push(blankItem);
    //             continue;
    //         }
    //         if (i > (min-1)) {
    //             require(appOwnedPaidMeme[i].endTime < block.timestamp, "Paid time still running");
    //             appOwnedPaidMeme[i] = blankItem;
                
    //         }
    //     }
    //     MAX_PAID_MEME = max_paid_meme;
    // }

    // function setCostPaidMeme(uint256 cost_paid_meme) public onlyOwner{
    //     COST_PAID_MEME = cost_paid_meme;
    // }

  
    // // Paid ads
    // function addPaidAds(uint256 tokenId, uint256 numDay) public payable{
    //     require(msg.value == COST_PAID_ADS, "Wrong price value");

    //     // add for app control
    //     bool isSuccess = false;
    //     uint256 idx; 
    //     for (uint256 i = 0; i < MAX_PAID_ADS; i=unsafe_inc(i)){
    //         if (appOwnedPaidAds[i].id == tokenId) {
    //             revert("You paided this Ads");
    //         }
    //         if (appOwnedPaidAds[i].id == 0){
    //             idx = i;
    //             isSuccess = true;
    //             break;
    //         }
    //     }
    //     require(isSuccess == true, "No slot for ads");

    //     address customer = msg.sender;
    //     string memory uri = tokenNFT.tokenURI(tokenId);
    //     ItemType typeValue = ItemType.PAID_ADS;
    //     uint256 startTime = block.timestamp;
    //     uint256 endTime = block.timestamp + (numDay * HOUR_IN_SECONDS);
    //     uint256 updateTime = block.timestamp;

    //     PaidItem memory paidAdsItem = createPaidItem(customer, uri, tokenId, typeValue, msg.value, startTime, endTime, updateTime);
    //     appOwnedPaidAds[idx] = paidAdsItem;

    //     // add for personal control
    //     userOwnedPaidAds[msg.sender].push(paidAdsItem);
    //     paidAdsAtDetail[tokenId] = paidAdsItem;
    //     paidAdsAtIndex[tokenId] = userOwnedPaidAds[msg.sender].length - 1;

    //     emit AddPaidAds(msg.sender, msg.value, tokenId);
    // }

    // function removePaidAds(uint256 slotId) external{
    //     require(tokenNFT.ownerOf(appOwnedPaidAds[slotId].id) == msg.sender, "You are not token owner");
    //     delete appOwnedPaidAds[slotId];
    //     emit RemovePaidAds(msg.sender, slotId, appOwnedPaidAds[slotId].id);
    // }

    // function setNumberPaidAds(uint256 max_paid_ads) public onlyOwner{
    //     require(max_paid_ads >= 0, "M3APP: Invalid value");
    //     require(max_paid_ads != MAX_PAID_ADS, "M3APP: Invalid value");

    //     PaidItem memory blankItem = createPaidItem(address(0), "", 0, ItemType.NORMAL, 0, 0, 0, 0);
    //     (uint256 max, uint256 min) = max_min(MAX_PAID_ADS, max_paid_ads);
    //     for (uint256 i=0; i < max; i=unsafe_inc(i)){
    //         if (appOwnedPaidAds.length < max) {
    //             appOwnedPaidAds.push(blankItem);
    //             continue;
    //         }
    //         if (i > (min-1)) {
    //             require(appOwnedPaidAds[i].endTime < block.timestamp, "Paid time still running");
    //             appOwnedPaidAds[i] = blankItem;
                
    //         }
    //     }
    //     MAX_PAID_ADS = max_paid_ads;
    // }

    // function setCostPaidAds(uint256 cost_paid_ads) public onlyOwner {
    //     COST_PAID_ADS = cost_paid_ads;
    // }

    //ultility 
    function max_min(uint256 a, uint256 b) private pure returns (uint256, uint256) {
        if (a >= b) {
            return (a,b);
        } else {
            return (b,a);
        }
    }

    function addressToString(address _addr) private pure returns(string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
    
        bytes memory str = new bytes(51);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i=unsafe_inc(i)) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function unsafe_inc(uint x) private pure returns(uint) {
        unchecked {
            return x + 1;
        }
    }
}