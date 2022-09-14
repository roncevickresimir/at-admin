import { t } from "i18next";
import { apiUrl } from "../../../app/baseService";
import IQuest from "../../../interfaces/IQuest";

interface Props {
  quest: IQuest;
  activeQuest: string;
  handleActiveQuest: (lessonId: string) => void;
}

const QuestItem = (props: Props) => {
  const { quest, activeQuest, handleActiveQuest } = props;

  return (
    <div
      key={quest.id}
      className={`lessons-list__item ${
        activeQuest === quest.id ? "active" : ""
      }`}
      onClick={() => handleActiveQuest(quest.id)}
    >
      <img className="lessons-list__item__img" src={quest.image} alt="quest" />
      <div className="lessons-list__item__info">
        <div className="type--wgt--bold">{quest.name}</div>
        <div className="type--color--brand">{quest.categories[0]}</div>
      </div>
      <div>{quest.published}</div>
    </div>
  );
};

export default QuestItem;
