import { Form, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { useLoginMutation, ILogin } from "../../services/authService";
import { useAppSelector } from "../../app/hooks";
import { PATHS } from "../../app/routes";
import { getUserRoleAbrv } from "../../app/utils/getUserData";

import TextField from "../components/form/TextField";

import logo from "../../assets/logo.png";
import { Role } from "../../lookups/role";

import heroImg from "../../assets/images/hero.jpg";
import traveler from "../../assets/images/traveler.png";
interface Values {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>();
  const [
    login,
    {
      data: loginData,
      isSuccess: isSuccessLogin,
      isLoading: isLoadingLogin,
      error: errorLogin,
    },
  ] = useLoginMutation();

  const userToken = useAppSelector((state) => state.auth.token);

  const initialValues: Values = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values: ILogin) => {
      const data = {
        email: values.email,
        password: values.password,
      };
      login(data);
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required(t("FORM_VALIDATION.REQUIRED")),
      password: Yup.string()
        .min(2, t("FORM_VALIDATION.TOO_SHORT"))
        .max(50, t("FORM_VALIDATION.TOO_LONG"))
        .required(t("FORM_VALIDATION.REQUIRED")),
    }),
  });

  useEffect(() => {
    if (userToken) navigate(PATHS.QUESTS);
  }, []);

  useEffect(() => {
    if (!isSuccessLogin) return;

    switch (getUserRoleAbrv()) {
      case Role.Object:
        navigate(PATHS.STATIONS);
        break;
      default:
        navigate(PATHS.DASHBOARD);
        break;
    }
  }, [loginData]);

  useEffect(() => {
    const loginError: any = errorLogin;

    if (loginError) {
      setLoginErrorMessage(loginError.data.message);
    }
  }, [errorLogin]);

  return (
    <>
      <div className="login">
        <div className="login__aside">
          <img src={heroImg} alt="Hero Img" />
          <div className="download flex flex--center w--100 h--100 mt-20 p-12">
            <div className="flex flex--col pr-12 w--50">
              <div className="type type--xxl type--lh-1 type--color--white mb-5">
                Here by mistake?
              </div>
              <div className="type type--lg type--lh-1 type--color--white type--wgt--bold mb-5">
                <a
                  className="type type--lg type--lh-1 type--color--secondary type--wgt--bold mb-5"
                  href="https://avantourist.eu"
                >
                  Visit web
                </a>{" "}
                or get the app
              </div>

              <div className="flex mt-6">
                <div className="type type--wgt--bold btn btn--primary flex flex--center flex--jc--center mr-4 pl-6 pr-6 pt-3 pb-3">
                  Get on AppStore
                </div>
                <div className="type type--wgt--bold btn btn--ghost btn btn--ghost--white flex flex--center flex--jc--center pl-6 pr-6 pt-3 pb-3">
                  Get on PlayStore
                </div>
              </div>
            </div>
            <div>
              <img
                className="w--100"
                src={traveler}
                alt="traveler explorer tourist"
              ></img>
            </div>
          </div>
        </div>
        <div className="login__content">
          <div className="flex--grow w--448--max">
            <div className="mb-22">
              <img className="w--128" src={logo} alt="Teorem" />
            </div>
            <div className="type--lg type--wgt--bold mb-4">
              {t("LOGIN.TITLE")}
            </div>
            <FormikProvider value={formik}>
              <Form>
                <div className="field">
                  <label htmlFor="email" className="field__label">
                    {t("LOGIN.FORM.EMAIL")}
                  </label>
                  <TextField
                    name="email"
                    id="email"
                    placeholder={t("LOGIN.FORM.EMAIL_PLACEHOLDER")}
                    disabled={isLoadingLogin}
                  />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="password">
                    {t("LOGIN.FORM.PASSWORD")}
                  </label>
                  <TextField
                    name="password"
                    id="password"
                    placeholder={t("LOGIN.FORM.PASSWORD_PLACEHOLDER")}
                    className="input input--base input--text input--icon"
                    password={true}
                    disabled={isLoadingLogin}
                  />
                </div>
                {loginErrorMessage ? (
                  <div className="type--color--error">
                    {t(loginErrorMessage)}
                  </div>
                ) : (
                  <></>
                )}
                <button
                  className="btn btn--base btn--primary w--100 mb-2 mt-6 type--wgt--extra-bold"
                  type="submit"
                  disabled={isLoadingLogin}
                >
                  {t("LOGIN.FORM.SUBMIT_BTN")}
                </button>
              </Form>
            </FormikProvider>
          </div>
          <div className="flex--primary mt-8 w--448--max">
            <div className="type--color--tertiary">{t("WATERMARK")}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
