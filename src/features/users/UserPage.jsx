// import { useSelector } from "react-redux";
// import { selectUserById } from "./usersSlice";
// import { selectPostsByUsers } from "../posts/postSlice";
import { Link, useParams } from "react-router-dom";
import { useGetPostByUserIdQuery } from "../posts/postSlice";
import { useGetUsersQuery } from "./usersSlice";

const UserPage = () => {
  const { userId } = useParams();
  // const user = useSelector((state) => selectUserById(state, Number(userId)));

  // const postsForUser = useSelector((state) =>
  //   selectPostsByUsers(state, Number(userId))
  // );
  const {
    user,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
    isError: isErrorUser,
    error: errorUser,
  } = useGetUsersQuery("getUsers", {
    selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
      user: data?.entities[userId],
      isLoading,
      isSuccess,
      isError,
      error,
    }),
  });

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostByUserIdQuery(userId);

  let content;
  if (isLoading || isLoadingUser) {
    content = <p>Loading...</p>;
  } else if (isSuccess && isSuccessUser) {
    const { ids, entities } = postsForUser;
    content = (
      <section>
        <h2>{user?.name}</h2>
        <ol>
          {ids.map((id) => (
            <li key={id}>
              <Link to={`/post/${id}`}>{entities[id].title}</Link>
            </li>
          ))}
        </ol>
      </section>
    );
  } else if (isError || isErrorUser) {
    content = <p>{error || errorUser}</p>;
  }

  //  return (
  //    <section>
  //      <h2 onClick={() => console.log(postsForUser)}>{user?.name}</h2>

  //      <ol>{content}</ol>
  //    </section>
  //  );

  return content;
};
// const postTitles = postsForUser.map((post) => (
//   <li key={post.id}>
//     <Link to={`/post/${post.id}`}>{post.title}</Link>
//   </li>
// ));

export default UserPage;
