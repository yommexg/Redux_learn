/* eslint-disable react/prop-types */
// import { useDispatch } from "react-redux";
// import { reactionAdded } from "./postSlice";

import { useAddReactionMutation } from "./postSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButton = ({ post }) => {
  // const dispatch = useDispatch();
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButtons"
        onClick={
          () => {
            const newValue = post.reactions[name] + 1;
            addReaction({
              postId: post.id,
              reactions: { ...post.reactions, [name]: newValue },
            });
          }

          // dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactionButton;
