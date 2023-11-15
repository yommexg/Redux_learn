// import Counter from "./features/counter/Counter";
import PostList from "./features/posts/postList";
import AddPostForm from "./features/posts/AddPostForm";
import SinglePostPage from "./features/posts/SinglePostPage";
import EditPostForm from "./features/posts/EditPostForm";
import UserLists from "./features/users/UserLists";
import UserPage from "./features/users/UserPage";

import Layout from "./components/Layout";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        <Route path="user">
          <Route index element={<UserLists />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>
      </Route>

      {/* catches all -replace with a 404 component */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
