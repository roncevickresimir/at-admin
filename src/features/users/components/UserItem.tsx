import { t } from "i18next";

import IUser from "../../../interfaces/IUser";

interface Props {
  user: any;
  activeUser: string;
  handleActiveUsers: (userId: string) => void;
}

const UserItem = (props: Props) => {
  const { user, activeUser, handleActiveUsers } = props;

  return (
    <div
      key={user.id}
      className={`lessons-list__item ${activeUser === user.id ? "active" : ""}`}
      onClick={() => handleActiveUsers(user.id)}
    >
      <div className="lessons-list__item__info">
        <div className="type--wgt--bold">{user.firstName}</div>
        <div className="type--color--brand">{user.lastName}</div>
      </div>
      <div>{user.role}</div>
    </div>
  );
};

export default UserItem;
