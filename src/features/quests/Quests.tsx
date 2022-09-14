import { useTranslation } from "react-i18next";
import { cloneDeep, groupBy } from "lodash";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import MainWrapper from "../components/MainWrapper";
import LoaderAvailableLessons from "../components/skeleton-loaders/LoaderAvailableLessons";
import { useAppSelector } from "../../app/hooks";
import { PATHS } from "../../app/routes";
import {
  useLazyGetQuestsQuery,
  IGetQuestsPayload,
  useLazyGetQuestByIdQuery,
} from "../../services/questService";
import QuestItem from "./components/QuestItem";
import QuestForm from "./components/QuestForm";
import IQuest from "../../interfaces/IQuest";
import noResults from "../../assets/images/noResults.svg";

const CompletedLessons = () => {
  const { t } = useTranslation();

  const [
    getQuests,
    { isLoading: listLoading, isUninitialized: listUninitialized },
  ] = useLazyGetQuestsQuery();
  const [getQuest] = useLazyGetQuestByIdQuery();

  const [getQuestsPayload, setGetQuestsPayload] = useState<IGetQuestsPayload>({
    search: "",
    page: 1,
    rpp: 10,
  });

  const [activeQuest, setActiveQuest] = useState<IQuest | null>(null);
  const [quests, setQuests] = useState<IQuest[]>([]);

  const loadingList = listLoading || listUninitialized;

  const handleActiveQuest = async (questId: string) => {
    if (quests) {
      const getQuestResponse = await getQuest(questId).unwrap();
      setActiveQuest(getQuestResponse);
    }
  };

  const fetchData = async () => {
    const getQuestsResponse = await getQuests(getQuestsPayload).unwrap();
    setQuests(getQuestsResponse);
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
                  {t("QUESTS.TITLE")}
                  {activeQuest?.id && (
                    <button
                      onClick={() => setActiveQuest(null)}
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
                  {t("QUESTS.QUESTS_AVAILABLE")}
                </span>
                <span className="tag--primary d--ib ml-2">
                  {quests.length ? quests.length : "0"}
                </span>
              </div>
              <div className="lessons-list">
                {loadingList ? (
                  <LoaderAvailableLessons />
                ) : quests.length > 0 ? (
                  quests.map((lesson: IQuest) => {
                    return (
                      <QuestItem
                        key={lesson.id}
                        quest={lesson}
                        activeQuest={activeQuest ? activeQuest.id : ""}
                        handleActiveQuest={(val) => handleActiveQuest(val)}
                      />
                    );
                  })
                ) : (
                  <>
                    <div className={`lessons-list__item mt-6`}>
                      <div className="lessons-list__item__info">
                        <div className="type--wgt--bold">
                          {t("QUESTS.EMPTY_QUESTS_TITLE")}
                        </div>
                        <div className="type--color--brand">
                          {t("QUESTS.EMPTY_QUESTS_LIST")}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="card--lessons__body__main flex">
              <div className="flex--primary w--50">
                <QuestForm quest={activeQuest} refresh={fetchData} />
              </div>
            </div>
            {/*
            <div className="card--lessons__body__main flex">
              {activeQuest ? (
                <div className="flex--primary flex--jc--center flex--col w--100">
                  <img src={noResults} />
                  <div className="type type--color--tertiary">
                    {t("QUESTS.CHOOSE_QUEST")}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex--primary flex--jc--center flex--col w--100">
                    <img src={noResults} />
                    <div className="type type--color--tertiary">
                      {t("QUESTS.CHOOSE_QUEST")}
                    </div>
                  </div>
                </>
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
