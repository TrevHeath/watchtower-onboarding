import React, { Fragment } from "react";
import cookie from "react-cookies";
import client from "../services/Apollo";

import jwt from "jsonwebtoken";
import gql from "graphql-tag";

// helpful for debugging netlify identity
const logAuth = process.env.NODE_ENV === "development" && false; // set to true to turn on logging
const clog = (...args) => logAuth && console.log(...args);
// helpful for debugging netlify identity

export const isBrowser = () => typeof window !== "undefined";

const GET_CURRENT_USER = gql`
  query CurrentUser {
    me {
      id
      email
      name
      role
    }
  }
`;

export const getUser = () => {
  return client
    ? client
        .query({ query: GET_CURRENT_USER })
        .then((d) => d.me)
        .catch(() => {})
    : null;
};

export const getUserRole = () => {
  if (!isLoggedIn()) return null;
  const token = getToken();
  return jwt.decode(token).role;
};

export const setToken = (token) =>
  cookie.save("token", token, { path: "/", secure: true });
export const deleteToken = () => cookie.remove("token", { path: "/" });

export const getToken = () => cookie.load("token");
// export const handleLogin = callback => {
//   clog('isLoggedIn check', isLoggedIn())
//   if (isLoggedIn()) {
//     clog('logged in')
//     callback(getUser())
//   } else {
//     clog('logging in...')
//     netlifyIdentity.open()
//     netlifyIdentity.on('login', user => {
//       clog('logged in!', { user })
//       setUser(user)
//       callback(user)
//     })
//   }
// }

export const isLoggedIn = () => {
  if (!isBrowser()) return false;
  // const user = getUser()
  const user = getToken();

  return !!user;
};

export const isAdmin = () => {
  if (!isBrowser()) return false;
  const role = getUserRole();
  if (!role) return false;
  clog("isAdmin check", { role });
  return role === "SUPER_ADMIN";
};

export const logout = (callback) => {
  deleteToken();
  callback();
};

export const AdminOnly = ({ children }) => {
  const isAdminRole = isAdmin();
  if (!isAdminRole) {
    return <Fragment />;
  }
  return children;
};
