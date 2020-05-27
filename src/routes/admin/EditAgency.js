import React, { useState, Fragment, useEffect } from "react";
import Layout from "../../components/Layout";

import { Button, Label, Input, Box, Heading, Select, Spinner } from "theme-ui";
import { useForm } from "react-hook-form";
import { useTable } from "react-table";
import styled from "@emotion/styled";
import gql from "graphql-tag";

import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { useToasts } from "../../components/Toasts";

const GET_AGENCY_DETAILS = gql`
  query GetAgencyDetails($id: String!) {
    agencies(where: { id: { equals: $id } }) {
      id
      name
      users {
        id
        name
        email
        role
        isSignedUp
      }
      settings {
        id
        surflineSpotId
        dispatching
        incidentReporting
        epcr
      }
    }
  }
`;

const GET_AGENCIES = gql`
  query GetAgencies($where: AgencyWhereInput) {
    agencies(where: $where) {
      id
      name
    }
  }
`;

const UPDATE_AGENCY = gql`
  mutation UpdateAgency(
    $where: AgencyWhereUniqueInput!
    $data: AgencyUpdateInput!
  ) {
    updateOneAgency(where: $where, data: $data) {
      id
    }
  }
`;

const RE_SEND_INVITE = gql`
  mutation ResendInvite($email: String!) {
    resendInviteEmail(email: $email) {
      success
    }
  }
`;

export default function UserManagement() {
  const [selectedAgencyId, selectAgency] = useState(null);
  const [updateOneAgency, { loading }] = useMutation(UPDATE_AGENCY);
  const [resendInvite, { loading: resendingInvite }] = useMutation(
    RE_SEND_INVITE
  );
  const { data: agencies, loading: loadingAgencies } = useQuery(GET_AGENCIES);
  const [loadAgency, { loading: loadingAgency, data }] = useLazyQuery(
    GET_AGENCY_DETAILS
  );

  const { register, handleSubmit, errors } = useForm();

  const defaultFormValues = {
    ...(data && data.agencies[0]),
    ...(data && data.agencies[0].settings),
  };
  const { add } = useToasts();

  useEffect(() => {
    if (selectedAgencyId) {
      loadAgency({
        variables: {
          id: selectedAgencyId,
        },
      });
    }
  }, [selectedAgencyId]);

  const onUpdate = async (values) => {
    try {
      if (!selectedAgencyId) {
        add({ content: "Please select an agency to update", variant: "error" });
        return;
      }
      let settings = {};
      if (values.surflineSpotId) {
        settings = {
          settings: {
            update: {
              surflineSpotId: values.surflineSpotId,
            },
          },
        };
      }

      console.log({ ...settings });
      const res = await updateOneAgency({
        variables: {
          where: {
            id: selectedAgencyId,
          },
          data: {
            ...settings,
          },
        },
      });

      if (res.data && res.data.updateOneAgency && res.data.updateOneAgency.id) {
        add({ content: "Agency Updated", variant: "success" });
      }
    } catch (e) {
      add({ content: e.message, variant: "error" });
    }
  };

  const onResendInvite = async (args) => {
    try {
      if (!selectedAgencyId) {
        add({ content: "Please select an agency to update", variant: "error" });
        return;
      }

      const res = await resendInvite(args);

      if (
        res.data &&
        res.data.resendInviteEmail &&
        res.data.resendInviteEmail.success
      ) {
        add({ content: "Sent!", variant: "success" });
      }
    } catch (e) {
      add({ content: e.message, variant: "error" });
    }
  };

  return (
    <Layout
      withNav={true}
      bannerChildren="User Management"
      loading={resendingInvite}
    >
      <Box sx={{ maxWidth: "1200px", margin: "auto" }} py={45}>
        <Heading as="h1">Update Agency</Heading>
        <Box py={25}>
          <Select
            onChange={(e) => selectAgency(e.target.value)}
            type="select"
            name="agencyId"
          >
            {loadingAgencies ? (
              <option>loading...</option>
            ) : agencies ? (
              [
                <option value="">Select an agency</option>,
                ...agencies.agencies.map((a) => (
                  <option value={a.id}>{a.name}</option>
                )),
              ]
            ) : (
              <option>No agencies</option>
            )}
          </Select>
        </Box>

        <Box>
          {loadingAgency ? (
            <Spinner />
          ) : (
            <Box as="form" onSubmit={handleSubmit(onUpdate)}>
              <Box py={25}>
                <Label>Name</Label>
                <Input
                  type="select"
                  name="name"
                  defaultValue={defaultFormValues.name}
                  ref={register({
                    required: false,
                    minLength: {
                      value: 3,
                      message: "Make sure the name is long enough.",
                    },
                  })}
                />
                <FormError error={errors.name} />
              </Box>
              <Box py={25}>
                <Label>Surfline Id</Label>
                <Input
                  type="select"
                  name="surflineSpotId"
                  defaultValue={defaultFormValues.surflineSpotId}
                  ref={register({
                    required: false,
                    minLength: {
                      value: 15,
                      message:
                        "Spot ids should looks something like this: 5842041f4e65fad6a77089fa",
                    },
                  })}
                />
                <FormError error={errors.surflineSpotId} />
              </Box>
              <Box py={25}>
                <Button block type="submit">
                  {loading ? "Updating..." : "Update"}
                </Button>
              </Box>
            </Box>
          )}
          {data && data.agencies[0].users ? (
            <Box py={25}>
              <h2>Users </h2>
              <UserTable
                data={data.agencies[0].users}
                resendInvite={onResendInvite}
              />
              <FormError error={errors.users} />
            </Box>
          ) : (
            <Fragment />
          )}
        </Box>
      </Box>
    </Layout>
  );
}

const FormError = ({ error }) => {
  if (!error) return <Fragment />;
  return <Box color="red">{error.message}</Box>;
};

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.value}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const UserTable = ({ data, resendInvite }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },

      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Registered",
        accessor: (value) => {
          return value.isSignedUp === true ? "Yes" : "No";
        },
      },
      {
        Header: "Resend Invite ",
        accessor: (value) => {
          if (value.isSignedUp === false && value.email) {
            return (
              <Button
                onClick={() =>
                  resendInvite({
                    variables: {
                      email: value.email,
                    },
                  })
                }
                sx={{ variant: "link" }}
              >
                Resend Invite
              </Button>
            );
          }
          return <Fragment />;
        },
      },
    ],
    []
  );

  const tableData = React.useMemo(() => data, []);
  return (
    <Styled>
      <Table columns={columns} data={tableData} />
    </Styled>
  );
};

const Styled = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    border: 1px solid black;
    border-radius: 4px;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th {
      background-color: ${(props) => {
        return props.theme.colors["grayDark"];
      }};
      text-align: left;
      padding: 1rem;
      color: white;
    }
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`;
