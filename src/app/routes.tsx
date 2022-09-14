import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Location,
  NavLink,
} from "react-router-dom";
import { t } from "i18next";

import Login from "../features/login/Login";
import Quests from "../features/quests/Quests";
import Stations from "../features/stations/Stations";
import Rewards from "../features/rewards/Rewards";
import Dashboard from "../features/dashboard/Dashboard";
import Users from "../features/users/Users";
import { useTranslation } from "react-i18next";
import { Role } from "../lookups/role";
import PermissionGate from "./PermissionGate";
import { ReactElement } from "react";

export const PATHS = {
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  QUESTS: "/quests",
  STATIONS: "/stations",
  REWARDS: "/rewards",
  USERS: "/users",
};

interface IRoute {
  path: string;
  key: string;
  exact: boolean;
  element: ReactElement;
}

export const ROUTES: IRoute[] = [
  {
    path: PATHS.LOGIN,
    key: "LOGIN",
    exact: true,
    element: <Login />,
  },
  {
    path: PATHS.DASHBOARD,
    key: "DASHBOARD",
    exact: true,
    element: (
      <PermissionGate roles={[Role.Admin]}>
        <Dashboard />
      </PermissionGate>
    ),
  },
  {
    path: PATHS.QUESTS,
    key: "QUESTS",
    exact: true,
    element: (
      <PermissionGate roles={[Role.Admin]}>
        <Quests />
      </PermissionGate>
    ),
  },
  {
    path: PATHS.STATIONS,
    key: "STATIONS",
    exact: true,
    element: (
      <PermissionGate roles={[Role.Admin]}>
        <Stations />
      </PermissionGate>
    ),
  },
  {
    path: PATHS.REWARDS,
    key: "REWARDS",
    exact: true,
    element: (
      <PermissionGate roles={[Role.Admin]}>
        <Rewards />
      </PermissionGate>
    ),
  },
  {
    path: PATHS.USERS,
    key: "USERS",
    exact: true,
    element: (
      <PermissionGate roles={[Role.Admin]}>
        <Users />
      </PermissionGate>
    ),
  },
];

export default ROUTES;

export function RenderRoutes(routesObj: any) {
  const { routes } = routesObj;
  const auth = false;

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route: IRoute) => {
          return (
            <Route key={route.key} path={route.path} element={route.element} />
          );
        })}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

interface IMenuItem {
  name: string;
  icon: string;
  key: string;
  path: string;
  rootPath?: string;
}
interface IMenuPerRole {
  [key: string]: IMenuItem[];
}

export const menuPerRole: IMenuPerRole = {
  [Role.Admin]: [
    {
      name: "DASHBOARD",
      icon: "quests",
      key: "DASHBOARD",
      path: PATHS.DASHBOARD,
    },
    {
      name: "QUESTS",
      icon: "quests",
      key: "QUESTS",
      path: PATHS.QUESTS,
    },
    {
      name: "STATIONS",
      icon: "quests",
      key: "STATIONS",
      path: PATHS.STATIONS,
    },
    {
      name: "REWARDS",
      icon: "quests",
      key: "REWARDS",
      path: PATHS.REWARDS,
    },
    {
      name: "USERS",
      icon: "quests",
      key: "USERS",
      path: PATHS.USERS,
    },
  ],
  [Role.Office]: [
    {
      name: "DASHBOARD",
      icon: "quests",
      key: "DASHBOARD",
      path: PATHS.DASHBOARD,
    },
    {
      name: "QUESTS",
      icon: "quests",
      key: "QUESTS",
      path: PATHS.QUESTS,
    },
    {
      name: "STATIONS",
      icon: "quests",
      key: "STATIONS",
      path: PATHS.STATIONS,
    },
    {
      name: "REWARDS",
      icon: "quests",
      key: "REWARDS",
      path: PATHS.REWARDS,
    },
    {
      name: "USERS",
      icon: "quests",
      key: "USERS",
      path: PATHS.USERS,
    },
  ],
  [Role.User]: [
    {
      name: "DASHBOARD",
      icon: "quests",
      key: "DASHBOARD",
      path: PATHS.DASHBOARD,
    },
    {
      name: "STATIONS",
      icon: "quests",
      key: "STATIONS",
      path: PATHS.STATIONS,
    },
    {
      name: "REWARDS",
      icon: "quests",
      key: "REWARDS",
      path: PATHS.REWARDS,
    },
  ],
  [Role.Object]: [
    {
      name: "STATIONS",
      icon: "quests",
      key: "STATIONS",
      path: PATHS.STATIONS,
    },
  ],
};

export function RenderMenuLinks() {
  const { t } = useTranslation();

  return (
    <>
      {menuPerRole[Role.Admin].map((route) => (
        <NavLink
          key={route.key}
          to={route.path}
          className={({ isActive }) => {
            return `navbar__item${isActive ? " active" : ""}`;
          }}
        >
          <i
            className={`icon icon--base navbar__item__icon navbar__item--${route.icon}`}
          ></i>
          <span className={`navbar__item__label`}>
            {t(`NAVIGATION.${route.name}`)}
          </span>
        </NavLink>
      ))}
    </>
  );
}
