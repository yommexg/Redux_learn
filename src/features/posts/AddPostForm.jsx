import { useState } from "react";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useGetUsersQuery } from "../users/usersSlice";

// import { addNewPost } from "./postSlice";
// import { selectAllUsers } from "../users/usersSlice";

import { useAddNewPostMutation } from "./postSlice";

const AddPostForm = () => {
  // const dispatch = useDispatch();
  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  // const [addRequestStatus, setAddRequestStatus] = useState("idle");

  // const users = useSelector(selectAllUsers);
  const { data: users, isSuccess } = useGetUsersQuery("getUsers");

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        // setAddRequestStatus("pending");
        // dispatch(addNewPost({ title, body: content, userId })).unwrap();
        await addNewPost({ title, body: content, userId }).unwrap();
        setTitle("");
        setContent("");
        setUserId("");
        navigate("/");
      } catch (error) {
        console.error("Failed to save Post", error);
      } finally {
        // setAddRequestStatus("idle");
      }
    }
  };

  let usersOptions;
  if (isSuccess) {
    usersOptions = users.map((user) => (
      <option value={user.id} key={user.id}>
        {user.name}
      </option>
    ));
  }

  return (
    <section>
      <h2>Add a New Post</h2>
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
          value={userId}
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
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
