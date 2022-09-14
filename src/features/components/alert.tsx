import { NavLink } from "react-router-dom";

import logo from "../../assets/logo.png";
import success from "../../assets/icons/success.svg";
import { useTranslation } from "react-i18next";

interface IAlertProps {
  type: any;
  handleClick: () => void;
}

const Alert = (props: IAlertProps) => {
  const { t } = useTranslation();
  const { type, handleClick } = props;
  const tString = type.toUpperCase();

  let image = success;

  switch (type) {
    case "success":
      image = success;
      break;
    default:
      image = success;
      break;
  }

  return (
    <>
      <div className={`alert alert--${type}`}>
        <div className="alert__head mb-4">
          <img
            className="alert__head__icon navbar__logo align--center"
            src={image}
            alt={type}
          />
        </div>
        <div className="type--lg type--wgt--bold mb-4">
          {t(`ALERT.${tString}.TITLE`)}
        </div>
        <div className="type--color--secondary mb-6 w--448--max">
          {t(`ALERT.${tString}.DESCRIPTION`)}
        </div>
        <div className="btn btn--success alert__btn" onClick={handleClick}>
          <div className="mb-4 mt-3 ml-8 mr-8">
            {t(`ALERT.${tString}.BUTTON`)}
          </div>
        </div>
      </div>
      <div className="alert__overlay"></div>
    </>
  );
};

export default Alert;
