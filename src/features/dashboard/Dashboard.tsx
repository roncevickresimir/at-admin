import { useTranslation } from "react-i18next";
import MainWrapper from "../components/MainWrapper";

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <>
      <MainWrapper>
        <div className="card--lessons">
          <div className="card--lessons__body">
            <div className="card--lessons__body__aside">
              <div className="card--lessons__head">
                <div className="w--100">{t("DASHBOARD.TITLE")}</div>
              </div>
            </div>
            <div className="card--lessons__body__main flex">
              <div className="flex--primary w--100"></div>
            </div>
          </div>
        </div>
      </MainWrapper>
    </>
  );
};

export default Dashboard;
