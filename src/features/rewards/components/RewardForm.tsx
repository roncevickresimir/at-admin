import { useTranslation } from "react-i18next";
import { Form, Formik, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import IReward from "../../../interfaces/IReward";
import {
  useCreateRewardMutation,
  useDeleteRewardMutation,
  useUpdateRewardMutation,
} from "../../../services/rewardService";
import { useLazyGetStationsQuery } from "../../../services/stationService";
import MyTextArea from "../../components/form/MyTextArea";
import MySelect from "../../components/form/MySelectField";
import TextField from "../../components/form/TextField";
import { useEffect, useState } from "react";
import Alert from "../../components/alert";
import UploadFile from "../../components/form/MyUploadField";
import { getUserId } from "../../../app/utils/getUserData";

const RewardForm: React.FC<any> = (props: any) => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<string | boolean>();
  const [stationSelectOptions, setStationSelectOptions] = useState<any>([]);

  const { activeReward, loading, refresh } = props;
  const reward = activeReward;

  const userId = getUserId();

  const [
    createReward,
    { isSuccess: createRewardSuccess, isError: createRewardError },
  ] = useCreateRewardMutation();
  const [
    updateReward,
    { isSuccess: updateRewardSuccess, isError: updateRewardError },
  ] = useUpdateRewardMutation();
  const [
    deleteReward,
    { isSuccess: deleteRewardSuccess, isError: deleteRewardError },
  ] = useDeleteRewardMutation();
  const [getStations] = useLazyGetStationsQuery();

  const initialValues: IReward = {
    id: reward?.id || "",
    name: reward?.name || "",
    description: reward?.description || "",
    stationId: reward?.stationId || "",
    image: reward?.image,
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: Yup.object().shape({}),
  });

  const handleSubmit = async (values: IReward) => {
    const data = {
      id: values.id,
      name: values.name,
      description: values.description,
      stationId: values.stationId,
      image: values.image,
    };
    !activeReward?.id ? await createReward(data) : await updateReward(data);
  };

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (createRewardSuccess || updateRewardSuccess || deleteRewardSuccess) {
      setAlert("success");
      refresh();
    }
    createRewardError && setAlert("");
  }, [
    createRewardSuccess,
    createRewardError,
    updateRewardSuccess,
    deleteRewardSuccess,
  ]);

  const handleDeleteReward = () => {
    deleteReward(activeReward.id);
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
                {t("REWARDS.FORM.NAME")}
              </label>
              <TextField
                name="name"
                id="name"
                placeholder={t("REWARDS.FORM.NAME_PLACEHOLDER")}
                className="input input--base input--text input--icon"
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="password">
                {t("REWARDS.FORM.DESCRIPTION")}
              </label>
              <MyTextArea
                name="description"
                id="description"
                placeholder={t("REWARDS.FORM.DESCRIPTION_PLACEHOLDER")}
                maxLength={500}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="stationId">
                {t("REWARDS.FORM.STATION")}
              </label>
              <MySelect
                field={formik.getFieldProps("stationId")}
                form={formik}
                meta={formik.getFieldMeta("stationId")}
                classNamePrefix="stationId-select"
                isMulti={false}
                options={stationSelectOptions ? stationSelectOptions : []}
                placeholder={t("REWARDS.FORM.STATION_PLACEHOLDER")}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="password">
                {t("STATIONS.FORM.IMAGE")}
              </label>
              <UploadFile
                setFieldValue={formik.setFieldValue}
                id="image"
                name="image"
                value={reward?.image}
                //disabled={isLoading}
                imagePreview={reward?.image}
                removePreviewOnUnmount={true}
              />
            </div>
            <div>
              <button className="btn btn--base btn--primary mr-4 mb-8">
                {reward?.id ? t("REWARDS.FORM.EDIT") : t("REWARDS.FORM.CREATE")}
              </button>
              {reward?.id && (
                <button
                  onClick={handleDeleteReward}
                  className="btn btn--base btn--error mr-4"
                >
                  {t("REWARDS.FORM.DELETE")}
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

export default RewardForm;
