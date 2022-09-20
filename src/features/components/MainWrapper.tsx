import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { PATHS } from "../../app/routes";
import Navbar from "./Navbar";
import logo from "../../assets/logo.png";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const MainWrapper = (props: Props) => {
  const { t } = useTranslation();
  const [asideActive, setAsideActive] = useState<boolean>(false);

  return (
    <>
      <div className="layout">
        <div className="layout__mobile">
          <NavLink className="d--b flex flex--center" to={t(PATHS.QUESTS)}>
            <img className="navbar__logo" src={logo} alt="logo" />
            <div className="type--wgt--bold type--color--secondary">Avan</div>
            <div className="type--wgt--bold type--color--primary">Tourist</div>
          </NavLink>
          <i
            className="icon icon--md icon--menu icon--black"
            onClick={() => setAsideActive(!asideActive)}
          ></i>
        </div>
        <div className={`sidebar layout__aside ${asideActive ? "active" : ""}`}>
          <div
            className={`layout__aside__close sidebar__close  ${
              asideActive ? "active" : ""
            }`}
            onClick={() => setAsideActive(!asideActive)}
          >
            <i className="icon icon--md icon--close icon--black"></i>
          </div>
          <Navbar />
        </div>
        <div className="layout__main">{props.children}</div>
      </div>
    </>
  );
};

export default MainWrapper;
