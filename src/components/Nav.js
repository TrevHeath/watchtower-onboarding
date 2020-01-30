import React from "react";
import { Flex, NavLink, Box } from "theme-ui";
import { Link, navigate } from "@reach/router";
import { logout } from "../services/auth";

const isActive = ({ isCurrent }) => {
  return isCurrent
    ? { style: { color: "inherit", textDecoration: "underline" } }
    : null;
};

export default () => {
  return (
    <Flex
      as="nav"
      p={25}
      sx={{
        bg: "black",
        color: "white",
        fontWeight: "bold",
        justifyContent: "space-between"
      }}
    >
      <Flex sx={{ flex: 1 }}>
        <Box color="white" p={2}>
          <Link
            getProps={isActive}
            style={{ color: "inherit", textDecoration: "none" }}
            to="/admin"
          >
            Create Agency
          </Link>
        </Box>
        <Box color="white" p={2}>
          <Link
            getProps={isActive}
            style={{ color: "inherit", textDecoration: "none" }}
            to="/admin/users"
          >
            Users
          </Link>
        </Box>
      </Flex>
      <Box p={2}>
        <NavLink
          href="/agency/stats"
          onClick={event => {
            event.preventDefault();
            logout(() => navigate(`/admin/login`));
          }}
        >
          Logout
        </NavLink>
      </Box>
    </Flex>
  );
};
