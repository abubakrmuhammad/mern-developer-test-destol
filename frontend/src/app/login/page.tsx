"use client";

import { useLogin } from "@/lib/api/hooks/auth/auth.mutations";
import { parseApiErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Paper, Title, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import { PasswordInput, TextInput } from "react-hook-form-mantine";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Please enter your password"),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

function LoginPage() {
  const { formState, control, ...form } = useForm<LoginFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = async (data: LoginFormSchema) => {
    const { email, password } = data;

    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (e) {
      const message = parseApiErrorMessage(e);

      form.setError("root", { message: message ?? "Something went wrong" });
    }
  };

  return (
    <Container size={420} my={40} mt={100}>
      <Title ta="center">Welcome back!</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@destol.dev"
            autoComplete="off"
            autoFocus
            name="email"
            control={control}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            autoComplete="off"
            name="password"
            control={control}
          />

          <Text mt="md" size="sm" c="red">
            {formState.errors.root?.message}
          </Text>

          <Button fullWidth mt="sm" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginPage;
