// import { selectAllUsers } from "./usersSlice";

import { useGetUsersQuery } from "./usersSlice";
import { Link } from "react-router-dom";

const UserLists = () => {
  // const users = useSelector(selectAllUsers);
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    const renderedUsers = users.ids.map((userId) => (
      <li key={userId}>
        <Link to={`/user/${userId}`}>{users.entities[userId].name}</Link>
      </li>
    ));
    content = (
      <section>
        <h2>Users</h2>
        <ul>{renderedUsers}</ul>
      </section>
    );
  } else if (isError) {
    content = <p>{error}</p>;
  }

  // const renderedUsers = users.map((user) => (
  //   <li key={user.id}>
  //     <Link to={`/user/${user.id}`}>{user.name}</Link>
  //   </li>
  // ));
  return content;
};

export default UserLists;
