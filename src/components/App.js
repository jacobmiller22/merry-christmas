import React, { useEffect, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./Header";
import Dashboard from "./Dashboard";
import Register from "./auth/Register";
import LetterDetail from "./letters/LetterDetail";
import LetterCreate from "./letters/LetterCreate";

import letterApi from "../apis/letter";

const App = () => {
  const [letters, setLetters] = useState([]);
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const getJWTToken = () => {
      console.log("Retrieving JWT Token from local storage");
      const token = window.localStorage.getItem("jwt");
      // Decode token
      console.log(token);
      if (token) {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace("-", "+").replace("_", "/");
        var { user } = JSON.parse(window.atob(base64));
      }
      setCurrUser(user);
    };
    getJWTToken();

    const fetchData = async () => {
      const auth = {
        Authorization: `Bearer ${window.localStorage.getItem("jwt")}`,
      };
      const res = await letterApi.get("/letters", { headers: { auth } });
      setLetters(res.data);
    };
    fetchData();
  }, []);

  const Dash = (props) => (
    <Dashboard
      letters={letters}
      currUser={currUser}
      setCurrUser={setCurrUser}
      {...props}
    />
  );
  const Detail = (props) => <LetterDetail letters={letters} {...props} />;

  return (
    <div className='ui container'>
      <BrowserRouter>
        <div>
          <Header currUser={currUser} setCurrUser={setCurrUser} />
          <Route path='/' exact component={Dash} />
          <Route path='/auth/register' exact component={Register} />
          <Route path='/:_id' exact component={Detail} />
          <Route path='/drafts/new' exact component={LetterCreate} />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
