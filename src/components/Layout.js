import React from "react";
import { Box, Spinner } from "theme-ui";
import Banner from "./Banner";
import Nav from "./Nav";

export default function Layout({ withNav, bannerChildren, children, loading }) {
  return (
    <Box sx={{ position: "relative" }}>
      {loading && (
        <Box sx={{ position: "fixed", top: 0, right: 0 }}>
          <Spinner />
        </Box>
      )}
      <Banner>{bannerChildren}</Banner>
      {withNav && (
        <Box sx={{ width: "100%" }}>
          <Nav />
        </Box>
      )}
      <Box p={45} sx={{ position: "relative" }}>
        {children}
      </Box>
    </Box>
  );
}
