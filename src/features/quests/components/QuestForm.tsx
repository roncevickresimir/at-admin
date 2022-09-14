import { useTranslation } from "react-i18next";
import { Form, Formik, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import IQuest from "../../../interfaces/IQuest";
import MySelect from "../../components/form/MySelectField";
import MyTextArea from "../../components/form/MyTextArea";
import TextField from "../../components/form/TextField";
import UploadFile from "../../components/form/MyUploadField";
import useCategories, { getCategoryById } from "../../../lookups/categories";
import { useEffect, useState } from "react";
import { useLazyGetStationsQuery } from "../../../services/stationService";
import { useLazyGetRewardsQuery } from "../../../services/rewardService";
import {
  useCreateQuestMutation,
  useDeleteQuestMutation,
  useUpdateQuestMutation,
} from "../../../services/questService";
import { useLazyGetUsersQuery } from "../../../services/userService";
import Alert from "../../components/alert";
import { getUserId } from "../../../app/utils/getUserData";
import {
  ICategory,
  useLazyGetCategoriesQuery,
} from "../../../services/categoryService";

const QuestForm: React.FC<any> = (props: any) => {
  const { quest, loading, refresh } = props;

  const { t } = useTranslation();

  const [categoryOptions, setCategoryOptions] = useState<any>(useCategories);
  const [stationSelectOptions, setStationSelectOptions] = useState<any>([]);
  const [rewardSelectOptions, setRewardSelectOptions] = useState<any>([]);
  const [userSelectOptions, setUserSelectOptions] = useState<any>([]);
  const [alert, setAlert] = useState<string | boolean>();
  const [getStations] = useLazyGetStationsQuery();
  const [getRewards] = useLazyGetRewardsQuery();

  const [getCategories] = useLazyGetCategoriesQuery();
  const [getUsers] = useLazyGetUsersQuery();
  const [
    createQuest,
    { isSuccess: createQuestSuccess, isError: createQuestError },
  ] = useCreateQuestMutation();
  const [
    updateQuest,
    { isSuccess: updateQuestSuccess, isError: updateQuestError },
  ] = useUpdateQuestMutation();
  const [
    deleteQuest,
    { isSuccess: deleteQuestSuccess, isError: deleteQuestError },
  ] = useDeleteQuestMutation();

  const userId = getUserId();

  const initialValues: IQuest = {
    id: quest?.id || "",
    name: quest?.name || "",
    description: quest?.description || "",
    categories: quest?.categories,
    stations: quest?.stations || [],
    userId: quest?.userId || userId,
    location: { lat: 0.0, lng: 0.0 },
    published: quest?.published || true,
    image: quest?.image || "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values: IQuest) => handleSubmit(values),
    validationSchema: Yup.object().shape({}),
  });

  const handleSubmit = async (values: IQuest) => {
    !quest?.id
      ? await createQuest({
          title: values.name,
          description: values.description,
          categoryIds: values.categories,
          stationIds: values.stations,
          userId: values.userId ? values.userId : userId,
          latitude: "1.23",
          longitude: "1.23",
          disabled: !values.published,
          image: values.image,
        })
      : await updateQuest({
          id: values.id,
          title: values.name,
          description: values.description,
          categoryIds: values.categories,
          stationIds: values.stations,
          userId: "",
          latitude: "1.23",
          longitude: "1.23",
          disabled: !values.published,
          image: values.image,
        });
  };

  const fetchData = async () => {
    const getCategoriesResponse = await getCategories(null).unwrap();

    let tCategories: any = [];
    getCategoriesResponse.forEach((c) => {
      tCategories.push({
        label: c.name,
        value: c.id,
      });
    });
    setCategoryOptions(tCategories);

    const stations = await getStations({
      page: 1,
      rpp: 100,
      search: "",
    }).unwrap();

    let tStations: any = [];
    stations.forEach((station) => {
      tStations.push({
        label: station.name,
        value: station.id,
      });
    });
    setStationSelectOptions(tStations);

    const rewards = await getRewards({
      page: 1,
      rpp: 100,
      search: "",
    }).unwrap();

    let tRewards: any = [];
    rewards.forEach((reward) => {
      tRewards.push({
        label: reward.name,
        value: reward.id,
      });
    });
    setRewardSelectOptions(tRewards);

    const users = await getUsers({
      page: 1,
      rpp: 100,
      search: "",
    }).unwrap();

    let tUsers: any = [];
    users.forEach((user: any) => {
      tUsers.push({
        label: user.userName,
        value: user.id,
      });
    });
    setUserSelectOptions(tUsers);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (createQuestSuccess || updateQuestSuccess || deleteQuestSuccess) {
      setAlert("success");
      refresh();
    }
    createQuestError && setAlert("");
  }, [
    createQuestSuccess,
    createQuestError,
    updateQuestSuccess,
    deleteQuestSuccess,
  ]);

  const handleDeleteQuest = async () => {
    await deleteQuest(quest?.id);
  };

  const handleCloseAlert = () => {
    setAlert(false);
  };

  return (
    <div className="layout--primary w--100">
      <div>
        <FormikProvider value={formik}>
          <Form>
            <div className="field">
              <label className="field__label" htmlFor="password">
                {t("QUESTS.FORM.NAME")}
              </label>
              <TextField
                name="name"
                id="name"
                placeholder={t("QUESTS.FORM.NAME_PLACEHOLDER")}
                className="input input--base input--text input--icon"
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="password">
                {t("QUESTS.FORM.DESCRIPTION")}
              </label>
              <MyTextArea
                name="description"
                id="description"
                placeholder={t("QUESTS.FORM.DESCRIPTION_PLACEHOLDER")}
                maxLength={500}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="image">
                {t("QUESTS.FORM.IMAGE")}
              </label>
              <UploadFile
                setFieldValue={formik.setFieldValue}
                id="image"
                name="image"
                value={quest?.image}
                //disabled={isLoading}
                imagePreview={quest?.image}
                removePreviewOnUnmount={true}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="categories">
                {t("QUESTS.FORM.CATEGORY")}
              </label>
              <MySelect
                field={formik.getFieldProps("categories")}
                form={formik}
                meta={formik.getFieldMeta("categories")}
                classNamePrefix="categories-select"
                isMulti={true}
                options={categoryOptions}
                placeholder={t("QUESTS.FORM.CATEGORY_PLACEHOLDER")}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="stations">
                {t("QUESTS.FORM.STATIONS")}
              </label>
              <MySelect
                field={formik.getFieldProps("stations")}
                form={formik}
                meta={formik.getFieldMeta("stations")}
                classNamePrefix="stations-select"
                isMulti={true}
                options={stationSelectOptions ? stationSelectOptions : []}
                customValue={quest?.stations}
                placeholder={t("QUESTS.FORM.STATIONS_PLACEHOLDER")}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="rewards">
                {t("QUESTS.FORM.REWARD")}
              </label>
              <MySelect
                field={formik.getFieldProps("rewards")}
                form={formik}
                meta={formik.getFieldMeta("rewards")}
                classNamePrefix="rewards-select"
                isMulti={true}
                options={rewardSelectOptions ? rewardSelectOptions : []}
                placeholder={t("QUESTS.FORM.REWARD_PLACEHOLDER")}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="user">
                {t("QUESTS.FORM.USER")}
              </label>
              <MySelect
                field={formik.getFieldProps("user")}
                form={formik}
                meta={formik.getFieldMeta("user")}
                classNamePrefix="user-select"
                isMulti={true}
                options={userSelectOptions ? userSelectOptions : []}
                placeholder={t("QUESTS.FORM.USER_PLACEHOLDER")}
              />
            </div>
            <div>
              <button className="btn btn--base btn--primary mr-4 mb-8">
                {quest?.id ? t("QUESTS.FORM.EDIT") : t("QUESTS.FORM.CREATE")}
              </button>
              {quest?.id && (
                <button
                  onClick={handleDeleteQuest}
                  className="btn btn--base btn--error mr-4"
                >
                  {t("QUESTS.FORM.DELETE")}
                </button>
              )}
            </div>
          </Form>
        </FormikProvider>
        {alert && <Alert type={alert} handleClick={handleCloseAlert} />}
      </div>
    </div>
  );
};

export default QuestForm;
