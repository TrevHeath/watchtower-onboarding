import React, { useState, Fragment, useEffect } from "react";
import Layout from "../../components/Layout";

import {
  Button,
  Label,
  Input,
  Box,
  Heading,
  Select,
  Spinner,
  Flex,
} from "theme-ui";
import { useForm } from "react-hook-form";
import { useTable } from "react-table";
import styled from "@emotion/styled";
import gql from "graphql-tag";

import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { useToasts } from "../../components/Toasts";
import { checkFieldIsDirty } from "../../utils";
import { INVITE_USER } from "./UserManagement";
import ReactModal from "react-modal";
import { useModal } from "react-modal-hook";
import CopyToClipboard from "react-copy-to-clipboard";
import CopyBox from "../../components/CopyBox";

const GET_AGENCY_DETAILS = gql`
  query GetAgencyDetails($id: String!) {
    agencies(where: { id: { equals: $id } }) {
      id
      name
      adminTags
      positions {
        id
        name
        dispatchable
        positionStatus
      }
      users {
        id
        name
        email
        role
        isSignedUp
      }
      activities(orderBy: { label: asc }) {
        id
        label
        subLabelOne
        subLabelTwo
        subLabelThree
      }
      settings {
        id
        surflineSpotId
        dispatching
        incidentReporting
        nwsOfficegridXgridY
        noaaTidesStation
        latitude
        longitude
        epcr
        modules {
          key
          value
        }
      }
    }
  }
`;

const GET_AGENCIES = gql`
  query GetAgencies($where: AgencyWhereInput) {
    agencies(where: $where) {
      id
      name
      adminTags
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

const TagInput = ({ onNewItem, items, onRemoveItem, title, loading }) => {
  return (
    <Box py={25}>
      <Label>
        {title || "Admin Tags"}{" "}
        {loading && <Spinner height="15px" width="15px" />}
      </Label>
      <Input
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            e.target.value &&
            e.target.value.length > 1
          ) {
            onNewItem(e);
          }
        }}
      />
      {items && (
        <Flex>
          {items.map((t) => (
            <Box
              sx={{
                m: "4px",
                p: 10,
                borderRadius: 4,
                bg: "secondary",
                color: "white",
              }}
            >
              {t}{" "}
              <Button
                sx={{
                  bg: "transparent",
                  p: 0,
                  cursor: "pointer",
                }}
                onClick={() => onRemoveItem(t)}
              >
                X
              </Button>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default function UserManagement() {
  const [tags, setTags] = useState([]);
  const [selectedAgencyId, selectAgency] = useState(null);
  const [updateOneAgency, { loading }] = useMutation(UPDATE_AGENCY, {
    refetchQueries: ["GetAgencyDetails"],
  });
  const [resendInvite, { loading: resendingInvite }] = useMutation(
    RE_SEND_INVITE
  );

  const { data: agencies, loading: loadingAgencies } = useQuery(GET_AGENCIES);
  const [loadAgency, { loading: loadingAgency, data }] = useLazyQuery(
    GET_AGENCY_DETAILS
  );

  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
    setError,
  } = useForm({
    mode: "onChange",
  });

  const {
    isDirty,
    isSubmitting,
    touched,
    submitCount,
    dirtyFields,
  } = formState;

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

  const dirtyFieldsArray = Object.keys(dirtyFields);

  const onUpdate = async (values) => {
    try {
      let error = null;
      if (!dirtyFields || Object.keys(dirtyFields).length === 0) {
        add({ content: "No updates made.", variant: "error" });
        return;
      }
      if (!selectedAgencyId) {
        add({
          content: "Please select an agency to update.",
          variant: "error",
        });
        return;
      }
      let connections = {};

      connections.settings = {
        update: {
          ...(checkFieldIsDirty(dirtyFieldsArray, "surflineSpotId") && {
            surflineSpotId: values.surflineSpotId,
          }),
          ...(checkFieldIsDirty(dirtyFieldsArray, "longitude") && {
            longitude: parseFloat(values.longitude),
          }),
          ...(checkFieldIsDirty(dirtyFieldsArray, "latitude") && {
            latitude: parseFloat(values.latitude),
          }),
          ...(checkFieldIsDirty(dirtyFieldsArray, "noaaTidesStation") && {
            noaaTidesStation: values.noaaTidesStation,
          }),
          // ...(checkFieldIsDirty(dirtyFieldsArray, "nwsOfficegridXgridY") && {
          //   nwsOfficegridXgridY: values.nwsOfficegridXgridY,
          // }),
          ...(checkFieldIsDirty(dirtyFieldsArray, "incidentReporting") && {
            incidentReporting: values.incidentReporting,
          }),
          ...(checkFieldIsDirty(dirtyFieldsArray, "dispatching") && {
            dispatching: values.dispatching,
          }),
          ...(checkFieldIsDirty(dirtyFieldsArray, "comms") && {
            comms: values.comms,
          }),
          ...(checkFieldIsDirty(dirtyFieldsArray, "publicDashboard") && {
            publicDashboard: values.publicDashboard,
          }),
        },
      };

      let updatedActivities = [];
      let newActivities = [];

      if (dirtyFieldsArray.includes("activities")) {
        Object.entries(dirtyFields.activities).map(([key, value]) => {
          // const split = d.split(".");
          const currentLabel = values.activities[key];

          const newLabel = createActivtyTypeLabel(
            currentLabel.subLabelOne,
            currentLabel.subLabelTwo,
            currentLabel.subLabelThree
          );

          if (!newLabel) {
            console.log("new", newLabel);
            error = `Invalid category missing base categories: ${currentLabel.subLabelOne}, ${currentLabel.subLabelTwo}, ${currentLabel.subLabelThree}`;
          }

          if (key.startsWith("newLabel")) {
            newActivities.push({
              label: newLabel,
            });
            return;
          }

          updatedActivities.push({
            where: { id: key },
            data: {
              label: newLabel,
            },
          });

          return;
        });
      }

      if (updatedActivities.length > 0) {
        connections.activities = {
          update: updatedActivities,
        };
      }

      if (newActivities.length > 0) {
        connections.activities = {
          create: newActivities,
        };
      }

      if (dirtyFieldsArray.includes("name")) {
        connections.name = values.name;
      }

      if (error) {
        add({ content: error, variant: "error" });
        return;
      }
      console.log(connections, selectedAgencyId);
      const res = await updateOneAgency({
        variables: {
          where: {
            id: selectedAgencyId,
          },
          data: {
            ...connections,
          },
        },
      });

      if (res.data && res.data.updateOneAgency && res.data.updateOneAgency.id) {
        add({ content: "Agency Updated", variant: "success" });
        reset();
      }
    } catch (e) {
      console.log(e.message);
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
          <TagInput
            title={"Filter agency list"}
            items={tags}
            loading={loading}
            onRemoveItem={async (item) => {
              setTags(tags.filter((i) => item !== i));
            }}
            onNewItem={(e) => {
              setTags([...tags, e.target.value]);
            }}
          />
          <Label>Select an agency</Label>
          <Select
            onChange={(e) => selectAgency(e.target.value)}
            type="select"
            name="agencyId"
          >
            {loadingAgencies ? (
              <option>loading...</option>
            ) : agencies ? (
              [
                <option key={-1} value="">
                  Select an agency
                </option>,
                ...agencies.agencies
                  .filter((a) =>
                    tags.length > 0
                      ? a.adminTags.some((r) => tags.includes(r))
                      : true
                  )
                  .map((a, k) => (
                    <option key={k} value={a.id}>
                      {a.name}
                      {a.adminTags && a.adminTags.length > 0 && " | Tags:"}{" "}
                      {a.adminTags.join(", ")}
                    </option>
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
          ) : !selectedAgencyId ? (
            <Box sx={{ minHeight: "70vh" }}>Select and agency to update</Box>
          ) : (
            <>
              <Box py={25}>
                <CopyBox
                  style={{ cursor: "pointer" }}
                  value={defaultFormValues.id}
                />
              </Box>
              {selectedAgencyId && (
                <TagInput
                  items={defaultFormValues.adminTags}
                  loading={loading}
                  onRemoveItem={async (item) => {
                    await updateOneAgency({
                      variables: {
                        where: {
                          id: selectedAgencyId,
                        },
                        data: {
                          adminTags: {
                            set: [
                              ...defaultFormValues.adminTags.filter(
                                (tg) => tg !== item
                              ),
                            ],
                          },
                        },
                      },
                    });
                  }}
                  onNewItem={async (e) => {
                    await updateOneAgency({
                      variables: {
                        where: {
                          id: selectedAgencyId,
                        },
                        data: {
                          adminTags: {
                            set: [
                              ...defaultFormValues.adminTags,
                              e.target.value,
                            ],
                          },
                        },
                      },
                    });
                  }}
                />
              )}
              <Box as="form" onSubmit={handleSubmit(onUpdate)}>
                <Flex>
                  {defaultFormValues &&
                    defaultFormValues.modules &&
                    defaultFormValues.modules.map((v, k) => {
                      return (
                        <Flex key={k} px={10}>
                          <Label>{v.key}</Label>
                          <input
                            type="checkbox"
                            name={v.key}
                            ref={register({
                              required: false,
                            })}
                            defaultChecked={v.value}
                          />
                          <FormError error={errors[v.key]} />
                        </Flex>
                      );
                    })}
                </Flex>
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
                  <Label>noaaTidesStation</Label>
                  <Input
                    type="select"
                    name="noaaTidesStation"
                    defaultValue={defaultFormValues.noaaTidesStation}
                    ref={register({
                      required: false,
                    })}
                  />
                  <FormError error={errors.noaaTidesStation} />
                </Box>
                {/* <Box py={25}>
                <Label>nwsOfficegridXgridY</Label>
                <Input
                  type="select"
                  name="nwsOfficegridXgridY"
                  defaultValue={defaultFormValues.nwsOfficegridXgridY}
                  ref={register({
                    required: false,
                  })}
                />
                <FormError error={errors.nwsOfficegridXgridY} />
              </Box> */}
                <Box py={25}>
                  <Label>Lat</Label>
                  <Input
                    type="select"
                    name="latitude"
                    defaultValue={defaultFormValues.latitude}
                    ref={register({
                      required: false,
                    })}
                  />
                  <FormError error={errors.latitude} />
                </Box>
                <Box py={25}>
                  <Label>Long</Label>
                  <Input
                    type="select"
                    name="longitude"
                    defaultValue={defaultFormValues.longitude}
                    ref={register({
                      required: false,
                    })}
                  />
                  <FormError error={errors.longitude} />
                </Box>
                <Box>
                  {data && data.agencies[0].activities ? (
                    <Box py={25}>
                      <h2>Categories </h2>
                      <ActivitiesTable
                        data={data.agencies[0].activities}
                        registerForm={register}
                        dirtyFields={dirtyFieldsArray}
                      />
                      <FormError error={errors.activities} />
                    </Box>
                  ) : (
                    <Fragment />
                  )}
                </Box>
                <Box py={25}>
                  <Button block type="submit">
                    {loading ? "Updating..." : "Update"}
                  </Button>
                </Box>
              </Box>
            </>
          )}

          {data && data.agencies[0].users ? (
            <Box py={25}>
              <h2>Users </h2>
              <UserTable
                data={data.agencies[0].users}
                resendInvite={onResendInvite}
                agencyId={data.agencies[0].id}
              />
              <FormError error={errors.users} />
            </Box>
          ) : (
            <Fragment />
          )}
          {data && data.agencies[0].users ? (
            <Box py={25}>
              <h2>Positions </h2>
              <PositionTable data={data.agencies[0].positions} />
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
        {headerGroups.map((headerGroup, k) => (
          <tr key={k} {...headerGroup.getHeaderGroupProps()}>
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
            <tr key={i} {...row.getRowProps()}>
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

const UPDATE_USER = gql`
  mutation UpdateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
    updateOneUser(where: $where, data: $data) {
      id
      role
      email
      name
    }
  }
`;

export const UserNameInput = ({ userId, currentName = "" }) => {
  const { register, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
  });

  const { isDirty } = formState;

  const [updateUserRole, { error }] = useMutation(UPDATE_USER);
  const { add } = useToasts();

  async function onSubmit(values) {
    try {
      const res = await updateUserRole({
        variables: {
          where: { id: userId },
          data: { name: values.name },
        },
      });

      if (!res.error) {
        add({
          color: "success",
          content: "Name updated",
        });
      }
      reset();
    } catch (e) {
      console.log(e);
      add({
        color: "danger",
        content: e,
      });
    }
  }

  return (
    <Box
      as="form"
      style={{ display: "flex", alignItems: "center" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        id="name"
        name="name"
        defaultValue={currentName}
        ref={register({
          required: false,
        })}
      />
      {isDirty && <Button variant="primary">Update</Button>}
      {error && <FormError error={error} />}
    </Box>
  );
};

const UserTable = ({ data, resendInvite, agencyId }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",

        accessor: (value) => {
          return <UserNameInput userId={value.id} currentName={value.name} />;
        },
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
        Header: "Invites ",
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
          if (!value.email) {
            return <InviteCurrentUserModal user={value} agencyId={agencyId} />;
          }

          return <Fragment />;
        },
      },
    ],
    []
  );

  const InviteCurrentUserModal = ({ user, agencyId }) => {
    const { add } = useToasts();
    const [invite, { loading: inviting }] = useMutation(INVITE_USER);
    const { register, handleSubmit } = useForm({
      mode: "onChange",
    });

    async function inviteCurrentUser(args) {
      try {
        const res = await invite({
          ...args,
        });

        if (!res.errors) {
          add({
            content: "User invited",
            color: "success",
          });
          hideModal();
        }
      } catch (e) {
        console.log(e);
        add({
          content: "Error inviting user",
          color: "danger",
        });
      }
    }

    const [showModal, hideModal] = useModal(
      () => (
        <ReactModal isOpen>
          <Box
            style={{ position: "absolute", top: 5, right: 5 }}
            onClick={hideModal}
          >
            X
          </Box>

          <Box
            as="form"
            sx={{ maxWidth: "700px", margin: "auto" }}
            onSubmit={handleSubmit(async (values) => {
              await inviteCurrentUser({
                variables: {
                  userId: user.id,
                  email: values.email.trim(),
                  role: values.role || "USER",
                  agencyId: agencyId,
                },
              });
            })}
          >
            <h3>Invite a current user</h3>
            <Box py={25}>
              <Label>Role</Label>
              <Input
                name={"email"}
                ref={register({
                  required: true,
                })}
              />
            </Box>
            <Box py={25}>
              <Label>Role</Label>

              <Select type="select" name="role" ref={register}>
                <option value={"USER"}>User</option>
                <option value={"ADMIN"}>Admin</option>
              </Select>
            </Box>
            <Button variant="primary" sx={{ variant: "link" }}>
              {inviting ? "inviting..." : "Send Invite"}
            </Button>
          </Box>
        </ReactModal>
      ),
      [inviting]
    );

    return <Button onClick={() => showModal()}>Invite this User</Button>;
  };

  const tableData = React.useMemo(() => data, [data]);
  return (
    <Styled>
      <Table columns={columns} data={tableData} />
    </Styled>
  );
};

const PositionTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: (value) => <CopyBox value={value.id} />,
      },
      {
        Header: "Name",
        accessor: "name",
      },

      {
        Header: "Dispatchable",
        accessor: (value) => {
          return value.dispatchable ? "Dispatchable Unit" : "Not Dispatchable";
        },
      },
      {
        Header: "Status",
        accessor: "positionStatus",
      },
    ],
    []
  );

  const tableData = React.useMemo(() => data, [data]);
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
  if (!labelOne || !labelTwo) {
    return false;
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
