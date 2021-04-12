import React, { useState, useEffect } from "react";

import {
  Alert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table
} from "reactstrap";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { addUserRequest } from "../../actions";

function AddUser({ data, isLogged, userAdded, addUserRequest }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  const changeEmailHandler = e => {
    setEmail(e.target.value);
  };

  const changeNameHandler = e => {
    setName(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(false);
    let body = JSON.stringify({
      email,
      first_name: name,
      avatar:
        "https://yt3.ggpht.com/a/AGF-l7_ymSxOKPUYZG4H3FPiz6iWO6eVfqEs1jS5qw=s900-c-k-c0xffffffff-no-rj-mo"
    });

    try {
      let response = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body
      });

      let result = await response.json();

      if (result.error) {
        setError(result.error);
      }
      if (result.id) {
        let filteredData = Object.assign([], data);
        filteredData.push(result);
        addUserRequest(filteredData);
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (!isLogged) {
      return <Redirect to="/" />;
    }
  });
  if (userAdded) {
    return <Redirect to="/usersList" />;
  }

  return (
    <div style={{ width: "300px", margin: "20px" }}>
      <Form id="formElem" onSubmit={handleSubmit}>
        <Label>Enter Details</Label>
        <FormGroup>
          <Label for="exampleName">Name</Label>
          <Input
            type="name"
            name="name"
            onChange={changeNameHandler}
            id="exampleName"
            placeholder="enter name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input
            type="email"
            name="email"
            onChange={changeEmailHandler}
            id="exampleEmail"
            placeholder="Email"
          />
        </FormGroup>
        <Button type="submit">Add User</Button>
      </Form>
      {error ? (
        <Alert color="danger">
          error occured... {<br />}Reason: {error}
        </Alert>
      ) : (
        ""
      )}
    </div>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    addUserRequest: data => dispatch(addUserRequest(data))
  };
};

const mapStateToProps = ({ data, isLogged, userAdded }) => {
  return {
    data,
    isLogged,
    userAdded
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
