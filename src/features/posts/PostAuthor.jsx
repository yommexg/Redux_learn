// import { useSelector } from "react-redux";
// import { selectAllUsers } from "../users/usersSlice";
import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../users/usersSlice";

// eslint-disable-next-line react/prop-types
const PostAuthor = ({ userId }) => {
  // const users = useSelector(selectAllUsers);

  // const author = users.find((user) => user.id === userId);

  const { user: author } = useGetUsersQuery("getUsers", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });
  return (
    <span>
      by{" "}
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown Author"
      )}
    </span>
  );
};

export default PostAuthor;
