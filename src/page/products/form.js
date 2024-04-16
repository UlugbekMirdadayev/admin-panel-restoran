import {
  TextInput,
  Button,
  Group,
  Box,
  Select,
  FileInput,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "react-toastify";
import { postRequest } from "../../services/api";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { useCategories, useMeasurements, useUser } from "../../redux/selectors";

const inputs = [
  {
    name: "name",
    label: "Nomi",
  },
  {
    name: "body_price",
    label: "Tan narxi",
  },
  {
    name: "sell_price",
    label: "Sotilish narxi",
  },
  {
    name: "quantity",
    label: "Dona",
  },
];

function FormCreate({ handleOrders, close }) {
  const user = useUser();
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const categories = useCategories();
  const measurements = useMeasurements();

  const form = useForm({
    initialValues: {
      category_id: String(categories[0]?.id),
      measurement_id: String(measurements[0]?.id),
      name: "",
      price: "",
      photo: image,
      is_infinite: false,
      quantity: "",
      body_price: "",
      sell_price: "",
    },
  });

  const onSubmit = (values) => {
    if (!values.photo) return toast.info("Rasm yuklang !");
    const formData = new FormData();
    Object.keys(values).map((key) =>
      formData.append(
        key,
        typeof values[key] === "string" ? values[key]?.trim() : values[key]
      )
    );
    dispatch(setLoader(true));
    postRequest("product/create", formData, user?.token)
      .then(({ data }) => {
        dispatch(setLoader(false));
        toast.success(data?.result);
        handleOrders(true);
        close();
      })
      .catch((err) => {
        dispatch(setLoader(false));
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <FileInput
          required
          onChange={(object) => {
            const objectURL = URL.createObjectURL(object);
            setImage(objectURL);
          }}
          label={
            image ? (
              <Image
                src={image}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                }}
              />
            ) : (
              "Rasm"
            )
          }
          description="Rasm tanlang"
          placeholder="Rasm tanlang"
          accept="image/*"
          {...form.getInputProps("photo")}
        />
        {inputs.map((input) => (
          <TextInput
            key={input.name}
            mt={"md"}
            required
            withAsterisk
            label={input.label}
            placeholder={input.label}
            onInput={input.typingChange}
            {...form.getInputProps(input.name)}
          />
        ))}
        <Select
          required
          mt={"md"}
          label="O'lchov birligi"
          data={measurements.map((item) => ({
            value: String(item?.id),
            label: item?.name,
            disabled: String(item?.id) === String(form.values.measurement_id),
          }))}
          {...form.getInputProps("measurement_id")}
        />
        <Select
          required
          mt={"md"}
          label="Kategoriya"
          data={categories.map((item) => ({
            value: String(item?.id),
            label: item?.name,
            disabled: String(item?.id) === String(form.values.category_id),
          }))}
          {...form.getInputProps("category_id")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Yuborish</Button>
        </Group>
      </form>
    </Box>
  );
}

export default FormCreate;
