import React from "react";
import Select from "react-select";

// const customStyles = {
//   option: (provided, state) => ({}),
//   control: () => ({
//     // none of react-select's styles are passed to <Control />
//   }),
//   singleValue: (provided, state) => {}
// }

export default (props) => {
  return (
    <Select
      // styles={{ ...customStyles, ...props.styles }}
      theme={(t) => ({
        ...t,
        borderRadius: ".25rem",
        colors: {
          ...t.colors,
          neutral10: "rgba(0, 0, 0, 0.15)",
        },
      })}
      {...props}
    />
  );
};
