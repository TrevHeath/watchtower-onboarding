import React, { useState } from "react";
import { Input, Label, Text, Box, Button, Heading, Checkbox } from "theme-ui";

import Layout from "../../components/Layout";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useModal } from "react-modal-hook";
import ReactModal from "react-modal";
import { useToasts } from "../../components/Toasts";
import { toTitleCase } from "../../utils";

const ONBOARD_AGENCY = gql`
  mutation OnboardAgency($data: OnboardAgencyInput!) {
    onboardAgency(data: $data) {
      id
    }
  }
`;

const CardFooter = ({ children }) => {
  return (
    <Box
      p={25}
      sx={{
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        height: "auto",
        textAlign: "right"
      }}
    >
      {children}
    </Box>
  );
};

const Admin = () => {
  const [onboard, { loading }] = useMutation(ONBOARD_AGENCY);
  const [values, setValues] = useState({});
  const [gqlArgs, setGQLArgs] = useState();
  const { add } = useToasts();
  const [showModal, hideModal] = useModal(
    () => (
      <ReactModal isOpen>
        <Heading as="h1">
          Are you sure you would like to create this agency:
        </Heading>

        {Object.keys(values).length ? (
          <>
            {" "}
            <Box p={45}>
              <Box bg="primary" m={3} p={3} sx={{ color: "white" }}>
                <strong>
                  Please review this for accuracy. It is difficule to undo a new
                  agency.
                </strong>
              </Box>
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
              <Box py={20}>
                <strong>
                  {" "}
                  In case you need Trevor to create, share this snippet:
                </strong>
              </Box>
              {!gqlArgs ? (
                <Button onClick={() => generateSnippet}>
                  Generate Snippet
                </Button>
              ) : (
                <code>
                  {JSON.stringify(gqlArgs).replace(/\"([^(\")"]+)\":/g, "$1:")}
                </code>
              )}
            </Box>
            <CardFooter>
              <Button
                sx={{ marginRight: 5 }}
                onClick={async () => {
                  try {
                    const res = await onboard({
                      variables: {
                        ...gqlArgs
                      }
                    });

                    if (
                      res.data &&
                      res.data.onboardAgency &&
                      res.data.onboardAgency.id
                    ) {
                      add({ content: "Agency created!", variant: "success" });
                      hideModal();
                    }
                  } catch (e) {
                    add({ content: e.message, variant: "error" });
                  }
                }}
              >
                {loading ? "Creating..." : "Create Agency"}
              </Button>
              <Button onClick={() => hideModal()} variant="secondary">
                Not yet
              </Button>
            </CardFooter>
          </>
        ) : (
          <Box p={45}>
            No values...
            <CardFooter>
              <Button onClick={() => hideModal()}>Go Back</Button>
            </CardFooter>
          </Box>
        )}
      </ReactModal>
    ),
    [values, gqlArgs, loading, add]
  );

  function handleCheckBoxChange(e) {
    setValues({ ...values, [e.target.name]: !values[e.target.name] });
  }

  function handleChange(e, field) {
    let cleanValue;
    if (e.target.name === "stats") {
      cleanValue = e.target.value.split(",").map(i => toTitleCase(i.trim()));
    }
    if (e.target.name === "positions") {
      const removeFront = e.target.value.split(",");

      cleanValue = removeFront
        ? removeFront.map(i => ({
            name: i && toTitleCase(i.trim()),
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
            name: i && toTitleCase(i.trim())
          }))
        : "";
    }

    setValues({
      ...values,
      [e.target.name]: cleanValue || toTitleCase(e.target.value)
    });
  }

  function generateSnippet() {
    setGQLArgs(formatGqlArgs(values));
  }

  function handleSubmit() {
    generateSnippet();
    showModal();
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
          <Box bg="primary" m={3} p={3} sx={{ color: "white" }}>
            <strong>
              You can find this at the end of a surfline spot url. IT SHOULD
              START WITH A 5 and be around 20+ characters. Example:
            </strong>
            <br />
            https://www.surfline.com/surf-report/newport-beach-/5842041f4e65fad6a770882c
          </Box>
          <Input
            id="surflineSpotId"
            name="surflineSpotId"
            onChange={handleChange}
          />
        </Box>
        <Box py={25}>
          {" "}
          <Label>Stats</Label>
          <Box bg="primary" m={3} p={3} sx={{ color: "white" }}>
            <strong>
              {" "}
              Should follow this notation with each type being separated by a
              comma:
            </strong>{" "}
            <br />
            Rescue, Rescue / Surf / Swimmer, Boat, Boat / Tow
          </Box>
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
          <Box bg="primary" m={3} p={3} sx={{ color: "white" }}>
            <strong>
              {" "}
              Should follow this notation with each type being separated by a
              comma or a colon (:). IF THE NAMES HAVE A COMMA, MAKE SURE YOU USE
              : TO SEPARATE. SEE EXAMPLE BELOW:
            </strong>{" "}
            <br />
            Trevor Heath, David Rodriguez <br />
            <strong>or</strong>
            <br /> Heath, Trevor: Rodriguez, David
            <br />
            You can use this{" "}
            <a href="https://convert.town/column-to-comma-separated-list">
              website
            </a>{" "}
            to convert a column to the correct format. The delimiter option
            allows you to choose a comma or colon.
          </Box>
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
          <Box bg="primary" m={3} p={3} sx={{ color: "white" }}>
            <strong>
              Should follow this notation with each type being separated by a
              comma:
            </strong>{" "}
            <br />
            Tower 10, 5210, 5220
          </Box>
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
              <Box bg="primary" m={3} p={3} sx={{ color: "white" }}>
                <strong>
                  Check the positions that are defaulted as dispatchable, this
                  can be editted by the user later on.
                </strong>
              </Box>
              {values.positions.map((p, k) => {
                return (
                  <Box>
                    <Label mb={3}>
                      <Checkbox
                        defaultChecked={false}
                        name={p.name}
                        onClick={handleCheckBoxChange}
                      />
                      {p.name}
                    </Label>
                  </Box>
                );
              })}
            </div>
          )}
        </Box>

        <Box py={45} sx={{ width: "100%" }}>
          <Button sx={{ width: "100%" }} onClick={handleSubmit}>
            Create agency data
          </Button>
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
