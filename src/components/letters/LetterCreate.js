import React, { useState } from "react";
import { Link } from "react-router-dom";

import LetterForm from "./LetterForm";

import { getEarlierRoute } from "../../utils";

import lettersApi from "../../apis/letter";
import { Modal, Icon, Header } from "semantic-ui-react";

const LetterCreate = ({ location, currUser, history }) => {
  const [isPristine, setIsPristine] = useState(true);
  const [vals, setVals] = useState(
    location.state && location.state.vals
      ? location.state.vals
      : { title: "", receiver: "", content: "" }
  );
  const [open, setOpen] = useState(false);

  const onSubmit = async (formValues) => {
    const auth = {
      Authorization: `Bearer ${window.localStorage.getItem("jwt")}`,
    };

    const formData = { ...formValues, sender: currUser.username };
    console.log(formData);
    const res = await lettersApi.post(
      "/letters",
      {
        ...formData,
      },
      { headers: { ...auth } }
    );

    if (res.status === 200) {
      history.push("/");
    } else {
      // Show error message - Oops something went wrong.
    }
  };

  const route =
    location.state && location.state.prevRoute
      ? location.state.prevRoute
      : getEarlierRoute(location);

  const to = {
    pathname: isPristine ? route : location.pathname,
    prevRoute: isPristine
      ? location.pathname
      : location.state
      ? location.state.prevRoute
      : undefined,
  };

  return (
    <div>
      <Modal open={open}>
        <Header icon>{`Save '${
          vals.title === "" ? "Untitled" : vals.title
        }' as Draft?`}</Header>
        <Modal.Content>
          <p>Save as Draft? Unsaved changes will be lost.</p>
        </Modal.Content>
        <Modal.Actions>
          <div
            className='red ui button'
            onClick={() => {
              setOpen(false);
              history.push(route);
            }}>
            <Icon name='remove' /> Discard
          </div>
          <div className='ui button' onClick={() => setOpen(false)}>
            Keep Editing
          </div>
          <div
            className='green ui button'
            onClick={() => {
              setOpen(false);
              onSubmit({ ...vals, isDraft: true });
            }}>
            <Icon name='checkmark' /> Save as Draft
          </div>
        </Modal.Actions>
      </Modal>
      <Link
        to={to}
        onClick={() => {
          if (!isPristine) setOpen(true);
        }}>
        <button className='ui button '>Back</button>
      </Link>
      <span className='ui header'>Compose Letter</span>
      <LetterForm
        onSubmit={onSubmit}
        vals={vals}
        setVals={setVals}
        setIsPristine={setIsPristine}
        history={history}
      />
    </div>
  );
};

export default LetterCreate;
