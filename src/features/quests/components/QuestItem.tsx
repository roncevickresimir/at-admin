import { useState, useEffect } from "react";
import IQuest from "../../../interfaces/IQuest";
import useCategories, { getCategoryById } from "../../../lookups/categories";
import { useLazyGetCategoriesQuery } from "../../../services/categoryService";

interface Props {
  quest: IQuest;
  activeQuest: string;
  handleActiveQuest: (lessonId: string) => void;
}

const QuestItem = (props: Props) => {
  const { quest, activeQuest, handleActiveQuest } = props;

  const [categoryOptions, setCategoryOptions] = useState<any>(useCategories);
  const [getCategories] = useLazyGetCategoriesQuery();

  const fetchData = async () => {
    const getCategoriesResponse = await getCategories(null).unwrap();

    let tCategories: any = [];
    getCategoriesResponse.forEach((c: any) => {
      tCategories.push({
        label: c.name,
        value: c.id,
      });
    });
    setCategoryOptions(tCategories);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <div className="type--color--brand">
          {quest.categories.map((id: any) => {
            console.log(
              categoryOptions.filter((category: any) => category.value === id)
            );
            return (
              <div key={id} className="tag--primary d--ib ml-2">
                {`${
                  categoryOptions.filter(
                    (category: any) => category.value === id
                  )[0]?.label
                }`}
              </div>
            );
          })}
        </div>
      </div>
      <div>{quest.published}</div>
    </div>
  );
};

export default QuestItem;
