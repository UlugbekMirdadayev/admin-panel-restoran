import React from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
} from "@mantine/core";
import { post } from "../../services/api";
import { useForm } from "@mantine/form";
import classes from "./style.module.css";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { setUser } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      phone_number: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    dispatch(setLoader(true));
    post("auth/login", values)
      .then(({ data }) => {
        dispatch(setUser(data?.result));
        localStorage.setItem("user-xadya", JSON.stringify(values));
        localStorage.setItem("token-xadya", data?.result?.token);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Error");
      })
      .finally(() => {
        dispatch(setLoader(false));
      });
  };

  return (
    <Container my={"auto"} mx={"auto"}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Title ta="center" className={classes.title}>
          Hush kelibsiz !
        </Title>

        <Paper withBorder shadow="md" w={400} p={30} mt={30} radius="md">
          <TextInput
            label={
              <Text
                style={{
                  display: "inline-block",
                }}
                pb={"lg"}
              >
                Telefon raqamingiz
              </Text>
            }
            placeholder="998***"
            required
            {...form.getInputProps("phone_number")}
          />
          <PasswordInput
            label={
              <Text
                style={{
                  display: "inline-block",
                }}
                pb={"lg"}
              >
                Parolingiz
              </Text>
            }
            placeholder="Parolingiz"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
};

export default Login;
