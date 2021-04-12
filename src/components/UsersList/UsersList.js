import React, { Component } from "react";
import { Media, Button, Table } from "reactstrap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import InfiniteScroll from "react-infinite-scroll-component";
import "./UsersList.css";
import * as actions from "../../actions";

class UsersList extends Component {
  componentDidMount = async () => {
    if (this.props.data.length === 0) {
      try {
        let response = await fetch("https://reqres.in/api/users?page=1");
        let result = await response.json();
        if (result.error) {
          alert(result.error);
        } else {
          this.props.fetchData(result.data);
        }
      } catch (err) {
        alert(err);
      }
    } else {
      this.props.addUserSuccess();
    }
  };

  fetchMoreData = async () => {
    if (this.props.data.length >= 12) {
      this.props.hasNoMoreData();
      return;
    }
    try {
      let response = await fetch("https://reqres.in/api/users?page=2");
      let result = await response.json();

      setTimeout(() => {
        this.props.updateUserList(this.props.data.concat(result.data));
      }, 1000);
    } catch (err) {
      alert(err);
    }
  };

  async onDeleteUser(id) {
    try {
      let response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "DELETE"
      });
      let result = await response;
      if (result.status === 204) {
        let filteredData = Object.assign([], this.props.data);
        filteredData.splice(
          filteredData.findIndex(item => item.id === id),
          1
        );
        this.props.updateUserList(filteredData);
      }
    } catch (err) {
      alert(err);
    }
  }

  async onEditUser(id) {
    try {
      let name = "Harold";
      let email = "hidethepain@gmail.com";
      let avatar =
        "https://yt3.ggpht.com/a/AATXAJwQnoYBaHCCtNgm2GUhFEVcBXJaKy2atIddqA=s900-c-k-c0xffffffff-no-rj-mo";
      let response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          avatar
        })
      });
      let result = await response.json();
      if (result.name === name && result.email === email) {
        let filteredData = Object.assign([], this.props.data);
        let user = filteredData.find(item => item.id === id);
        user.first_name = "Harold";
        user.email = "hidethepain@gmail.com";
        user.avatar =
          "https://yt3.ggpht.com/a/AATXAJwQnoYBaHCCtNgm2GUhFEVcBXJaKy2atIddqA=s900-c-k-c0xffffffff-no-rj-mo";

        this.props.updateUserList(filteredData);
      }
    } catch (err) {
      alert(err);
    }
  }

  render() {
    const { data, hasMore, isLogged } = this.props;
    if (!isLogged) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <InfiniteScroll
          dataLength={data.length}
          next={this.fetchMoreData}
          hasMore={hasMore}
          height={600}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>------!!!!-----</b>
            </p>
          }
        >
          {/* {data.map(item => {
            return ( */}
          {/* <div key={item.id}> */}
          <div>
            <Table bordered>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Avatar</th>
                  <th>Action(EDIT/DELETE)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={user._id}>
                    {/* <th scope="row">{index + 1}</th> */}

                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>
                      <img src={user.avatar} className="userslist-img" alt="" />
                    </td>
                    <td>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => this.onEditUser(user.id)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => this.onDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

const mapStateToProps = ({ data, isLogged, hasMore }) => {
  return {
    data,
    isLogged,
    hasMore
  };
};

export default connect(mapStateToProps, actions)(UsersList);
