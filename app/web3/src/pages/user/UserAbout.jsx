import React, {useEffect} from 'react';
import {HeaderUser} from "_components/Header";
// import {Link} from "react-router-dom";
import './UserAbout.scss';

export {UserAbout};
function UserAbout() {
  useEffect(() => {
    document.title = 'My profile';
  });
  return (
    <div className="container meme-user-about-page">
      <div className="row g-4">
        <div className="col-lg-12 vstack gap-4">
          <HeaderUser/>
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h5 className="card-title"> Profile Info</h5>
            </div>
            <div className="card-body">
              <h1>Coming Soon...!</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
