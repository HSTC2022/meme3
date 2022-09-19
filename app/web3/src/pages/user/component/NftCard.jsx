import {React, useEffect, useState} from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useSelector,useDispatch } from 'react-redux';
import { connectSmartcontractActions } from '_store';

export default function NftCard({item, AppContractConnected, defaultOptions}) {

  const { listNftByPage } = useSelector(x => x.connectSmartcontract)
  const dispatch = useDispatch()
  const [isBtnLoading, setisBtnLoading] = useState(false)
  
  useEffect(() => {
    if(isBtnLoading){
      setisBtnLoading(false)
    }
  }, [listNftByPage])
  
  const handlePublish = () => {
    if(!isBtnLoading){
      setisBtnLoading(true)
    }
    let pushlishPOSTpack = {
      AppContractConnected: AppContractConnected,
      defaultOptions: defaultOptions,
      nftID: item.id,
      listNFT: listNftByPage
    }
    dispatch(connectSmartcontractActions.pushlishPOST(pushlishPOSTpack));
  }

  const handleUnpublish = () => {
    if(!isBtnLoading){
      setisBtnLoading(true)
    }
    let unpushlishPOSTpack = {
      AppContractConnected: AppContractConnected,
      defaultOptions: defaultOptions,
      nftID: item.id,
      listNFT: listNftByPage
    }
    dispatch(connectSmartcontractActions.unpushlishPOST(unpushlishPOSTpack));
  }

  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
        <Card>
          <Card.Img variant="top" src={item.image} style={{ height: '200px' }} />
          <Card.Body>
            <Card.Title>{item.name.substring(0, 20)}</Card.Title>
            <Card.Text>
              {item.description.substring(0, 25)}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <div className={!item.isPost ? "d-grid gap-2" : "d-none"}>
              <Button variant="primary" onClick={handlePublish} disabled={ isBtnLoading } >Publish Post</Button>
            </div>
            <div className={item.isPost ? "d-grid gap-2" : "d-none"}>
              <Button variant="danger" onClick={handleUnpublish} disabled={ isBtnLoading } >Unpublish Post</Button>
            </div>
          </Card.Footer>
        </Card>
    </div>
  )
}
