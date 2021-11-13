import React, { useEffect } from "react";
import Wallet from "./components/Wallet";
import { useDispatch } from "react-redux";
import { CheckProvider } from "./actions/index";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CheckProvider());
  }, []);

  return (
    <>
      <Wallet />
    </>
  );
};

export default App;
