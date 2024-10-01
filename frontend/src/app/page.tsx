"use client";

import { useUpsertCar } from "@/lib/api/hooks/cars/cars.mutations";
import { useGetMyCar } from "@/lib/api/hooks/cars/cars.queries";
import { parseApiErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Container,
  Paper,
  Title,
  Text,
  Stack,
  FileInput,
  Flex,
  Image,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumberInput, TextInput } from "react-hook-form-mantine";
import { z } from "zod";

const carFormSchema = z.object({
  model: z.string().min(3, "Model name should be at least 3 characters"),
  price: z.number().min(1, "Price should be at least 1 dollar"),
  phoneNumber: z.string().length(11, "Phone number should be 11 digits long"),
  maxNumberOfPictures: z
    .number()
    .min(1, "Max number of pictures should be at least 1")
    .max(10, "Max number of pictures should be at most 10"),
  carPictures: z.array(z.instanceof(File)),
});

type CarFormSchema = z.infer<typeof carFormSchema>;

function HomePage() {
  const { formState, control, ...form } = useForm<CarFormSchema>({
    defaultValues: {
      model: "",
      price: undefined,
      phoneNumber: "",
      maxNumberOfPictures: 3,
    },
    resolver: zodResolver(carFormSchema),
  });

  const { data: carData } = useGetMyCar();

  useEffect(() => {
    if (carData) {
      form.setValue("model", carData.model);
      form.setValue("price", carData.price);
      form.setValue("phoneNumber", carData.phoneNumber);
    }
  }, [carData]);

  const upsertCarMutation = useUpsertCar();

  const onSubmit = async (data: CarFormSchema) => {
    const { model, price, phoneNumber, maxNumberOfPictures, carPictures } =
      data;

    try {
      await upsertCarMutation.mutateAsync({
        model,
        price,
        phoneNumber,
      });

      notifications.show({
        title: "Success!",
        message: "Car successfully updated",
        color: "green",
      });
    } catch (e) {
      const message = parseApiErrorMessage(e);

      form.setError("root", { message: message ?? "Something went wrong" });
    }
  };

  return (
    <Container size={560} my={40} mt={100}>
      <Title ta="center">Your Car Info!</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack align="stretch" justify="center" gap="md">
            <TextInput
              label="Car Model"
              placeholder="BMW i7"
              autoComplete="off"
              autoFocus
              name="model"
              control={control}
            />

            <NumberInput
              label="Price"
              placeholder="$$$"
              autoComplete="off"
              autoFocus
              prefix="$"
              name="price"
              control={control}
            />

            <TextInput
              label="Phone Number"
              placeholder="03001234567"
              autoComplete="off"
              autoFocus
              name="phoneNumber"
              control={control}
            />

            <NumberInput
              label="Max Number of Pictures"
              autoComplete="off"
              autoFocus
              name="maxNumberOfPictures"
              min={1}
              max={10}
              control={control}
            />

            <Controller
              name="carPictures"
              control={control}
              render={({ field }) => (
                <FileInput
                  {...field}
                  label="Upload Picture(s)"
                  placeholder="Select files"
                  multiple
                  onChange={(files) => {
                    const maxNumberOfPictures = form.getValues(
                      "maxNumberOfPictures",
                    );

                    if (files.length > maxNumberOfPictures) {
                      field.onChange(files.slice(0, maxNumberOfPictures));
                    } else {
                      field.onChange(files);
                    }

                    form.trigger("carPictures");
                  }}
                  error={formState.errors.carPictures?.message}
                  accept="image/*"
                  clearable
                />
              )}
            />

            <Flex justify="center" gap="md" wrap="wrap">
              {form
                .getValues("carPictures")
                ?.map((file) => (
                  <Image
                    key={file.name}
                    src={URL.createObjectURL(file)}
                    width={100}
                    height={100}
                    radius="md"
                    fit="cover"
                    bd="1px solid grey"
                  />
                ))}
            </Flex>
          </Stack>

          <Text mt="xl" size="sm" c="red">
            {formState.errors.root?.message}
          </Text>

          <Button
            fullWidth
            mt="md"
            type="submit"
            size="lg"
            loading={formState.isSubmitting}
          >
            Update Car Info
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default HomePage;
