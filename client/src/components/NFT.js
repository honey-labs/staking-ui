import React, { useState, useEffect } from "react";

const NFT = (props) => {
  const [Nfts, setNfts] = useState();

  console.log(Nfts);

  useEffect(() => {
    setNfts(props.nft);
    return () => {
      setNfts("");
    };
  }, [props.nft]);

  return (
    <>
      {props.connect ? (
        <>
          <section className="nft mt-2 my-5">
            <div className="container">
              <div className="row text-center">
                <div className="col-12">
                  <h4 className="title">NFT</h4>
                </div>
              </div>
              <div className="row  d-flex justify-content-center">
                {Nfts.loading ? (
                  <>
                    <p className="text-center">loading...</p>
                  </>
                ) : (
                  <>
                    {Nfts.nft &&
                      Nfts.nft.length > 0 &&
                      Nfts.nft.map((val, ind) => {
                        return (
                          <div className="col-4 mt-3" key={ind}>
                            <div className="cart text-center">
                              <div className="img mt-4 pt-3">
                                <img src={val.image} alt="loading..." />
                                <p className="mt-1">{val.name}</p>
                                <h6 className=" mt-2">{val.description}</h6>
                              </div>
                              <div className="group mb-5 pb-2 mt-3 text-center">
                                <button>Stake</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default NFT;
