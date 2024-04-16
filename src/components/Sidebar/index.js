import React, { useEffect, useCallback } from "react";
import { Button, Menu, Text } from "@mantine/core";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import classes from "./style.module.css";
import { setUser } from "../../redux/userSlice";
import {
  AdminIcon,
  Dashboard,
  Globus,
  Pizza,
  OrderIcon,
  CopyBoard,
  Room,
  LogOut,
} from "../icon";
import { getRequest } from "../../services/api";
import { useUser } from "../../redux/selectors";
import { setCategories } from "../../redux/categoriesSlice";
import { setMeasurements } from "../../redux/measurementSlice";

const tabs = [
  { link: "/", label: "Hisobotlar", icon: Dashboard },
  { link: "/live-orders", label: "Aktiv buyurtmalar", icon: OrderIcon },
  { link: "/waiter", label: "Ofitsiant", icon: CopyBoard },
  { link: "/products", label: "Maxsulotlar", icon: Pizza },
  { link: "/rooms", label: "Xonalar/Stollar", icon: Room },
  { link: "/admin-create", label: "Ish Boshqaruvchilar", icon: AdminIcon },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useUser();

  const getCategory = useCallback(() => {
    if (!user?.token) return;
    getRequest("category/get", user?.token)
      .then(({ data }) => {
        dispatch(setCategories(data?.result));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user?.token, dispatch]);

  const getMeasurement = useCallback(() => {
    if (!user?.token) return;
    getRequest("measurement/get", user?.token)
      .then(({ data }) => {
        dispatch(setMeasurements(data?.result));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user?.token, dispatch]);

  useEffect(() => {
    getCategory();
    getMeasurement();
  }, [getCategory, getMeasurement]);

  const links = tabs.map((item) => (
    <NavLink
      className={classes.link}
      to={item.link}
      key={item.label}
      children={
        <>
          <item.icon />
          <span>{item.label}</span>
        </>
      }
    />
  ));

  const handleLogout = () => {
    dispatch(setUser({}));
    navigate("/login", { replace: true });
    localStorage.clear();
  };

  return (
    <nav className={classes.navbar}>
      <NavLink to={"/"}>
        <Text fw={500} size="sm" className={classes.title} c="dimmed" mb="xs">
          Admin Panel Restoran
        </Text>
      </NavLink>
      <div className={classes.navbarMain}>
        {links}
        <a
          href="link to your website"
          onClick={(e) => e.preventDefault()}
          target="_blank"
          rel="noreferrer"
          className={classes.link}
        >
          <Globus />
          <span>Web-sahifa</span>
        </a>
        <Menu position="right-start" width={"100px"}>
          <Menu.Target>
            <Button w={"100%"} py={"5px"} h={"auto"} mt={80} bg={"red"}>
              <Text pr={"sm"}>Chiqish</Text> <LogOut fill="#fff" />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item c={"red"} onClick={handleLogout}>
              Ha
            </Menu.Item>
            <Menu.Item>Yo'q</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </nav>
  );
}
