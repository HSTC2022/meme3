import React, {useEffect} from 'react';
import {HeaderUser} from "_components/Header";
import {Link} from "react-router-dom";
import './UserNft.scss';

export {UserNft};
function UserNft() {
  useEffect(() => {
    document.title = 'My NFT';
  });
  return (
    <div className="container meme-user-nft-page">
      <div className="row g-4">
        {/* Main content START */}
        <div className="col-lg-12 vstack gap-4">
          {/* Card START */}
          <HeaderUser/>
          {/* Card END */}
          {/* media START */}
          <div className="card">
            {/* Card header START */}
            <div className="card-header d-sm-flex align-items-center text-center justify-content-sm-between border-0 pb-0">
              <h2 className="h4 card-title">NFTs</h2>
              {/* Button modal */}
              <ul className="nav nav-pills nav-pills-soft justify-content-center border-0">
                <li className="nav-item"> <Link className="nav-link active" data-bs-toggle="tab" to="#tab-1"> All </Link> </li>
                <li className="nav-item"> <Link className="nav-link" data-bs-toggle="tab" to="#tab-2"> BSC </Link> </li>
                <li className="nav-item"> <Link className="nav-link" data-bs-toggle="tab" to="#tab-3"> Avax </Link> </li>
                <li className="nav-item"> <Link className="nav-link" data-bs-toggle="tab" to="#tab-4"> Solana </Link> </li>
              </ul>
              <Link className="btn btn-primary-soft" to="#" data-bs-toggle="modal" data-bs-target="#modalCreateEvents"> <i className="fa-solid fa-plus pe-1" /> Create event</Link>
            </div>
            {/* Card header START */}
            {/* Card body START */}
            <div className="card-body">
              <div className="row g-4">
                <div className="col-sm-6 col-xl-4">
                  {/* Event item START */}
                  <div className="card h-100">
                    <div className="position-relative">
                      <img className="img-fluid rounded-top" src="assets/images/events/01.jpg" />
                      <div className="badge bg-danger text-white mt-2 me-2 position-absolute top-0 end-0">
                        Online
                      </div>
                    </div>
                    {/* Card body START */}
                    <div className="card-body position-relative pt-0">
                      {/* Tag */}
                      <Link className="btn btn-xs btn-primary mt-n3" to="event-details-2.html">Spa training </Link>
                      <h6 className="mt-3"> <Link to="event-details-2.html"> Bone thugs-n-harmony </Link> </h6>
                      <p className="small"> <i className="bi bi-currency-dollar pe-1" /> 1000 </p>
                      {/* Button */}
                      <div className="d-flex mt-3 justify-content-between">
                        {/* Interested button */}
                        <div className="w-100">
                          <input type="checkbox" className="btn-check d-block" id="Interested1" />
                          <label className="btn btn-sm btn-outline-primary d-block" htmlFor="Interested1">
                            <i className="fa-solid fa-external-link me-1" /> View</label>
                        </div>
                      </div>
                    </div>
                    {/* Card body END */}
                  </div>
                  {/* Event item END */}
                </div>
                <div className="col-sm-6 col-xl-4">
                  {/* Event item START */}
                  <div className="card h-100">
                    <div className="position-relative">
                      <img className="img-fluid rounded-top" src="assets/images/events/02.jpg" />
                      <div className="badge bg-danger text-white mt-2 me-2 position-absolute top-0 end-0">
                        Hotel
                      </div>
                    </div>
                    {/* Card body START */}
                    <div className="card-body position-relative pt-0">
                      {/* Tag */}
                      <Link className="btn btn-xs btn-primary mt-n3" to="event-details-2.html">Spa training </Link>
                      <h6 className="mt-3"> <Link to="event-details-2.html"> Bone thugs-n-harmony </Link> </h6>
                      <p className="small"> <i className="bi bi-currency-dollar pe-1" /> 1000 </p>
                      {/* Button */}
                      <div className="d-flex mt-3 justify-content-between">
                        {/* Interested button */}
                        <div className="w-100">
                          <input type="checkbox" className="btn-check d-block" id="Interested1" />
                          <label className="btn btn-sm btn-outline-primary d-block" htmlFor="Interested1">
                            <i className="fa-solid fa-external-link me-1" /> View</label>
                        </div>
                      </div>
                    </div>
                    {/* Card body END */}
                  </div>
                  {/* Event item END */}
                </div>
                <div className="col-sm-6 col-xl-4">
                  {/* Event item START */}
                  <div className="card h-100">
                    <div className="position-relative">
                      <img className="img-fluid rounded-top" src="assets/images/events/03.jpg" />
                      <div className="badge bg-danger text-white mt-2 me-2 position-absolute top-0 end-0">
                        Online
                      </div>
                    </div>
                    {/* Card body START */}
                    <div className="card-body position-relative pt-0">
                      {/* Tag */}
                      <Link className="btn btn-xs btn-primary mt-n3" to="event-details-2.html">Spa training </Link>
                      <h6 className="mt-3"> <Link to="event-details-2.html"> Bone thugs-n-harmony </Link> </h6>
                      <p className="small"> <i className="bi bi-currency-dollar pe-1" /> 1000 </p>
                      {/* Button */}
                      <div className="d-flex mt-3 justify-content-between">
                        {/* Interested button */}
                        <div className="w-100">
                          <input type="checkbox" className="btn-check d-block" id="Interested1" />
                          <label className="btn btn-sm btn-outline-primary d-block" htmlFor="Interested1">
                            <i className="fa-solid fa-external-link me-1" /> View</label>
                        </div>
                      </div>
                    </div>
                    {/* Card body END */}
                  </div>
                  {/* Event item END */}
                </div>
              </div>
            </div>
            {/* Card body END */}
          </div>
          {/* media END */}
        </div>
        {/* Main content END */}
      </div> {/* Row END */}
    </div>
  );
}
