/* eslint-disable react/prop-types */
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButton from "./ReactionButton";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postSlice";

const PostExcerpt = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));

  return (
    <article>
      <h3>{post.title}</h3>
      <p className="excerpt">{post.body.substring(0, 70)}</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>{" "}
        <PostAuthor userId={post.userId} />
        <TimeAgo timeStamp={post.date} />
      </p>
      <ReactionButton post={post} />
    </article>
  );
};

// PostExcerpt = memo(PostExcerpt);

export default PostExcerpt;
