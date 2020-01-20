import React, { useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import { Box, Button } from "rebass";
import { Input, Label } from "@rebass/forms";
import "./checkbox-styles.css";

const slackUrl = process.env.REACT_APP_SLACK_URL;

function getNodeIds(nodes) {
  let ids = [];

  nodes &&
    nodes.forEach(({ value, children }) => {
      ids = [...ids, value, ...getNodeIds(children)];
    });

  return ids;
}

export const Widget = ({ options }) => {
  const [nodes, setNodes] = useState(options);
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState();
  const [checked, setChecked] = useState();
  const [expanded, setExpanded] = useState();

  React.useEffect(() => {
    setNodes(options);
    setChecked(getNodeIds(options));
    setExpanded(getNodeIds(options));
  }, [options]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!inputs.agency) {
      return setErrors({ agency: "Please input an agency name" });
    }
    setErrors({});

    const cleanChecked = checked.map(i => i.split(" -")[0]);

    fetch(slackUrl, {
      method: "POST",
      headers: {
        Accept: "application/json"
      },
      body: JSON.stringify({
        text: ` ${inputs.agency} has submitted their stat form:, \`\`\` ${cleanChecked}\`\`\` `
      })
    })
      .then(r => {
        console.log(r);
        if (r.ok === true) {
          alert("Stat categories sent successfully");
        }
      })
      .catch(e => {
        setErrors({ form: `Error submitting: ${e}` });
      });
  };

  return (
    <Box as="form" onSubmit={e => handleSubmit(e)}>
      <Box py={3}>
        <Label htmlFor="agency">My Agency Name</Label>
        <Input
          id="agency"
          name="agency"
          onChange={e => {
            setInputs({ [e.target.name]: e.target.value });
          }}
        />
        {errors && errors.agency && <Box color="red">{errors.agency}</Box>}
      </Box>
      <Box py={3}>
        <CheckboxTree
          nodes={nodes}
          checked={checked}
          expanded={expanded}
          optimisticToggle={false}
          noCascade={true}
          onCheck={checked => {
            return setChecked(checked);
          }}
          onExpand={expanded => setExpanded(expanded)}
          icons={{
            check: <span className="rct-icon rct-icon-check" />,
            uncheck: <span className="rct-icon rct-icon-uncheck" />,
            halfCheck: <span className="rct-icon rct-icon-half-check" />,
            expandClose: <span className="rct-icon rct-icon-expand-close" />,
            expandOpen: <span className="rct-icon rct-icon-expand-open" />,
            expandAll: <span className="rct-icon rct-icon-expand-all" />,
            collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
            parentClose: null,
            parentOpen: null,
            leaf: null
          }}
        />
      </Box>
      <Button>Submit categories</Button>
      {errors && errors.form && <Box color="red">{errors.form}</Box>}
    </Box>
  );
};
