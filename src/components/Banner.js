import React from "react";
import { Box, Heading } from "theme-ui";

export default ({ children }) => {
  return (
    <Box
      sx={{
        px: 4,
        py: "10rem",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1444762908691-c8461d64d5f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 8,
        color: "white",
        bg: "gray",
        position: "relative"
      }}
    >
      <Heading
        sx={{
          position: "relative",
          zIndex: "2",
          textAlign: "center",
          fontSize: [5, 6]
        }}
        as="h4"
      >
        {children}
      </Heading>
      <Box
        sx={{
          position: "absolute",
          top: "0px",
          right: "0px",
          left: "0px",
          bottom: "0px",
          zIndex: "1",
          backgroundColor: "rgb(51, 51, 51)",
          opacity: "0.8"
        }}
      />
    </Box>
  );
};
