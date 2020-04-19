import { BASE_URL } from "./constants";
import { getRequest, postRequest } from "../api";

export const createUser = `${BASE_URL}/user`;
export const createPost = `${BASE_URL}/post`;
export const getStatus = `${BASE_URL}/status`;
export const getHome = `${BASE_URL}/home`;
export const follow = `${BASE_URL}/follow`;
export const unfollow = `${BASE_URL}/unfollow`;
export const getFollowers = `${BASE_URL}/followers`;
export const getFollowing = `${BASE_URL}/following`;

export const addUser = (payload) => {
  const url = createUser;
  return postRequest(url, payload);
};

export const addPost = (payload) => {
  const url = createPost;
  return postRequest(url, payload);
};

export const followUser = (payload) => {
  const url = follow;
  return postRequest(url, payload);
};

export const unfollowUser = (payload) => {
  const url = unfollow;
  return postRequest(url, payload);
};

export const fetchStatus = (userId) => {
  const url = getStatus+"?id="+userId;
  return getRequest(url);
};

export const fetchHome = (userId) => {
  const url = getHome+"?id="+userId;
  return getRequest(url);
};


export const fetchFollowers = (userId) => {
  const url = getFollowers+"?id="+userId;
  return getRequest(url);
};

export const fetchFollowing = (userId) => {
  const url = getFollowing+"?id="+userId;
  return getRequest(url);
};