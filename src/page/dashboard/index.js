import React, { useCallback, useEffect } from "react";
import { Button, Flex, Title } from "@mantine/core";
// import { DatePickerInput } from "@mantine/dates";
// import moment from "moment";
import { useDispatch } from "react-redux";
import TableComponent from "./table";
import { useReport, useUser } from "../../redux/selectors";
import { setLoader } from "../../redux/loaderSlice";
import { postRequest } from "../../services/api";
import { setReport } from "../../redux/reportSlice";
import { Reload } from "../../components/icon";

const Dashboard = () => {
  const user = useUser();
  const dispatch = useDispatch();
  // const [isTodayData, setIsTodayData] = useState(false);
  // const [value, setValue] = useState([
  //   new Date(new Date().setDate(new Date().getDate() - 7)),
  //   new Date(),
  // ]);
  // const [department, setDepartment] = useState({
  //   label: "Afitsantlar",
  //   value: "0",
  // });
  const report = useReport();

  const getReport = useCallback(
    (update) => {
      if (!update && report?.orders?.length) return;
      dispatch(setLoader(true));
      postRequest("order/get", {}, user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setReport(data?.result));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          console.log(err);
        });
    },
    [user?.token, report?.orders?.length, dispatch]
  );

  useEffect(() => {
    getReport();
  }, [getReport]);

  return (
    <div className="container-page">
      <div>
        <Flex justify={"space-between"} align={"center"}>
          <Title>Hisobotlar </Title>
          <Button onClick={() => getReport(true)}>
            <Flex align={"center"} gap={10}>
              <Reload fill="#fff" />
              <span>Ma'lumotlarni Yangilash</span>
            </Flex>
          </Button>
        </Flex>
        {/* <Flex align={"flex-end"} gap={"lg"} my={"lg"}>
          <Select
            label="Ishchilar bo'yicha"
            data={[{ label: "Afitsantlar", value: "0" }, ...departments].map(
              (item) =>
                item.value === department.value
                  ? { ...item, disabled: true }
                  : item
            )}
            defaultValue={"0"}
            required
            onChange={(value) =>
              setDepartment(
                [{ label: "Afitsantlar", value: "0" }, ...departments]?.find(
                  (item) => item?.value === value
                )
              )
            }
          />
          <DatePickerInput
            required
            label="Sanasi bo'yicha"
            type="range"
            value={value}
            onChange={(date) => {
              setValue(date);
              setIsTodayData(false);
            }}
            maxDate={new Date()}
            minDate={new Date().setMonth(new Date().getMonth() - 1)}
          />
          <Button
            onClick={() => {
              if (isTodayData) return null;
              setValue([new Date(), new Date()]);
              setIsTodayData(true);
            }}
          >
            Bugunlik hisobot
          </Button>
        </Flex> */}
      </div>
      {/* <Text fw={600} fz={"lg"}>
        {isTodayData
          ? "Bugungi 24 soatlik hisobot"
          : value.filter(Boolean).length === 2
          ? value.map(
              (d, i) =>
                moment(d).format("DD-MM-YYYY") + (i ? " gacha" : " dan ")
            )
          : null}
      </Text> */}
      <TableComponent
        data={report}
        user={user}
        setLoader={(boolean) => dispatch(setLoader(boolean))}
      />
    </div>
  );
};

export default Dashboard;
