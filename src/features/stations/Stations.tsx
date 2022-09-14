import { useTranslation } from "react-i18next";
import { cloneDeep, groupBy } from "lodash";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import MainWrapper from "../components/MainWrapper";
import LoaderAvailableLessons from "../components/skeleton-loaders/LoaderAvailableLessons";
import { useAppSelector } from "../../app/hooks";
import { PATHS } from "../../app/routes";
import IStation from "../../interfaces/IStation";
import StationItem from "./components/StationItem";
import StationForm from "./components/StationForm";
import {
  IGetStationsPayload,
  useLazyGetStationByIdQuery,
  useLazyGetStationsQuery,
} from "../../services/stationService";
import noResults from "../../assets/images/noResults.svg";
import StationDisplay from "./components/StationDisplay";

const CompletedLessons = () => {
  const { t } = useTranslation();

  const [
    getStations,
    { isLoading: listLoading, isUninitialized: listUninitialized },
  ] = useLazyGetStationsQuery();

  const [
    getStation,
    { isLoading: stationLoading, isUninitialized: stationUninitialized },
  ] = useLazyGetStationByIdQuery();

  const [getStationsPayload, setGetStationsPayload] =
    useState<IGetStationsPayload>({
      search: "",
      page: 1,
      rpp: 10,
    });

  const [stations, setStations] = useState<IStation[]>([]);
  const [activeStation, setActiveStation] = useState<IStation | null>(null);

  const loadingList = listLoading || listUninitialized;

  const handleActiveStation = async (stationId: string) => {
    const getStationResponse = await getStation(stationId).unwrap();
    setActiveStation(getStationResponse);
    // handle
  };

  const fetchData = async () => {
    const getStationsResponse = await getStations(getStationsPayload).unwrap();
    setStations(getStationsResponse);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <MainWrapper>
        <div className="card--lessons">
          <div className="card--lessons__body">
            <div className="card--lessons__body__aside">
              <div className="card--lessons__head">
                <div className="w--100">
                  {t("STATIONS.TITLE")}
                  {activeStation?.id && (
                    <button
                      onClick={() => setActiveStation(null)}
                      className="btn btn--base btn--ghost mr-4"
                      style={{ float: "right" }}
                    >
                      {t("STATIONS.FORM.NEW")}
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-10 mb-10 ml-6 mr-6">
                <span className="type--uppercase type--color--tertiary">
                  {t("STATIONS.STATIONS_AVAILABLE")}
                </span>
                <span className="tag--primary d--ib ml-2">
                  {stations.length ? stations.length : "0"}
                </span>
              </div>
              <div className="lessons-list">
                {loadingList ? (
                  <LoaderAvailableLessons />
                ) : stations.length > 0 ? (
                  stations.map((station: IStation) => {
                    return (
                      <StationItem
                        key={station.id}
                        station={station}
                        activeStation={activeStation ? activeStation.id : ""}
                        handleActiveStation={() =>
                          handleActiveStation(station.id)
                        }
                      />
                    );
                  })
                ) : (
                  <>
                    <div className={`lessons-list__item mt-6`}>
                      <div className="lessons-list__item__info">
                        <div className="type--wgt--bold">
                          {t("STATIONS.EMPTY_STATIONS_TITLE")}
                        </div>
                        <div className="type--color--brand">
                          {t("STATIONS.EMPTY_STATIONS_LIST")}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="card--lessons__body__main flex">
              <div className="flex--primary w--50">
                {!stationLoading && (
                  <StationForm
                    activeStation={activeStation}
                    loading={stationLoading}
                    refresh={fetchData}
                  />
                )}
              </div>
            </div>
            {/*<div className="card--lessons__body__main flex flex--center flex--jc--center">
              {activeStation?.id ? (
                <StationDisplay station={activeStation} />
              ) : (
                <div className="flex--primary flex--jc--center flex--col w--100">
                  <img alt="" src={noResults} />
                  <div className="type type--color--tertiary">
                    {t("QUESTS.CHOOSE_QUEST")}
                  </div>
                </div>
              )}
            </div>
              */}
          </div>
        </div>
      </MainWrapper>
    </>
  );
};

export default CompletedLessons;
