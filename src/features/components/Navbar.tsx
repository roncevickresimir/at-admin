import { NavLink } from "react-router-dom";

import logo from "../../assets/logo.png";
import { logout } from "../../slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PATHS, RenderMenuLinks } from "../../app/routes";
import { useTranslation } from "react-i18next";
// import { persistor } from '../../app/store';

const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // persistor.purge();
    dispatch(logout());
    // dispatch(logoutUser());
    dispatch({ type: "USER_LOGOUT" });
  };

  const user = useAppSelector((state) => state.user);

  return (
    <div className="navbar">
      <NavLink className="d--b flex flex--center" to={t(PATHS.QUESTS)}>
        <img className="navbar__logo" src={logo} alt="logo" />
        <div className="type--wgt--bold type--color--secondary">Avan</div>
        <div className="type--wgt--bold type--color--primary">Tourist</div>
      </NavLink>
      <div className="flex--grow">
        <RenderMenuLinks></RenderMenuLinks>
      </div>
      <div className="navbar__bottom">
        <NavLink to="" className="navbar__bottom__my-profile">
          <div className="navbar__bottom__user-info">
            <div className="type--color--primary type--wgt--bold type--break">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="type--xs type--color--tertiary type--wgt--regular ">
              {user.role.name}
            </div>
          </div>
        </NavLink>
        <NavLink to={PATHS.LOGIN} onClick={handleLogout} className="d--ib">
          <i className="icon icon--logout icon--sm icon--grey"></i>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
