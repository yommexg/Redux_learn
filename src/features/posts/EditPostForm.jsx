import { useState } from "react";
import { useSelector } from "react-redux";
import { selectPostById } from "./postSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../users/usersSlice";

import { useUpdatePostMutation, useDeletePostMutation } from "./postSlice";

// import { selectAllUsers } from "../users/usersSlice";

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const post = useSelector((state) => selectPostById(state, Number(postId)));

  // const users = useSelector(selectAllUsers);
  const { data: users, isSuccess } = useGetUsersQuery("getUsers");

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);
  // const [requestStatus, setRequestStatus] = useState("idle");

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(Number(e.target.value));

  const canEdit = [title, content, userId].every(Boolean) && !isLoading;

  const onEditPostClicked = async () => {
    if (canEdit) {
      try {
        // setRequestStatus("pending");
        // dispatch(
        //   updatePost({
        //     id: post.id,
        //     title,
        //     body: content,
        //     userId,
        //     reactions: post.reactions,
        //   })
        // ).unwrap();
        await updatePost({
          id: post.id,
          title,
          body: content,
          userId,
          reactions: post.reactions,
        }).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (error) {
        console.error("Failed to Edit Post", error);
      } finally {
        // setRequestStatus("idle");
      }
    }
  };

  if (!post) {
    return (
      <section>
        <h2>Post Not Found</h2>
      </section>
    );
  }

  let usersOptions;
  if (isSuccess) {
    usersOptions = users.map((user) => (
      <option value={user.id} key={user.id}>
        {user.name}
      </option>
    ));
  }

  // const usersOptions = users.map((user) => (
  //   <option value={user.id} key={user.id}>
  //     {user.name}
  //   </option>
  // ));

  const onDeletePostClicked = async () => {
    try {
      // setRequestStatus("pending");
      // dispatch(
      //   deletePost({
      //     id: post.id,
      //   })
      // ).unwrap();
      await deletePost({
        id: post.id,
      }).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (error) {
      console.error("Failed to Delete the Post", error);
    } finally {
      // setRequestStatus("idle");
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title: </label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />

        <label htmlFor="postAuthor">Post Author: </label>
        <select
          name="postAuthor"
          id="postAuthor"
          defaultValue={userId}
          onChange={onAuthorChanged}
        >
          <option value=""></option>
          {usersOptions}
        </select>

        <label htmlFor="postContent">Post Content: </label>
        <textarea
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onEditPostClicked} disabled={!canEdit}>
          Save Post
        </button>
        <button
          className="deleteButton"
          type="button"
          onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
