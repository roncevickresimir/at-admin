import { useTranslation } from "react-i18next";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import IStation from "../../../interfaces/IStation";
import MySelect from "../../components/form/MySelectField";
import MyTextArea from "../../components/form/MyTextArea";
import TextField from "../../components/form/TextField";
import UploadFile from "../../components/form/MyUploadField";
import MyLocationInput from "../../components/form/MyLocationInput";
import { getUserId } from "../../../app/utils/getUserData";
import {
  useCreateStationMutation,
  useDeleteStationMutation,
  useUpdateStationMutation,
} from "../../../services/stationService";
import Alert from "../../components/alert";
import { useEffect, useState } from "react";
import { useLazyGetCategoriesQuery } from "../../../services/categoryService";
import useCategories, { getCategoryById } from "../../../lookups/categories";

const StationForm: any = (props: any) => {
  const { activeStation, loading, refresh } = props;
  const station = activeStation;

  const { t } = useTranslation();
  const [alert, setAlert] = useState<string | boolean>();
  const [categoryOptions, setCategoryOptions] = useState<any>(useCategories);

  const [
    createStation,
    { isSuccess: createStationSuccess, isError: createStationError },
  ] = useCreateStationMutation();
  const [
    updateStation,
    { isSuccess: updateStationSuccess, isError: updateStationError },
  ] = useUpdateStationMutation();
  const [
    deleteStation,
    { isSuccess: deleteStationSuccess, isError: deleteStationError },
  ] = useDeleteStationMutation();
  const [getCategories] = useLazyGetCategoriesQuery();

  const initialValues: IStation = {
    id: station?.id || "",
    name: station?.name || "",
    description: station?.description || "",
    categories: station?.categories || [],
    published: station?.published || true,
    premium: station?.premium || false,
    images: station?.images || [],
    user: station?.user || "",
    location: station?.location || {
      lat: 44.1174919589792,
      lng: 15.219765115932233,
    },
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: Yup.object().shape({}),
  });

  const handleSubmit = async (values: IStation) => {
    station?.id
      ? await updateStation({
          id: station.id,
          accountId: values.user ? values.user : getUserId(),
          title: values.name,
          description: values.description,
          categoryIds: [values.categories],
          images: values.images,
          premium: values.premium,
          published: values.published,
          latitude: values.location.lat,
          longitude: values.location.lng,
        })
      : await createStation({
          accountId: values.user ? values.user : getUserId(),
          title: values.name,
          description: values.description,
          categoryIds: [values.categories],
          images: values.images,
          premium: values.premium,
          published: values.published,
          latitude: values.location.lat,
          longitude: values.location.lng,
        });
  };

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

  const handleDeleteStation = async () => {
    await deleteStation(station?.id);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (createStationSuccess || updateStationSuccess || deleteStationSuccess) {
      setAlert("success");
      refresh();
    }
    createStationError && setAlert("");
  }, [
    createStationSuccess,
    createStationError,
    updateStationSuccess,
    deleteStationSuccess,
  ]);

  const handleCloseAlert = () => {
    setAlert(false);
  };

  return (
    <div className="layout--primary  w--100">
      <div>
        <FormikProvider value={formik}>
          <Form>
            <div className="field">
              <label className="field__label" htmlFor="password">
                {t("STATIONS.FORM.NAME")}
              </label>
              <TextField
                name="name"
                id="name"
                placeholder={t("STATIONS.FORM.NAME_PLACEHOLDER")}
                className="input input--base input--text input--icon"
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="password">
                {t("STATIONS.FORM.DESCRIPTION")}
              </label>
              <MyTextArea
                name="description"
                id="description"
                placeholder={t("STATIONS.FORM.DESCRIPTION_PLACEHOLDER")}
                maxLength={500}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="password">
                {t("STATIONS.FORM.IMAGE")}
              </label>
              <UploadFile
                setFieldValue={formik.setFieldValue}
                id="images"
                name="images"
                value={station?.images}
                //disabled={isLoading}
                imagePreview={station?.images}
                removePreviewOnUnmount={true}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="categories">
                {t("STATIONS.FORM.CATEGORY")}
              </label>
              <MySelect
                field={formik.getFieldProps("categories")}
                form={formik}
                meta={formik.getFieldMeta("categories")}
                classNamePrefix="categories-select"
                isMulti={true}
                options={categoryOptions}
                placeholder={t("STATIONS.FORM.CATEGORY_PLACEHOLDER")}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="categories">
                {t("STATIONS.FORM.LOCATION")}
              </label>
              <MyLocationInput
                field={formik.getFieldProps("location")}
                meta={formik.getFieldMeta("location")}
                form={formik}
              />
            </div>
            <div>
              <button className="btn btn--base btn--primary mr-4 mb-8">
                {station?.id
                  ? t("STATIONS.FORM.EDIT")
                  : t("STATIONS.FORM.CREATE")}
              </button>
              {station?.id && (
                <button
                  onClick={handleDeleteStation}
                  className="btn btn--base btn--error mr-4"
                >
                  {t("STATIONS.FORM.DELETE")}
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

export default StationForm;
