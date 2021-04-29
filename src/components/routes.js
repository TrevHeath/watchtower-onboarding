import { isLoggedIn, isAdmin } from "../services/auth";

import React, { useEffect } from "react";

import { navigate } from "@reach/router";

import { Box } from "@theme-ui/components";

const ProtectedRoute = (props) => {
  const {
    component: Component,
    location,

    ...rest
  } = props;
  useEffect(() => {
    if (!isLoggedIn() && location.pathName !== `/agency/login`) {
      // If the user is not logged in, redirect to the login page.
      navigate(`/admin/login`);
    }
  }, [location]);

  if (isLoggedIn() && !isAdmin()) {
    return <Box {...rest}>You are not supposed to be here</Box>;
  }
  return isLoggedIn() ? <Component {...rest} /> : null;
};

const PublicRoute = ({ component: Component, ...rest }) => (
  <Component {...rest} />
);

export { ProtectedRoute, PublicRoute };
