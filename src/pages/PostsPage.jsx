import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { Plus, Edit, Trash } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdContentPasteSearch } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 5;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs");
      const sorted = Array.isArray(res.data)
        ? res.data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [];
      setPosts(sorted);
    } catch (err) {
      console.error("fetchPosts error:", err);
      toast.error("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      setPosts((p) => p.filter((x) => x._id !== id && x.id !== id));
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error("delete error:", err);
      toast.error("Failed to delete post.");
    }
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-gray-400">
        <svg
          className="animate-spin h-8 w-8 text-yellow-300 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading posts...
      </div>
    );

  return (
    <div className="p-4 sm:p-8 bg-gray-950 min-h-screen text-gray-200 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-300">
            Manage Posts
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full">
              <MdContentPasteSearch className="absolute  ml-2 mt-2   text-gray-400 size-6 z-10" />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
             
                }}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <Link
              to="/admin/posts/create"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 
               transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center font-medium whitespace-nowrap"
            >
              <FaPlus className="h-5 w-5 mr-2" /> Create Post
            </Link>
          </div>
        </header>

        <div className="space-y-4">
          {paginatedPosts.length === 0 ? (
            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 text-center text-gray-400 text-lg border border-gray-700">
              <p>
                No posts found.{" "}
                {search && (
                  <>
                    Try a different search query or{" "}
                    <button
                      onClick={() => setSearch("")}
                      className="text-blue-400 hover:underline"
                    >
                      clear the search
                    </button>
                    .
                  </>
                )}
              </p>
            </div>
          ) : (
            paginatedPosts.map((p) => (
              <div
                key={p._id || p.id}
                className="bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-700 hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.01] cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Published on:{" "}
                    {p.date
                      ? new Date(p.date).toLocaleDateString()
                      : new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <Link
                    to={`/admin/posts/edit/${p._id || p.id}`}
                    className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-110"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p._id || p.id);
                    }}
                    className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-110"
                    title="Delete"
                  >
                    <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 sm:mt-8 gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Prev
            </button>
            <div className="flex flex-wrap gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors duration-200 ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
}
