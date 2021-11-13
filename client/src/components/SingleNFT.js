import React from "react";

export const SingleNFT = ({ image, name, description }) => {
  return (
    <div className="col-4 mt-3">
      <div className="cart text-center">
        <div className="img mt-4 pt-3">
          <img src={image} alt="loading..." />
          <p className="mt-1">{name}</p>
          <h6 className=" mt-2">
            {description}
          </h6>
        </div>
        <div className="group mb-5 pb-2 mt-3 text-center">
          <button>Stake</button>
          <button>UnStake</button>
        </div>
      </div>
    </div>
  );
}
