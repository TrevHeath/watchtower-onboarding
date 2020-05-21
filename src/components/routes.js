import React from "react";
import { Redirect } from "@reach/router";
import { isLoggedIn, isAdmin } from "../services/auth";

const ProtectedRoute = ({ component: Component, ...rest }) =>
  isLoggedIn() && isAdmin() ? (
    <Component {...rest} />
  ) : (
    <Redirect from="" to="/admin/login" noThrow />
  );

const PublicRoute = ({ component: Component, ...rest }) => (
  <Component {...rest} />
);

export { ProtectedRoute, PublicRoute };
