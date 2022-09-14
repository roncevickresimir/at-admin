import { useTranslation } from "react-i18next";
import { cloneDeep, groupBy } from "lodash";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import MainWrapper from "../components/MainWrapper";
import LoaderAvailableLessons from "../components/skeleton-loaders/LoaderAvailableLessons";
import { useAppSelector } from "../../app/hooks";
import { PATHS } from "../../app/routes";
import IUser from "../../interfaces/IUser";
import {
  useLazyGetUsersQuery,
  IGetUsersPayload,
} from "../../services/userService";
import UserItem from "./components/UserItem";
import UserForm from "./components/UserForm";
import noResults from "../../assets/images/noResults.svg";

const Users = () => {
  const { t } = useTranslation();

  const [
    getUsers,
    { isLoading: listLoading, isUninitialized: listUninitialized },
  ] = useLazyGetUsersQuery();

  const [getUsersPayload, setGetUsersPayload] = useState<IGetUsersPayload>({
    search: "",
    page: 1,
    rpp: 10,
  });

  const [activeUser, setActiveUser] = useState<IUser | null>(null);
  const [usersState, setUsersState] = useState<IUser[]>([]);

  const loadingList = listLoading || listUninitialized;

  const handleActiveUsers = async (lessonId: string) => {
    if (usersState) {
      const currentlyActiveUser = usersState.find(
        (currentUser: IUser) => currentUser.id === lessonId
      );
      setActiveUser(currentlyActiveUser ? currentlyActiveUser : null);

      // handle
    }
  };

  const fetchData = async () => {
    const usersResponse = await getUsers(getUsersPayload).unwrap();
    setUsersState(usersResponse);
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
                <div>{t("USERS.TITLE")}</div>
              </div>
              <div className="mt-10 mb-10 ml-6 mr-6">
                <span className="type--uppercase type--color--tertiary">
                  {t("USERS.USERS_AVAILABLE")}
                </span>
                <span className="tag--primary d--ib ml-2">
                  {usersState.length ? usersState.length : "0"}
                </span>
              </div>
              <div className="lessons-list">
                {loadingList ? (
                  <LoaderAvailableLessons />
                ) : usersState.length > 0 ? (
                  usersState.map((user: IUser) => {
                    return (
                      <UserItem
                        key={user.id}
                        user={user}
                        activeUser={activeUser ? activeUser.id : ""}
                        handleActiveUsers={handleActiveUsers}
                      />
                    );
                  })
                ) : (
                  <>
                    <div className={`lessons-list__item mt-6`}>
                      <div className="lessons-list__item__info">
                        <div className="type--wgt--bold">
                          {t("USERS.EMPTY_USERS_TITLE")}
                        </div>
                        <div className="type--color--brand">
                          {t("USERS.EMPTY_USERS_LIST")}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="card--lessons__body__main">
              <div className="tutor-list__no-results">
                <UserForm user={activeUser} refresh={fetchData} />
              </div>
            </div>
            <div className="card--lessons__body__main flex">
              {activeUser ? (
                <div className="flex--primary flex--jc--center flex--col w--100">
                  <img src={noResults} />
                  <div className="type type--color--tertiary">
                    {t("USERS.CHOOSE_USER")}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex--primary flex--jc--center flex--col w--100">
                    <img src={noResults} />
                    <div className="type type--color--tertiary">
                      {t("USERS.CHOOSE_USER")}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </MainWrapper>
    </>
  );
};

export default Users;
