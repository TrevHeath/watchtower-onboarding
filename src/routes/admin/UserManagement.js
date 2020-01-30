import React from "react";
import Layout from "../../components/Layout";

import { Button, Label, Input, Box, Heading, Text, Select } from "theme-ui";
import { useForm } from "react-hook-form";

import gql from "graphql-tag";

import { useMutation, useQuery } from "@apollo/react-hooks";
import { useToasts } from "../../components/Toasts";

const GET_AGENCIES = gql`
  query GetAgencies($where: AgencyWhereInput) {
    agencies(where: $where) {
      id
      name
    }
  }
`;

const INVITE_USER = gql`
  mutation InviteUser(
    $email: String!
    $agencyId: ID!
    $role: Role!
    $name: String!
  ) {
    sendInviteEmail(
      email: $email
      agencyId: $agencyId
      role: $role
      name: $name
    ) {
      success
    }
  }
`;

export default function UserManagement() {
  const [invite, { data, loading, error }] = useMutation(INVITE_USER);
  const { data: agencies, loading: loadingAgencies } = useQuery(GET_AGENCIES);
  const { register, handleSubmit, errors } = useForm();
  const { add } = useToasts();

  const onInvite = async values => {
    try {
      const res = await invite({
        variables: {
          email: values.email,
          role: values.role || "USER",
          name: values.name,
          agencyId: values.agencyId
        }
      });
      if (res.data.success || error) {
        add({ content: "User Invited!" });
      }
    } catch (e) {
      add({ content: e.message, variant: "error" });
    }
  };

  return (
    <Layout withNav={true} bannerChildren="User Management">
      <Box
        sx={{ maxWidth: "1200px", margin: "auto" }}
        py={45}
        as="form"
        onSubmit={handleSubmit(onInvite)}
      >
        <Heading as="h1">Invite Users</Heading>
        <Text>Invite users to agencies.</Text>

        <Box>
          <Box py={25}>
            <Label>Agencies</Label>

            <Select type="select" name="agencyId" ref={register}>
              {loadingAgencies ? (
                <option>loading...</option>
              ) : agencies ? (
                agencies.agencies.map(a => (
                  <option value={a.id}>{a.name}</option>
                ))
              ) : (
                <option>No agencies</option>
              )}
            </Select>
          </Box>
          <Box py={25}>
            <Label>Email Address</Label>
            <Input
              type="select"
              name="email"
              ref={register({ required: true })}
            />
          </Box>
          <Box py={25}>
            <Label>Name</Label>
            <Input name="name" ref={register({ required: true })} />
          </Box>
          <Box py={25}>
            <Label>Role</Label>

            <Select type="select" name="role" ref={register}>
              <option value={"ADMIN"}>Admin</option>
              <option value={"USER"}>User</option>
            </Select>
          </Box>

          <Box py={25}>
            <Button block type="submit">
              {loading ? "Inviting in..." : "Invite"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
