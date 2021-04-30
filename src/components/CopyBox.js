import { Box } from "@theme-ui/components";
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

function CopyBox({ value }) {
  const [copied, onCopy] = useState();
  return (
    <CopyToClipboard
      style={{ cursor: "pointer" }}
      text={value}
      onCopy={() => onCopy(value)}
    >
      <Box
        sx={{
          bg: "gray.3",
          borderRadius: "8px",
          p: 8,
          border: "2px dashed blue",
        }}
      >
        {" "}
        {value}
        {copied === value && "  🚀"}
      </Box>
    </CopyToClipboard>
  );
}

export default CopyBox;
