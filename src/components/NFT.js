import React, { useEffect, useState } from "react";
import axios from "axios";

const fun = async (x, setLoading) => {
  try {
    let arr = [];
    let n = x.length;

    for (let i = 0; i < n; i++) {
      console.log(x[i].data.uri);
      let val = await axios.get(x[i].data.uri);
      arr.push(val);
    }
    setLoading(false);
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

  useEffect(() => {
    if (props.valid === true) {
      setLoading(false);
      var result = Object.keys(props.nft).map((key) => props.nft[key]);
      setNft(result);
    }
  }, [props.nft]);

  useEffect(() => {
    async function data() {
      let res = await fun(nft, setLoading);
      setLoading(false);
      setApi(res);
      setLoading(true);
    }
    data();
  }, [nft]);

  return (
    <>
      {props.valid === true ? (
        <>
          <section className="nft mt-3">
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
                          <div className="col-4" key={ind}>
                            <div className="cart text-center">
                              <div className="img mt-4 pt-3">
                                <img src={val.data.image} alt="loading..." />
                                <p className="mt-2">{val.data.name}</p>
                                <p className="mt-2">{val.data.address}</p>
                                <span className="mt-1 mb-4">
                                  {val.data.description}
                                </span>
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
