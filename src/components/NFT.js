import React, { useEffect, useState } from "react";
import axios from "axios";

const fun = async (x) => {
  try {
    let arr = [];
    let n = x.length;

    for (let i = 0; i < n; i++) {
      console.log(x[i].data.uri);
      let val = await axios.get(x[i].data.uri);
      arr.push(val);
    }
    return arr;
  } catch (error) {
    console.log(error);
  }
};

const NFT = (props) => {
  const [nft, setNft] = useState([]);
  const [api, setApi] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(api);
  console.log(nft);
  useEffect(() => {
    if (props.valid === true) {
      setLoading(false);
      var result = Object.keys(props.nft).map((key) => props.nft[key]);
      setNft(result);
    }
  }, [props.nft]);

  useEffect(() => {
    async function data() {
      let res = await fun(nft);
      setApi(res);
      setLoading(true);
    }
    data();
  }, [nft]);

  return (
    <>
      {props.valid === true ? (
        <>
          <section className="nft mt-2 my-5">
            <div className="container">
              <div className="row text-center">
                <div className="col-12">
                  <h4 className="title">NFT</h4>
                </div>
              </div>
              <div className="row  d-flex justify-content-center">
                {loading ? (
                  <>
                    {api &&
                      api.length > 0 &&
                      api.map((val, ind) => {
                        return (
                          <div className="col-4 mt-3" key={ind}>
                            <div className="cart text-center">
                              <div className="img mt-4 pt-3">
                                <img src={val.data.image} alt="loading..." />
                                <p className="mt-1">{val.data.name}</p>
                                <h6 className=" mt-2">
                                  {val.data.description}
                                </h6>
                              </div>
                              <div className="group mb-5 pb-2 mt-3 text-center">
                                <button>Stake</button>
                                <button>UnStake</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </>
                ) : (
                  <>
                    <p className="text-center">loading...</p>
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
