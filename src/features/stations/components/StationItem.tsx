import { t } from "i18next";
import { setUncaughtExceptionCaptureCallback } from "process";

import IStation from "../../../interfaces/IStation";
import { getCategoryById } from "../../../lookups/categories";

interface Props {
  station: IStation;
  activeStation: string;
  handleActiveStation: (lessonId: string) => void;
}

const StationItem = (props: Props) => {
  const { station, activeStation, handleActiveStation } = props;
  return (
    <div
      key={station.id}
      className={`lessons-list__item ${
        activeStation === station.id ? "active" : ""
      }`}
      onClick={() => handleActiveStation(station.id)}
    >
      {station.images.length && (
        <img
          className="lessons-list__item__img"
          src={`https://${station.images[0]?.filePath.replace(
            "undefined:3000",
            process.env.REACT_APP_API
          )}`}
          alt="station"
        />
      )}
      <div className="lessons-list__item__info">
        <div className="type--wgt--bold">{station.name}</div>
        <div className="type--color--brand">
          {station.categories.map(
            (id, idx) =>
              `${getCategoryById(id)?.label}${
                idx + 1 < station.categories.length ? ", " : ""
              }`
          )}
        </div>
      </div>
      <div>{station.premium}</div>
    </div>
  );
};

export default StationItem;
