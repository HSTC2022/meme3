import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import { connectSmartcontractActions } from '_store';
import MoonLoader from "react-spinners/MoonLoader";

export default function Card({item}) {
  // Global
  const dispatch = useDispatch();
  const { newVoteState, newCommentData, commentPostData } = useSelector(x => x.connectSmartcontract);
  const { account, isConnected } = useSelector(x => x.web3Connector);

  // LocalState
  const [localState, setLocalState] = useState({
    [item.postID]: {
      upVoted: item.upVoted,
      downVoted: item.downVoted,
      upvoteCount: item.upvoteCount,
      downvoteCount: item.downvoteCount,
      commentCount: item.commentCount,
      currentVoteState: item.currentVoteState,
      isCopied: false,
      showComment: false,
      sharePostLink: "www.meme3.app/",
      commentTxt: null,
      commentData: [],
      startIdx: 0,
      numCommentLoading: 3,
      divScrollBoxStyle: {
        overflowY: 'scroll',
        overflowX: 'hidden',
        height:'0px'
      },
      senderAddress: null,
      imgLoaded: false
    }
  })

  const [isWaiting, setIsWaiting] = useState(false);
  const [isCommentWaiting, setIsCommentWaiting] = useState(false);
  const [isShowLoadMore, setIsShowLoadMore] = useState(false);
  const [senderAddress, setSenderAddress] = useState(null);

  var itemState = localState[item.postID];

  // set senderAddress when user connected
  useEffect(() => {
    setSenderAddress(account)
  }, [account])

  // set some info for postAfterBar
  useEffect(() => {
    setLocalState({
      [item.postID]:{
        ...itemState,
        upvoteCount: item.upvoteCount,
        downvoteCount: item.downvoteCount,
        commentCount: item.commentCount,
        upVoted: item.upVoted,
        downVoted: item.downVoted
      }
    })
  }, [item])

  // update vote state after user action
  useEffect(() => {
    setIsWaiting(false);
    if(!newVoteState || newVoteState['postId'] !== item.postID) return;
    changeVoteStatus(newVoteState.currentVoteState);
  }, [newVoteState])

  // update state when user comment(update in local)
  useEffect(() => {
    setIsCommentWaiting(false);
    if(!newCommentData) return;
    if(newCommentData.postId !== item.postID) return;
    var newComment = {postId: newCommentData.postId, uAddress: newCommentData.sender.toLowerCase(), uComment: newCommentData.comment};
    var newData = [newComment].concat(itemState.commentData);
    setLocalState({
      [item.postID]:{
        ...itemState,
        commentTxt: '',
        commentData: newData,
        commentCount: parseInt(itemState.commentCount) + 1,
        divScrollBoxStyle:{
          ...itemState.divScrollBoxStyle,
          height: Math.min(4 * 86 ,newData.length * 86) + 'px'
        }
      }
    })
  }, [newCommentData])

  // update state when user load comment(from blockchain)
  useEffect(() => {
    if(commentPostData.length <= 0) return;
    if(commentPostData[0].postId !== item.postID) return;
    var newData = itemState.commentData.concat(commentPostData);
    setLocalState({
      [item.postID]:{
        ...itemState,
        commentData: newData,
        divScrollBoxStyle:{
          ...itemState.divScrollBoxStyle,
          height: Math.min(4 * 86 ,newData.length * 86 + 30) + 'px'
        }
      }
    })
    if(itemState.commentCount <= newData.length){
      setIsShowLoadMore(false);
    } else {
      setIsShowLoadMore(true)
    }
  }, [commentPostData])

  function changeVoteStatus(newState){
    switch (newState){
        case 0:
          setLocalState({
            [item.postID]:{
              ...itemState,
              upVoted: false,
              downVoted: false,
              upvoteCount: (itemState.currentVoteState===1? Math.max(parseInt(itemState.upvoteCount) - 1, 0): itemState.upvoteCount),
              downvoteCount: (itemState.currentVoteState===2? Math.max(parseInt(itemState.downvoteCount) - 1, 0): itemState.downvoteCount),
              currentVoteState: newState
            }
          });
          break;
        case 1:
          setLocalState({
            [item.postID]:{
              ...itemState,
              upVoted: true,
              downVoted: false,
              upvoteCount: Math.max(parseInt(itemState.upvoteCount) + 1, 0),
              downvoteCount: (itemState.currentVoteState!==0? Math.max(parseInt(itemState.downvoteCount) - 1, 0): itemState.downvoteCount),
              currentVoteState: newState
            }
          })
          break;
        case 2:
          setLocalState({
            [item.postID]:{
              ...itemState,
              upVoted: false,
              downVoted: true,
              upvoteCount: (itemState.currentVoteState!==0? Math.max(parseInt(itemState.upvoteCount) - 1, 0): itemState.upvoteCount),
              downvoteCount: Math.max(parseInt(itemState.downvoteCount) + 1, 0),
              currentVoteState: newState
            }
          })
          break;
    }
  }

  function copyShareLink(postId){
    navigator.clipboard.writeText(itemState.sharePostLink + postId);
    setLocalState({
      [item.postID]:{
        ...itemState,
        isCopied: true
      }
    });
    setTimeout(()=>{
      setLocalState({
        [item.postID]:{
          ...itemState,
          isCopied: false
        }
      });
    }, 1686)
  }

  function loadMoreComment(postId){
    if(item.postID !== postId) return;
    if(itemState.commentCount <= itemState.commentData.length){
      setIsShowLoadMore(false);
    } else {
      setIsShowLoadMore(true)
    }
    
    var endIndex = itemState.startIdx + itemState.numCommentLoading
    setLocalState({
      [item.postID]:{
        ...itemState,
        startIdx: endIndex
      }
    })
    dispatch(connectSmartcontractActions.getCommentByPage({AppContract: item.AppContract, 
                                                    postID: item.postID,
                                                    startIdx: itemState.startIdx,
                                                    endIdx: endIndex}));
  }

  function showCommentBox(){
    if(itemState.showComment){
      setLocalState({
        [item.postID]:{
          ...itemState,
          showComment: false
        }
      })
    } else {
      if(itemState.startIdx === 0){
        var endIdx = itemState.startIdx + itemState.numCommentLoading
        setLocalState({
          [item.postID]:{
            ...itemState,
            showComment: true,
            startIdx: endIdx
          }
        })
        dispatch(connectSmartcontractActions.getCommentByPage({AppContract: item.AppContract, 
                                                              postID: item.postID,
                                                              startIdx: itemState.startIdx,
                                                              endIdx: endIdx}));
      } else {
        setLocalState({
          [item.postID]:{
            ...itemState,
            showComment: true
          }
        })
      }
    }
  }

  const handleChangeCommentInput = (event) => {
    setLocalState({
      [item.postID]:{
        ...itemState,
        commentTxt: event.target.value
      }
    })
  };

  return (
    <>   
        <div className="card mb-2">
            {/* Card header START */}
            <div className="card-header border-0 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        {/* Avatar */}
                        <div className="avatar avatar-story me-2">
                            <Avatar value={item.publisher.substring(0,5)} maxInitials={2} size="40" round={true}/>
                        </div>
                        <div>
                        <div className="nav nav-divider">
                            <h6 className="nav-item card-title mb-0"><a href="#"> {item.publisher.substring(0, 5) + "..." + item.publisher.slice(-5)} </a></h6>
                        </div>
                            <p className="mb-0 small text-secondary">
                              {new Date(item.publishTime * 1000).toLocaleString()}
                            </p>
                        </div>
                    </div>
                {/* Card feed action dropdown END */}
                </div>
            </div>
            {/* Card header END */}
            {/* Card body START */}
            <div className="card-body">
                <h4>{item.description}</h4>
                {/* Card img */}
                <a href={'/' +item.postID} target="_blank" > <img className="card-img" src={itemState.imgLoaded ? item.image: "assets/images/default_image.jpeg"} 
                                          onLoad={() => {
                                            setLocalState({
                                              [item.postID]:{
                                                ...itemState, 
                                                imgLoaded:true
                                                }}
                                            )}} alt={item.name}/></a>
                {/* Feed react START */}
                <ul className="nav nav-stack mt-3 small">
                    {/* Upvote button */}
                    <li className="nav-item">
                        {
                          !isWaiting?<button type="button" className={itemState.upVoted? "py-1 btn-sm btn btn-secondary": "py-1 btn-sm btn btn-outline-secondary"} 
                          onClick={(event) => {
                            if (isConnected == false){
                              alert('Please, connect to your wallet')
                              return
                            }
                            setIsWaiting(true);
                            dispatch(connectSmartcontractActions.upvotePost({AppContract: item.AppContract, 
                                                                              account: senderAddress, 
                                                                              postID: item.postID}));
                            }}>
                            <i className="fa-solid fa-heart" />
                            <span className='px-1'>{itemState.upvoteCount}</span>
                          </button>:null
                        }
                        
                    </li>
                    {/* Downvote button */}
                    <li className="nav-item">
                      {
                        !isWaiting?<button type="button" className={itemState.downVoted? "py-1 btn-sm btn btn-secondary":"py-1 btn-sm btn btn-outline-secondary"} onClick={(event) => {
                          if (isConnected == false){
                            alert('Please, connect to your wallet')
                            return
                          }
                          setIsWaiting(true);
                          dispatch(connectSmartcontractActions.downvotePost({AppContract: item.AppContract, 
                                                                            account: senderAddress, 
                                                                            postID: item.postID}));
                      }}>
                          
                          <i className="fa-solid fa-heart-crack" />
                          <span className='px-1'>{itemState.downvoteCount}</span>
                      </button>:null
                      }
                    </li>
                    {/* Showcomment button */}
                    <li className="nav-item">
                      {
                        !isWaiting?<button type="button" className={itemState.showComment? "py-1 btn-sm btn btn-secondary":"py-1 btn-sm btn btn-outline-secondary"} onClick={(event) => {
                          showCommentBox()
                      }}>
                          <i className="fa-solid fa-comment" />
                          <span className='px-1'>{itemState.commentCount}</span>
                      </button>:null
                      }
                    </li>
                    <MoonLoader color={"#ffffff"} loading={isWaiting} size={30}/>
                    {/*Share dropdown*/}
                    <li className="nav-item ms-sm-auto">
                      <button className={itemState.isCopied? "btn btn-secondary":"btn btn-outline-secondary"} onClick={(event) => {
                          copyShareLink(item.postID)
                      }}>
                          {itemState.isCopied? "Copied!" : <i className="fa-solid fa-share" />}
                      </button>
                    </li>
                {/* Card share action END */}
                </ul>
                {/* Feed react END */}
                {/* <CardComment /> */}
                <div className={itemState.showComment? "d-print-none shadow-lg p-3 mb-0 rounded": "d-none d-print-block"} >
                  <div className="d-flex mb-3">
                    {
                      isConnected?<div className="input-group mb-0">
                                      <input type="text" className="form-control" placeholder="Add a comment..."
                                              aria-label="Add a comment..." aria-describedby="button-addon2" value= {itemState.commentTxt || ''} onChange={handleChangeCommentInput}/>
                                      {
                                        !isCommentWaiting?<button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={(event) => {
                                            if (!itemState.commentTxt || itemState.commentTxt.trim().length == 0){
                                              return
                                            }
                                            setIsCommentWaiting(true);
                                            dispatch(connectSmartcontractActions.commentPost({AppContract: item.AppContract, 
                                                                                              account: senderAddress, 
                                                                                              postID: item.postID,
                                                                                              commentTxt: itemState.commentTxt}));
                                        }}> <i className="fa-solid fa-paper-plane" /> </button>:null
                                      }
                                      <MoonLoader color={"#ffffff"} loading={isCommentWaiting} size={26}/>
                                  </div>:null
                    }
                      
                  </div>
                  <div className="box border-top" style={itemState.divScrollBoxStyle}>
                      {itemState.commentData.map((comment, index) =>
                        <div className="d-flex position-relative row mb-1 mt-2" key={index}>
                            <div className="avatar avatar-md col-3">
                                <a href="index.html#!"><Avatar className='avatar-img rounded-circle' value={comment['uAddress'].substring(0,5)} maxInitials={2} size="40"/></a>
                            </div>
                            <div className="col-9">
                                <div className="bg-light rounded-start-top-0 p-3 rounded">
                                    <div className="d-flex justify-content-between">
                                        <p className="mb-1"><a href="index.html#!"> {comment.uAddress.substring(0, 5) + "..." + comment.uAddress.slice(-5)} </a> - 2 hours ago</p>
                                    </div>
                                    <p className="small mb-0">{comment.uComment}</p>
                                </div>
                            </div>
                        </div>
                      )}
                      <button href="index.html#!" role="button" className={isShowLoadMore? "btn btn-link btn-link-loader btn-sm text-secondary d-flex align-items-center ms-5 mt-3":"d-none d-print-block"} data-bs-toggle="button" aria-pressed="true"
                              onClick={(event) => {
                                  loadMoreComment(item.postID)
                              }}>
                          <div className="spinner-dots me-2">
                              <span className="spinner-dot"></span>
                              <span className="spinner-dot"></span>
                              <span className="spinner-dot"></span>
                          </div>
                          Load more comment
                      </button>
                  </div>
              </div>

            </div>
            {/* Card body END */}
            {/* Card footer START */}
            {/* <div className="card-footer border-0 pt-0">
            </div> */}
            {/* Card footer END */}
        </div>
    </>
  )
}
