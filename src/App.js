import React from "react";
import "./App.css";
import { Navbar, Tab, Tabs, Card, Button, Nav, Form } from "react-bootstrap";
import { name } from "faker";
import {
  addUser,
  addPost,
  fetchStatus,
  fetchHome,
  followUser,
  unfollowUser,
  fetchFollowers,
  fetchFollowing,
} from "./common/actions";
import { showToastr } from "./common/utils";
class App extends React.Component {
  componentDidMount() {
    addUser({ name: name.firstName() }).then((u) => {
      this.setState(
        {
          currentUser: u,
        },
        () => {
          this.updatePages(this.state.currentUser.userId);
        }
      );
    });
  }

  updatePages(userId) {
    fetchStatus(userId).then((posts) => {
      fetchHome(userId).then((home) => {
        fetchFollowers(userId).then((following) => {
          fetchFollowing(userId).then((followers) => {
            this.setState({
              posts: posts,
              feed: home,
              followers: followers,
              following: following,
            });
          });
        });
      });
    });
  }

  state = {
    currentUser: {},
    feed: [],
    posts: [],
    following: [],
    followers: [],
  };
  newPost(post) {
    return (
      <Card className="my-2 mx-auto" style={{ width: "18rem" }}>
        <Card.Header>Meme Author - @{post.login}</Card.Header>
        <Card.Img variant="top" src="https://picsum.photos/200" />
        <Card.Body>
          <Card.Text>
            {post.message}
            <br />
            Posted On: {post.posted}
          </Card.Text>
          <Button variant="success">
            <span className="fa fa-thumbs-up"></span>
            <br />
            {post.upVote}
          </Button>{" "}
          <Button variant="danger">
            <span className="fa fa-thumbs-down"></span>
            <br />
            {post.dVote}
          </Button>
        </Card.Body>
      </Card>
    );
  }

  userCard(user,type) {
    return (
      <Card className="my-2 mx-auto" style={{ width: "18rem" }}>
        <Card.Body>
          <div class="row">
            <div class="col-lg-12">
              <span class="one">{user.name}</span>
              {/* <button onClick={()=>{
                this.sendUnfollow(user.id,type);
              }} class="btn btn-danger btn-sm float-right">{type}</button> */}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    addPost({
      userId: this.state.currentUser.userId,
      message: event.target.elements.description.value,
    }).then((p) => {
      showToastr("success", p["message"]);
      this.updatePages(this.state.currentUser.userId);
    });
  }

  sendRequest(event) {
    event.preventDefault();
    followUser({
      uId: this.state.currentUser.userId,
      uId2: parseInt(event.target.elements.user.value),
    }).then((p) => {
      showToastr("success", p["message"]);
      this.updatePages(this.state.currentUser.userId);
    });
  }

  sendUnfollow(user_id,type) {
    let payload = {
      uId: this.state.currentUser.userId,
      uId2: user_id,
    };
    if(type === "Unfollow"){
      let temp = payload.uId;
      payload.uId = payload.uId2;
      payload.uId2 = temp;
    }
    unfollowUser(payload).then((p) => {
      showToastr("success", p["message"]);
      this.updatePages(this.state.currentUser.userId);
    });
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">
            Welcome to MemeWorld, {this.state.currentUser.name}:
            {this.state.currentUser.logindId} : {this.state.currentUser.userId}
          </Navbar.Brand>
          <Nav className="mr-auto"></Nav>
          <Button
            onClick={() => this.updatePages(this.state.currentUser.userId)}
            variant="outline-success"
          >
            Refresh
          </Button>
        </Navbar>
        <div className="row pt-2 container">
          <div className="col-sm-9">
            <Tabs defaultActiveKey="feed">
              <Tab eventKey="feed" title="News Feed">
                <div className="row mt-1">
                  <div className="col-sm-12">
                    <Form
                      className="form-inline"
                      onSubmit={(e) => this.handleSubmit(e)}
                    >
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Meme Description"
                          name="description"
                          required
                        />
                      </Form.Group>
                      &nbsp;&nbsp;
                      <Button variant="warning" type="submit">
                        Post Meme
                      </Button>
                    </Form>
                  </div>
                </div>
                {this.state.feed.map((item) => {
                  return this.newPost(item);
                })}
              </Tab>
              <Tab eventKey="posts" title="My Posts">
                {this.state.posts.map((item) => {
                  return this.newPost(item);
                })}
              </Tab>
              <Tab eventKey="following" title="Following">
                {this.state.followers.map((item) => {
                  return this.userCard(item,'Unfollow');
                })}
              </Tab>
              <Tab eventKey="followers" title="Followers">
                {this.state.following.map((item) => {
                  return this.userCard(item, 'Remove');
                })}
              </Tab>
            </Tabs>
          </div>
          <div className="col-sm-3">
            <Form className="form" onSubmit={(e) => this.sendRequest(e)}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter user id"
                  name="user"
                  required
                />
              </Form.Group>
              &nbsp;&nbsp;
              <Button variant="secondary" type="submit">
                Sent Follow Request
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
