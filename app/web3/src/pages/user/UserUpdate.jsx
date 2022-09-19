import React, {useEffect} from 'react';
import {HeaderUser} from "_components/Header";
// import {Link} from "react-router-dom";
import './UserUpdate.scss';

export {UserUpdate};
function UserUpdate() {
  useEffect(() => {
    document.title = 'Update profile';
  });
  return (
    <div className="container meme-user-update-page">
      <div className="row g-4">
        {/* Main content START */}
        <div className="col-lg-12 vstack gap-4">
          {/* Card START */}
          <HeaderUser/>
          {/* Card END */}
          {/* media START */}
          <div className="card mb-4">
            {/* Title START */}
            <div className="card-header border-0 pb-0">
              <h1 className="h5 card-title">Coming Soon !</h1>
            </div>
            {/* Card header START */}
            {/* Card body START */}
            <div className="card-body">
              {/* Form settings START */}

              {/* Settings END */}
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
