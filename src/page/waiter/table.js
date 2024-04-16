import React from "react";
import { Button, Menu, Table } from "@mantine/core";
import { putRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useUser } from "../../redux/selectors";
import moment from "moment";
import "moment/min/locales";

export default function TableComponent({
  data,
  setLoader,
  setWaiters,
  handleDelete,
}) {
  moment.locale("uz-latn");
  const user = useUser();
  const handleAktiveChange = (id) => {
    setLoader(true);
    putRequest(
      `user/update`,
      {
        user_id: id,
        is_active: data?.find((item) => item?.id === id)?.is_active === 0 ? 1 : 0,
      },
      user?.token
    )
      .then(({ data: response }) => {
        toast.info(response?.result);
        setWaiters(
          data?.map((item) => {
            if (item?.id === id) {
              return { ...item, is_active: item?.is_active === 0 ? 1 : 0 };
            }
            return item;
          })
        );
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setLoader(false);
      });
  };
  const rows = data?.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td>
        <Button
          onClick={() => handleAktiveChange(element?.id)}
          bg={!element?.is_active ? "dimmed" : undefined}
        >
          {element?.is_active ? "Aktive" : "Aktiv emas"}
        </Button>
      </Table.Td>
      <Table.Td>{element?.full_name}</Table.Td>
      <Table.Td>{element?.phone_number}</Table.Td>

      <Table.Td>
        <Menu
          shadow="md"
          transitionProps={{ transition: "pop", duration: 150 }}
          position="left-start"
        >
          <Menu.Target>
            <Button color={"red"}>Ishdan olish</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Ishdan olishga rozimisiz</Menu.Label>
            <Menu.Divider />
            <Menu.Item onClick={() => handleDelete(element?.id)} color="red">
              Ha , roziman
            </Menu.Item>
            <Menu.Item>Yo'q , shart emas</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table
      my={"lg"}
      pt={"lg"}
      w={"100%"}
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Status</Table.Th>
          <Table.Th>Ofitsiant ismi</Table.Th>
          <Table.Th>Ofitsiant Raqami</Table.Th>
          <Table.Th>Ishdan olish</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data?.length ? (
          rows
        ) : (
          <Table.Tr>
            <Table.Th ta="center" colSpan={4}>
              Ma'lumot yo'q
            </Table.Th>
          </Table.Tr>
        )}
      </Table.Tbody>
      {data?.length ? (
        <Table.Tfoot>
          <Table.Tr />
          <Table.Tr>
            <Table.Th>Umumiy ishchilar soni</Table.Th>
            <Table.Th colSpan={4}>{data?.length} kishi</Table.Th>
          </Table.Tr>
        </Table.Tfoot>
      ) : null}
    </Table>
  );
}
