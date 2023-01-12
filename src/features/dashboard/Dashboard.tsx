import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import IQuest from "../../interfaces/IQuest";
import {
  IGetQuestsPayload,
  useLazyGetQuestByIdQuery,
  useLazyGetQuestsQuery,
} from "../../services/questService";
import MainWrapper from "../components/MainWrapper";
import LoaderAvailableLessons from "../components/skeleton-loaders/LoaderAvailableLessons";
import QuestItem from "../quests/components/QuestItem";

const Dashboard = () => {
  const { t } = useTranslation();

  const [quests, setQuests] = useState<IQuest[]>([]);

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
                <div className="w--100">{t("DASHBOARD.TITLE")}</div>
              </div>
            </div>
            <div className="card--lessons__body__main flex">
              <div className="flex--primary w--100">
                <div className="w--100">{t("DASHBOARD.QUESTS")}</div>

                <div className="lessons-list">
                  {listLoading ? (
                    <LoaderAvailableLessons />
                  ) : quests.length > 0 ? (
                    quests.map((lesson: IQuest) => {
                      return (
                        <QuestItem
                          key={lesson.id}
                          quest={lesson}
                          activeQuest={""}
                          handleActiveQuest={() => {
                            return;
                          }}
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
            </div>
          </div>
        </div>
      </MainWrapper>
    </>
  );
};

export default Dashboard;
