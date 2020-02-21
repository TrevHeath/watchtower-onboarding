import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";

import { Box, Heading, Spinner, Flex, Select } from "theme-ui";

import gql from "graphql-tag";

import { useQuery } from "@apollo/react-hooks";
import moment from "moment";

export const sevenDaysAgo = moment().subtract(7, "days");
export const thirtyDaysAgo = moment().subtract(30, "days");

const dateRangeOptions = [
  {
    value: {
      startDate: sevenDaysAgo,
      endDate: moment()
    },
    label: "Last 7 days"
  },
  {
    value: {
      startDate: moment().startOf("day"),
      endDate: moment()
    },
    label: "Today"
  },
  {
    value: {
      startDate: thirtyDaysAgo,
      endDate: moment().endOf("day")
    },
    label: "Last 30 days"
  }
];

const GET_AGENCIES = gql`
  query GetAgencies(
    $where: AgencyWhereInput
    $submissionWhereInput: SubmissionWhereInput
  ) {
    agencies(where: $where) {
      id
      name
      submissionCount(where: $submissionWhereInput)
    }
  }
`;

export default function AgencyActivity() {
  const [dateRange, setDateRange] = useState(0);
  const [where, setWhere] = useState();

  const { data, refetch, loading: loadingAgencies } = useQuery(GET_AGENCIES, {
    variables: {
      submissionWhereInput: {
        createdAt: {
          gt: dateRangeOptions[dateRange].value.startDate.toISOString(),
          lt: dateRangeOptions[dateRange].value.endDate.toISOString()
        }
      }
    }
  });

  return (
    <Layout withNav={true} bannerChildren="User Management">
      <Box sx={{ maxWidth: "1200px", margin: "auto" }} py={45}>
        <Heading as="h1">Agency Activity</Heading>
        {loadingAgencies ? (
          <Flex
            sx={{
              height: "500px",
              width: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Spinner />
          </Flex>
        ) : (
          <Box>
            <Box py={45}>
              <Select
                id="dateRange"
                value={dateRange}
                onChange={e => {
                  setDateRange(e.target.value);
                }}
              >
                {dateRangeOptions.map((i, k) => (
                  <option name={i.label} value={k}>
                    {i.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box as="table">
              <Box as="thead">
                <Box as="tr">
                  <Box as="th">Agency Name</Box>
                  <Box as="th"> Incident Count</Box>
                </Box>
              </Box>
              <tbody>
                {data &&
                  data.agencies.map(a => {
                    return (
                      <Box as="tr">
                        <Box as="td" p={10}>
                          {a.name}
                        </Box>
                        <Box as="td" p={10}>
                          {a.submissionCount > 29 ? "30+" : a.submissionCount}
                        </Box>
                      </Box>
                    );
                  })}
              </tbody>
            </Box>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
