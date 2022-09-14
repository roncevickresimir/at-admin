import { t } from "i18next";
import { useEffect, useState } from "react";

import IReward from "../../../interfaces/IReward";
import { useLazyGetStationByIdQuery } from "../../../services/stationService";

interface Props {
  reward: IReward | null;
  activeReward: string;
  handleActiveReward: (rewardId: string) => void;
}

const RewardItem = (props: Props) => {
  const { reward, activeReward, handleActiveReward } = props;
  const [getStation] = useLazyGetStationByIdQuery();
  const [stationName, setStationName] = useState<any>("");

  const fetchData = async () => {
    const station = await getStation(reward?.stationId || "").unwrap();
    setStationName(station.name);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      key={reward?.name}
      className={`lessons-list__item ${
        activeReward === reward?.name ? "active" : ""
      }`}
      onClick={() => handleActiveReward(reward?.id || "")}
    >
      <div className="lessons-list__item__info">
        <div className="type--wgt--bold">{reward?.name}</div>
        <div className="type--color--brand">{stationName}</div>
      </div>
      <div>{}</div>
    </div>
  );
};

export default RewardItem;
