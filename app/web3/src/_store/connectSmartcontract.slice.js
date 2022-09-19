import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPosts, getPostContentByid, mintNFTmeme, getListNft, getListNftByPage, 
        pushlishPost, upvotePostHelper, downvotePostHelper,
        commentPostHelper, getCommentByPageHelper, unpushlishPost } from '_helpers';
import { MINT_SUCCESS, MINT_FAILED } from '_store/config'

// create slice
const name = 'connectSmartcontract';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const connectSmartcontractActions = { ...slice.actions, ...extraActions };
export const connectSmartcontractReducer = slice.reducer;

// implementation
function createInitialState() {
    return {
        commentPostData: [],
        newCommentData: null,
        newVoteState: null,
        postsIdArray: [],
        posts: [],
        mintNFTStatus: 0,
        listAllNFT: [],
        listNftByPage: [],
        listPostDetail: {}
    }
}

function createExtraActions() {
    return {
        getPostsByPage: getPostsByPage(),
        getPostContentid: getPostContentid(),
        mintNFTMeme: mintNFTMeme(),
        getListNFT: getListNFT(),
        getListNFTByPage: getListNFTByPage(),
        pushlishPOST: pushlishPOST(),
        upvotePost: upvotePost(),
        downvotePost: downvotePost(),
        commentPost: commentPost(),
        getCommentByPage: getCommentByPage(),
        unpushlishPOST: unpushlishPOST(),
        getPostDetail: getPostDetail()

    };
    // get comment by page
    function getCommentByPage() {
        return createAsyncThunk(
            "getCommentByPage",
            async (packedObject) => await getCommentByPageHelper(packedObject)
        )
    }

    //comment post
    function commentPost() {
        return createAsyncThunk(
            "commentPost",
            async (packedObject) => await commentPostHelper(packedObject)
        )
    }

    // upvote
    function upvotePost() {
        return createAsyncThunk(
            "upvotePost",
            async (packedObject) => await upvotePostHelper(packedObject) 
        )
    }

    // downvote
    function downvotePost() {
        return createAsyncThunk(
            "downvotePost",
            async (packedObject) => await downvotePostHelper(packedObject) 
        )
    }

    //getPostsByPage
    function getPostsByPage() {
        return createAsyncThunk(
            "getPostsByPage",
            async (getPostsByPagePack) => await getPosts(getPostsByPagePack)
        );
    }

    //getPostContentid
    function getPostContentid() {
        return createAsyncThunk(
            "getPostContentid",
            async (getPostContentidPack) => await getPostContentByid(getPostContentidPack)
        );
    }
    //mintNFTMeme
    function mintNFTMeme() {
        return createAsyncThunk(
            "mintNFTMeme",
            async (mintNFTpack) => await mintNFTmeme(mintNFTpack)
        );
    }

    //getListNFT
    function getListNFT() {
        return createAsyncThunk(
            "getListNFT",
            async (getListNFTpack) => await getListNft(getListNFTpack)
        );
    }

    //getListNFT By Page
    function getListNFTByPage() {
        return createAsyncThunk(
            "getListNFTByPage",
            async (getListNftByPagepack) => await getListNftByPage(getListNftByPagepack)
        );
    }

    //pushlish post
    function pushlishPOST() {
        return createAsyncThunk(
            "pushlishPOST",
            async (pushlishPOSTpack) => await pushlishPost(pushlishPOSTpack)
        );
    }

    //unpushlish post
    function unpushlishPOST() {
        return createAsyncThunk(
            "unpushlishPOST",
            async (unpushlishPOSTpack) => await unpushlishPost(unpushlishPOSTpack)
        );
    }

    //getPostDetail post
    function getPostDetail() {
        return createAsyncThunk(
            "getPostDetail",
            async (getPostContentidPack) => await getPostContentByid(getPostContentidPack)
        );
    }
}

function createExtraReducers() {
    return {
        ...getPostsByPage(),
        ...getPostContentid(),
        ...mintNFTMeme(),
        ...getListNFT(),
        ...getListNFTByPage(),
        ...pushlishPOST(),
        ...upvotePost(),
        ...downvotePost(),
        ...commentPost(),
        ...getCommentByPage(),
        ...unpushlishPOST(),
        ...getPostDetail()
    };

    function getCommentByPage() {
        let { pending, fulfilled, rejected } = extraActions.getCommentByPage;
        return {
            [pending]: (state) => {
            },
            [fulfilled]: (state, action) => {
                // state.commentPostData = state.commentPostData.concat(action.payload);
                state.commentPostData = action.payload;
            },
            [rejected]: (state, action) => {
            }
        };
    }

    function commentPost() {
        let { pending, fulfilled, rejected } = extraActions.commentPost;
        return {
            [pending]: (state) => {
            },
            [fulfilled]: (state, action) => {
                console.log(action.payload);
                state.newCommentData = action.payload;
            },
            [rejected]: (state, action) => {
            }
        };
    };

    function downvotePost() {
        let { pending, fulfilled, rejected } = extraActions.downvotePost;
        return {
            [pending]: (state) => {
            },
            [fulfilled]: (state, action) => {
                state.newVoteState = action.payload;
            },
            [rejected]: (state, action) => {
            }
        };
    };

    function upvotePost() {
        let { pending, fulfilled, rejected } = extraActions.upvotePost;
        return {
            [pending]: (state) => {
            },
            [fulfilled]: (state, action) => {
                state.newVoteState = action.payload
            },
            [rejected]: (state, action) => {
            }
        };
    };

    function getPostsByPage() {
        let { pending, fulfilled, rejected } = extraActions.getPostsByPage;
        return {
            [pending]: (state) => {
                //notthing to do
            },
            [fulfilled]: (state, action) => {
                state.postsIdArray = action.payload
                //console.log("================>getPostsByPage fulfilled",action)
            },
            [rejected]: (state, action) => {
                //console.log("================>getPostsByPage rejected",action)
            }
        };
    };

    function getPostContentid() {
        let { pending, fulfilled, rejected } = extraActions.getPostContentid;
        return {
            [pending]: (state) => {
                //notthing to do
            },
            [fulfilled]: (state, action) => {
                state.posts = state.posts.concat(action.payload);
                // state.posts['action.payload.postID'] = action.payload;
                //console.log("================>getPostContentid fulfilled",action)
            },
            [rejected]: (state, action) => {
                //console.log("================>getPostContentid rejected",action)
            }
        };
    };

    function mintNFTMeme() {
        let { pending, fulfilled, rejected } = extraActions.mintNFTMeme;
        return {
            [pending]: (state) => {
                //notthing to do
            },
            [fulfilled]: (state, action) => {
                state.mintNFTStatus = MINT_SUCCESS
                //console.log("================>mintNFTMeme fulfilled",action)
            },
            [rejected]: (state, action) => {
                state.mintNFTStatus = MINT_FAILED
                //console.log("================>mintNFTMeme rejected",action)
            }
        };
    };

    function getListNFT() {
        let { pending, fulfilled, rejected } = extraActions.getListNFT;
        return {
            [pending]: (state) => {
                //notthing to do
            },
            [fulfilled]: (state, action) => {
                state.listAllNFT = action.payload
                //console.log("================>getListNFT fulfilled",action)
            },
            [rejected]: (state, action) => {
                //console.log("================>getListNFT rejected",action)
            }
        };
    };

    function getListNFTByPage() {
        let { pending, fulfilled, rejected } = extraActions.getListNFTByPage;
        return {
            [pending]: (state) => {
                //notthing to do
            },
            [fulfilled]: (state, action) => {
                state.listNftByPage = action.payload
                //console.log("================>getListNFT fulfilled",action)
            },
            [rejected]: (state, action) => {
                //console.log("================>getListNFT rejected",action)
            }
        };
    };

    function pushlishPOST() {
        let { pending, fulfilled, rejected } = extraActions.pushlishPOST;
        return {
            [pending]: (state) => {
                //notthing to do
            },
            [fulfilled]: (state, action) => {
                let nftID = action.payload[0]
                let nftArr = action.payload[1]
                const newnftArr = nftArr.map(obj =>
                    obj.id === nftID ? { ...obj, isPost: true } : obj
                )
                state.listNftByPage = newnftArr
                //console.log("================>pushlishPOST fulfilled",action)
            },
            [rejected]: (state, action) => {
                //console.log("================>pushlishPOST rejected",action)
            }
        };
    };

    function unpushlishPOST() {
        let { pending, fulfilled, rejected } = extraActions.unpushlishPOST;
        return {
            [pending]: (state) => {
                //notthing to do
            },
            [fulfilled]: (state, action) => {
                let nftID = action.payload[0]
                let nftArr = action.payload[1]
                console.log(nftID)
                console.log(nftArr)
                const newnftArr = nftArr.map(obj =>
                    obj.id === nftID ? { ...obj, isPost: false } : obj
                )
                state.listNftByPage = newnftArr
                //console.log("================>unpushlishPOST fulfilled",action)
            },
            [rejected]: (state, action) => {
                //console.log("================>unpushlishPOST rejected",action)
            }
        };
    };

    function getPostDetail() {
        let { pending, fulfilled, rejected } = extraActions.getPostDetail;
        return {
            [pending]: (state) => {
                //notthing to do
            },
            [fulfilled]: (state, action) => {
                let id = action.payload['postID']
                state.listPostDetail[id] = action.payload
                //console.log("================>getPostDetail fulfilled", action)
            },
            [rejected]: (state, action) => {
                //console.log("================>getPostDetail rejected",action)
            }
        };
    };
}