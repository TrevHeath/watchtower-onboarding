import React, { useState } from "react";
import { Input, Label, Text, Box, Button, Heading } from "theme-ui";

import Layout from "../../components/Layout";

const Admin = () => {
  const [values, setValues] = useState({});
  const [gqlArgs, setGQLArgs] = useState({});

  function handleChange(e, field) {
    let cleanValue;
    if (e.target.name === "stats") {
      cleanValue = e.target.value.split(",").map(i => i.trim());
    }
    if (e.target.name === "positions") {
      const removeFront = e.target.value.split(",");

      cleanValue = removeFront
        ? removeFront.map(i => ({
            name: i && i.trim(),
            dispatchable: false
          }))
        : "";
    }

    if (e.target.name === "users") {
      let removeFront = e.target.value.split(":");

      if (!removeFront[1]) {
        removeFront = e.target.value.split(",");
      }

      cleanValue = removeFront
        ? removeFront.map(i => ({
            name: i && i.trim()
          }))
        : "";
    }

    setValues({ ...values, [e.target.name]: cleanValue || e.target.value });
  }
  function handleSubmit() {
    setGQLArgs(formatGqlArgs(values));
  }

  return (
    <Layout withNav={true} bannerChildren="Watchtower Admin">
      <Box
        sx={{ maxWidth: "1200px", margin: "auto" }}
        py={45}
        as="form"
        onSubmit={e => e.preventDefault()}
      >
        <Heading as="h1">Create an agency</Heading>
        <Text>Input information to create an agency</Text>
        <Box py={25}>
          {" "}
          <Label>Agency Name</Label>
          <Input id="agencyName" name="agencyName" onChange={handleChange} />
        </Box>
        <Box py={25}>
          {" "}
          <Label>Surfline Spot Id</Label>
          <Input
            id="surflineSpotId"
            name="surflineSpotId"
            onChange={handleChange}
          />
        </Box>
        <Box py={25}>
          {" "}
          <Label>Stats</Label>
          <Input
            as="textarea"
            name="stats"
            rows="15"
            style={{
              width: "100%"
            }}
            onChange={e => handleChange(e)}
          />
        </Box>
        <Box py={25}>
          {" "}
          <Label>Users</Label>
          <Input
            as="textarea"
            name="users"
            rows="15"
            style={{
              width: "100%"
            }}
            onChange={e => handleChange(e)}
          />
        </Box>
        <Box py={25}>
          {" "}
          <Label>Positions</Label>
          <Input
            as="textarea"
            name="positions"
            rows="15"
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {values.positions && (
            <div>
              <h4>Dispatchable?</h4>
              {values.positions.map(p => (
                <div>
                  <input
                    checked={values[p.name]}
                    name={p.name}
                    type="checkbox"
                    onChange={handleChange}
                  />
                  <label for={p.name}>{p.name}</label>
                </div>
              ))}
            </div>
          )}
        </Box>
        <div>
          <Heading py={35} as="h3">
            Preview:
          </Heading>
          {values.agencyName && (
            <div>
              <Heading as="h3">Agency:</Heading>
              {values.agencyName}
            </div>
          )}
          {values.surflineSpotId && (
            <div>
              <Heading as="h3">SurflineSpotId:</Heading>
              {values.surflineSpotId}
            </div>
          )}
          {values.stats && (
            <div>
              <Heading as="h3">Stats:</Heading>
              {JSON.stringify(values.stats)}
            </div>
          )}
        </div>

        {values.users && (
          <div>
            <Heading as="h3">Users:</Heading>
            {JSON.stringify(values.users)}
          </div>
        )}
        {values.positions && (
          <div>
            <Heading as="h3">Positions:</Heading>
            {JSON.stringify(values.positions)}
          </div>
        )}
        <Box py={45} sx={{ width: "100%" }}>
          <Button sx={{ width: "100%" }} onClick={handleSubmit}>
            Create agency data
          </Button>
        </Box>
        <Box p={45}>
          <Label>Result (send to Trevor):</Label>

          <code>
            {JSON.stringify(gqlArgs).replace(/\"([^(\")"]+)\":/g, "$1:")}
          </code>
        </Box>
        {/* {stats.split(",").map(i => (
        <div>{i}</div>
      ))} */}
      </Box>
    </Layout>
  );
};

const formatGqlArgs = data => {
  let args = {
    agencyName: data.agencyName,
    activities: data.stats,
    surflineSpotId: data.surflineSpotId
  };
  if (data.users) {
    args.users = {
      create: data.users.map(u => ({
        name: u.name
      }))
    };
  }

  if (data.positions) {
    args.positions = {
      create: data.positions.map(u => ({
        name: u.name,
        dispatchable: data[u.name] ? true : false
      }))
    };
  }

  return {
    data: {
      ...args
    }
  };
};

export default Admin;
