import React from "react";
import { Box } from "theme-ui";
import Banner from "./Banner";
import Nav from "./Nav";

export default function Layout({ withNav, bannerChildren, children }) {
  return (
    <Box>
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
