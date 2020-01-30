import React, { useEffect } from "react";
import { Button, Label, Input, Box, Heading, Flex } from "theme-ui";
import { useForm } from "react-hook-form";

import gql from "graphql-tag";

import { useMutation } from "@apollo/react-hooks";
import { setToken, isLoggedIn } from "../../services/auth";
import { navigate } from "@reach/router";

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const [login, { data, loading, error }] = useMutation(LOGIN);
  const { register, handleSubmit, errors } = useForm();
  const onLogin = values => {
    login({
      variables: { email: values.email, password: values.password }
    });
  };

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/admin");
    }
    if (data && data.login.token) {
      setToken(data.login.token);
      navigate("/admin");
    }
  }, [data, error]);

  return (
    <Flex
      sx={{
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Box as="form" sx={{ width: "300px" }} onSubmit={handleSubmit(onLogin)}>
        <Box>
          <Heading p={3} as="h3">
            Watchower Admin
          </Heading>
          <Box p={3}>
            <Label>Email Address</Label>
            <Input type="email" name="email" ref={register} />
          </Box>
          <Box p={3}>
            <Label>Password</Label>
            <Input type="password" name="password" ref={register} />
          </Box>

          <Box p={3}>
            <Button block type="submit">
              {loading ? "Logging in..." : "Login"}
            </Button>
            {error && <Box>{error.message}</Box>}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
