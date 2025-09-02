import React, { useState } from "react";
import api from "../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileUp, Save } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    date: new Date().toISOString().slice(0, 10),
    categories: "",
    tags: "",
    imageUrl: "",
  });

  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onChangeField = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const onFileChange = (e) => {
    setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form submission started");  
    setSubmitting(true);

    if (!formData.title || !formData.excerpt || !formData.content) {
      console.log("Validation failed, Missing required fields:", {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
      });
      toast.error("Please fill in all required fields.", { containerId: "create" });
      setSubmitting(false);
      return;
    }

    try {
      let imageUrl = formData.imageUrl || null;

      if (file) {
        console.log("Uploading file 📂:", file);
        const uploadForm = new FormData();
        uploadForm.append("image", file);

        const uploadRes = await api.post("/blogs/upload", uploadForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // console.log("Upload response :", uploadRes.data);

        if (!uploadRes?.data?.imageUrl) {
          throw new Error("Image upload failed. Please try again.");
        }

        imageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author || "Admin",
        date: formData.date,
        categories: formData.categories
          ? formData.categories.split(",").map((s) => s.trim())
          : [],
        tags: formData.tags ? formData.tags.split(",").map((s) => s.trim()) : [],
        imageUrl,
      };

      // console.log("Payload being sent :", payload);

      await api.post("/blogs", payload);

      console.log("Post created successfully 🎉");
      // show toast in this page's container, then navigate AFTER toast closes
      toast.success("Post created successfully! ", {
        containerId: "create",
        autoClose: 2000,
        onClose: () => navigate("/admin/posts"),
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || "An unexpected error occurred.";
      console.error("Error while creating post :", errorMsg);
      toast.error(`Failed to create post: ${errorMsg}`, { containerId: "create" });
    } finally {
      console.log("Submission finished ");
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-950 min-h-screen text-gray-200 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Create New Post
          </h1>
          <Link
            to="/admin/posts"
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:bg-gray-700 transition-colors flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Posts
          </Link>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-700 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={onChangeField}
                placeholder="Post title"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-400 mb-1">
                Author
              </label>
              <input
                id="author"
                name="author"
                value={formData.author}
                onChange={onChangeField}
                placeholder="Author name (e.g., Jane Doe)"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-400 mb-1">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={onChangeField}
              placeholder="A short summary of the post"
              rows={3}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={onChangeField}
              placeholder="Write your blog post content here..."
              rows={12}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={onChangeField}
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-400 mb-1">
                Categories
              </label>
              <input
                id="categories"
                name="categories"
                value={formData.categories}
                onChange={onChangeField}
                placeholder="comma, separated"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-400 mb-1">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={onChangeField}
                placeholder="web, dev, react"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileUp className="h-5 w-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-400">Featured Image</label>
            </div>
            <p className="text-xs text-gray-500 mb-2">Upload a file or provide a URL below.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150"
              />
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={onChangeField}
                placeholder="Or paste an image URL"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 rounded-lg shadow-lg flex items-center font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                submitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              } text-white`}
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast container dedicated for this page's toasts */}
      <ToastContainer
        containerId="create"
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 999999 }}
      />
    </div>
  );
}
