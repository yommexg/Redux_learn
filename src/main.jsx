import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./app/store.js";
import { Provider } from "react-redux";
// import { fetchPosts } from "./features/posts/postSlice.js";
import { extendedApiSlice } from "./features/posts/postSlice.js";
// import { fetchUsers } from "./features/users/usersSlice.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// store.dispatch(fetchPosts());
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
// store.dispatch(userExtendedApiSlice.endpoints.getPosts.initiate());
// store.dispatch(fetchUsers());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
