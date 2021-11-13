import React, { useEffect, useState } from "react";
import axios from "axios";
import { SingleNFT } from "./SingleNFT";

const UNKNOWN_COLLECTION = 'Unknown';

const fun = async (x) => {
  try {
    let arr = [];
    let n = x.length;

    for (let i = 0; i < n; i++) {
      let val = await axios.get(x[i].data.uri);
      arr.push(val);
    }

    const collections = arr.reduce((acc, { data }) => {
      const { family, name } = data.collection || {};
      const collectionName = family || name || UNKNOWN_COLLECTION;
      if (!acc[collectionName]) {
        acc[collectionName] = [];
      }
      acc[collectionName].push(data);
      return acc;
    }, {});

    return collections;
  } catch (error) {
    console.log(error);
  }
};

const NFT = (props) => {
  const [nft, setNft] = useState([]);
  const [api, setApi] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (props.valid === true) {
      setLoading(false);
      setNft(props.nft);
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

  const collections = Object.keys(api);

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
                    {collections.map((name) => {
                      return (
                        <div class="row">
                          <h5>{name}</h5>
                          {api[name].map((item, idx) => (
                            <SingleNFT
                              key={`${name}-${idx}`}
                              name={item.name}
                              image={item.image}
                            />
                          ))}
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
