import React, { useState, Fragment, useEffect } from "react";
import Layout from "../../components/Layout";

import { Button, Label, Input, Box, Heading, Select, Spinner } from "theme-ui";
import { useForm } from "react-hook-form";
import { useTable } from "react-table";
import styled from "@emotion/styled";
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

const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($data: NotificationMessageCreateInput!) {
    createOneNotificationMessage(data: $data) {
      id
    }
  }
`;

export default function UserManagement() {
  const [selectedAgencyId, selectAgency] = useState(null);
  const [createNotification, { loading }] = useMutation(CREATE_NOTIFICATION);

  const { data: agencies, loading: loadingAgencies } = useQuery(GET_AGENCIES);

  const { register, handleSubmit, errors, formState, reset } = useForm({
    mode: "onChange",
  });

  const { dirty } = formState;

  const { add } = useToasts();

  const onCreate = async (values) => {
    try {
      let connections = {};
      if (!dirty) {
        add({ content: "No updates made.", variant: "error" });
        return;
      }

      if (selectedAgencyId) {
        connections.agencies = {
          connect: {
            id: selectedAgencyId,
          },
        };
      }
      console.log(values);
      const res = await createNotification({
        variables: {
          data: {
            global: selectedAgencyId ? false : true,
            ...values,
            ...connections,
          },
        },
      });

      if (
        res.data &&
        res.data.createOneNotificationMessage &&
        res.data.createOneNotificationMessage.id
      ) {
        add({ content: "Notified!", variant: "success" });
        reset();
      }
    } catch (e) {
      console.log(e.message);
      add({ content: e.message, variant: "error" });
    }
  };

  return (
    <Layout withNav={true} bannerChildren="Notifications" loading={loading}>
      <Box sx={{ maxWidth: "1200px", margin: "auto" }} py={45}>
        <Heading as="h1">Create Notification</Heading>
        <Box as="form" onSubmit={handleSubmit(onCreate)}>
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
                <option value>All agencies</option>
              )}
            </Select>
          </Box>

          <Box py={25}>
            <Label>Message</Label>
            <Input
              name="message"
              ref={register({
                required: true,
              })}
            />
            <FormError error={errors.message} />
          </Box>
          <Box py={25}>
            <Label>Url</Label>
            <Input
              name="url"
              ref={register({
                required: true,
              })}
            />
            <FormError error={errors.url} />
          </Box>
          <Box py={25}>
            <Button block type="submit">
              {loading ? "Updating..." : "Update"}
            </Button>
          </Box>
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
                variant="link"
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

const ActivitiesTable = ({ data, dirtyFields, registerForm }) => {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Label",
        accessor: "label",
      },
      {
        Header: "Label One",
        accessor: (value) => {
          const fieldName = `activities.${value.id}.subLabelOne`;
          return (
            <Input
              name={fieldName}
              defaultValue={value.subLabelOne}
              sx={{
                border: dirtyFields.includes(fieldName)
                  ? "3px solid green"
                  : "1px solid black",
              }}
              ref={registerForm({
                required: false,
              })}
            />
          );
        },
      },
      {
        Header: "Label Two",
        accessor: (value) => {
          const fieldName = `activities.${value.id}.subLabelTwo`;
          return (
            <Input
              name={fieldName}
              defaultValue={value.subLabelTwo}
              sx={{
                border: dirtyFields.includes(fieldName)
                  ? "3px solid green"
                  : "1px solid black",
              }}
              ref={registerForm({
                required: false,
              })}
            />
          );
        },
      },
      {
        Header: "Label Three",
        accessor: (value) => {
          const fieldName = `activities.${value.id}.subLabelThree`;
          return (
            <Input
              name={fieldName}
              defaultValue={value.subLabelThree}
              sx={{
                border: dirtyFields.includes(fieldName)
                  ? "3px solid green"
                  : "1px solid black",
              }}
              ref={registerForm({
                required: false,
              })}
            />
          );
        },
      },
    ],
    [dirtyFields]
  );

  return (
    <Styled>
      <Table columns={columns} data={tableData} />
      <Button
        type="button"
        sx={{ marginTop: 10 }}
        onClick={() =>
          setTableData((prev) => [
            ...prev,
            {
              id: "newLabel" + (prev.length + 1),
              label: "",
              subLabelOne: "",
              subLabelTwo: "",
              subLabelThree: "",
            },
          ])
        }
      >
        + Add New Label
      </Button>
    </Styled>
  );
};

export const createActivtyTypeLabel = (labelOne, labelTwo, labelThree) => {
  if (!labelThree && !labelTwo) {
    return `${labelOne}`;
  }
  if (!labelThree) {
    return `${labelOne} / ${labelTwo}`;
  }
  return `${labelOne} / ${labelTwo} / ${labelThree}`;
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
