import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MainWrapper from "../components/MainWrapper";
import LoaderAvailableLessons from "../components/skeleton-loaders/LoaderAvailableLessons";
import {
  useLazyGetRewardsQuery,
  IGetRewardsPayload,
  useLazyGetRewardByIdQuery,
} from "../../services/rewardService";
import RewardItem from "./components/RewardItem";
import RewardForm from "./components/RewardForm";
import IReward from "../../interfaces/IReward";
import noResults from "../../assets/images/noResults.svg";

const Rewards = () => {
  const { t } = useTranslation();

  const [
    getRewards,
    { isLoading: listLoading, isUninitialized: listUninitialized },
  ] = useLazyGetRewardsQuery();
  const [getReward] = useLazyGetRewardByIdQuery();

  const [getRewardsPayload, setGetRewardsPayload] =
    useState<IGetRewardsPayload>({
      search: "",
      page: 1,
      rpp: 10,
    });

  const [activeReward, setActiveReward] = useState<IReward | null>(null);
  const [rewards, setRewards] = useState<IReward[]>([]);

  const loadingList = listLoading || listUninitialized;

  const handleActiveReward = async (rewardId: string) => {
    if (rewards) {
      const getRewardResponse = await getReward(rewardId).unwrap();
      setActiveReward(getRewardResponse);

      // handle
    }
  };

  const fetchData = async () => {
    const rewardsResponse = await getRewards(getRewardsPayload).unwrap();
    setRewards(rewardsResponse);
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
                <div>{t("REWARDS.TITLE")}</div>
              </div>
              <div className="mt-10 mb-10 ml-6 mr-6">
                <span className="type--uppercase type--color--tertiary">
                  {t("REWARDS.REWARDS_AVAILABLE")}
                </span>
                <span className="tag--primary d--ib ml-2">
                  {rewards.length ? rewards.length : "0"}
                </span>
              </div>
              <div className="lessons-list">
                {loadingList ? (
                  <LoaderAvailableLessons />
                ) : rewards.length > 0 ? (
                  rewards.map((item: IReward) => {
                    return (
                      <RewardItem
                        key={item.id}
                        activeReward={activeReward ? activeReward.id : ""}
                        handleActiveReward={handleActiveReward}
                        reward={item}
                      />
                    );
                  })
                ) : (
                  <>
                    <div className={`lessons-list__item mt-6`}>
                      <div className="lessons-list__item__info">
                        <div className="type--wgt--bold">
                          {t("REWARDS.EMPTY_REWARDS_TITLE")}
                        </div>
                        <div className="type--color--brand">
                          {t("REWARDS.EMPTY_REWARDS_LIST")}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="card--lessons__body__main flex">
              <div className="flex--primary w--100">
                <RewardForm activeReward={activeReward} refresh={fetchData} />
              </div>
            </div>
            {/*<div className="card--lessons__body__main flex">
              {activeReward ? (
                <div className="flex--primary flex--jc--center flex--col w--100">
                  <img src={noResults} />
                  <div className="type type--color--tertiary">
                    {t("REWARDS.CHOOSE_REWARD")}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex--primary flex--jc--center flex--col w--100">
                    <img src={noResults} />
                    <div className="type type--color--tertiary">
                      {t("REWARDS.CHOOSE_REWARD")}
                    </div>
                  </div>
                </>
              )}
            </div>*/}
          </div>
        </div>
      </MainWrapper>
    </>
  );
};

export default Rewards;
