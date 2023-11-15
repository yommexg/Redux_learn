import { useSelector } from "react-redux";
// import { selectPostIds, getPostError, getPostStatus } from "./postSlice";
import { useGetPostsQuery, selectPostIds } from "./postSlice";

import PostExcerpt from "./PostExcerpt";

const PostList = () => {
  // const posts = useSelector(selectAllPosts);
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();
  const orderedPostIds = useSelector(selectPostIds);
  // const postStatus = useSelector(getPostStatus);
  //const error = useSelector(getPostError);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return <section> {content}</section>;
};

export default PostList;
