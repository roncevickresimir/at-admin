import { useTranslation } from "react-i18next";
import { Form, Formik, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import IUser from "../../../interfaces/IUser";
import MySelect from "../../components/form/MySelectField";
import MyTextArea from "../../components/form/MyTextArea";
import TextField from "../../components/form/TextField";
import {
  ICreateUser,
  useCreateUserMutation,
} from "../../../services/userService";
import { useEffect } from "react";
import { Role } from "../../../lookups/role";
import { getUserRoleAbrv } from "../../../app/utils/getUserData";

const UserForm: React.FC<any> = (props: any) => {
  const { user, refresh } = props;
  const { t } = useTranslation();
  const userRole = getUserRoleAbrv();

  const [createUser, { isSuccess: createUserSuccess }] =
    useCreateUserMutation();

  let userOptions: any = [];

  switch (userRole) {
    case Role.User: {
      userOptions = [{ label: "Object", value: Role.Object }];
      break;
    }
    case Role.Office: {
      userOptions = [
        { label: "User", value: Role.User },
        { label: "Object", value: Role.Object },
        { label: "Admin", value: Role.Admin },
      ];
      break;
    }
    default: {
      userOptions = [
        { label: "Admin", value: Role.Admin },
        { label: "Office", value: Role.Office },
        { label: "User", value: Role.User },
        { label: "Object", value: Role.Object },
      ];
      break;
    }
  }

  const initialValues: ICreateUser = {
    userName: user?.userName || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: user?.password || "",
    roleAbrv: user?.roleAbrv || "user",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: Yup.object().shape({}),
  });

  const handleSubmit = async (values: ICreateUser) => {
    await createUser({
      userName: `${values.firstName} ${values.lastName}`,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      roleAbrv: values.roleAbrv,
    });
  };

  return (
    <div className="layout--primary">
      <div>
        <FormikProvider value={formik}>
          <Form>
            <div className="field">
              <label className="field__label" htmlFor="firstName">
                {t("USERS.FORM.FIRST_NAME")}
              </label>
              <TextField
                name="firstName"
                id="firstName"
                placeholder={t("USERS.FORM.FIRST_NAME_PLACEHOLDER")}
                className="input input--base input--text input--icon"
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="lastName">
                {t("USERS.FORM.LAST_NAME")}
              </label>
              <TextField
                name="lastName"
                id="lastName"
                placeholder={t("USERS.FORM.LAST_NAME_PLACEHOLDER")}
                className="input input--base input--text input--icon"
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="mail">
                {t("USERS.FORM.MAIL")}
              </label>
              <TextField
                name="email"
                id="mail"
                placeholder={t("USERS.FORM.MAIL_PLACEHOLDER")}
                maxLength={500}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="password">
                {t("USERS.FORM.PASSWORD")}
              </label>
              <TextField
                name="password"
                id="password"
                placeholder={t("USERS.FORM.PASSWORD_PLACEHOLDER")}
                className="input input--base input--text input--icon"
                password={true}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="confirmPassword">
                {t("USERS.FORM.CONFIRM_PASSWORD")}
              </label>
              <TextField
                name="confirmPassword"
                id="confirmPassword"
                placeholder={t("USERS.FORM.CONFIRM_PASSWORD_PLACEHOLDER")}
                className="input input--base input--text input--icon"
                password={true}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="userRole">
                {t("USERS.FORM.USER_ROLE")}
              </label>
              <MySelect
                field={formik.getFieldProps("roleAbrv")}
                form={formik}
                meta={formik.getFieldMeta("roleAbrv")}
                classNamePrefix="onboarding-select"
                isMulti={false}
                options={userOptions}
                placeholder={t("USERS.FORM.USER_ROLE_PLACEHOLDER")}
              />
            </div>
            <div>
              <button className="btn btn--base btn--primary mr-4">
                {t("USERS.FORM.CREATE")}
              </button>
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
};

export default UserForm;
