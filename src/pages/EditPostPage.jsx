// pages/EditPostPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, FileUp, Save } from "lucide-react";

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    date: "",
    categories: [],
    tags: [],
    imageUrl: "",
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("Loading blog", id);
        const res = await api.get(`/blogs/${id}`);
        console.log("Loaded blog:", res.data);
        const b = res.data;
        setForm({
          title: b.title || "",
          excerpt: b.excerpt || "",
          content: b.content || "",
          author: b.author || "",
          date: b.date ? b.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
          categories: b.categories || [],
          tags: b.tags || [],
          imageUrl: b.imageUrl || "",
        });
      } catch (err) {
        console.error("Failed to load blog:", err);
        toast.error("Failed to load blog", { containerId: "edit" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    console.log("field change:", name, value);
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onFileChange = (e) => {
    setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
    console.log("Selected file for edit:", e.target.files);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.imageUrl || null;
      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        console.log("Uploading new image for edit...");
        const uploadRes = await api.post("/blogs/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.imageUrl;
        console.log("New imageUrl:", imageUrl);
      }

      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        date: form.date,
        categories: Array.isArray(form.categories)
          ? form.categories
          : form.categories?.split?.(",").map((s) => s.trim()) || [],
        tags: Array.isArray(form.tags)
          ? form.tags
          : form.tags?.split?.(",").map((s) => s.trim()) || [],
        imageUrl,
      };

      console.log("Updating blog", id, payload);
      const res = await api.put(`/blogs/${id}`, payload);
      console.log("Update response:", res.data);

      // show toast in this page's container, then navigate AFTER toast closes
      toast.success("Post updated successfully!", {
        containerId: "edit",
        autoClose: 1800,
        onClose: () => navigate("/admin/posts"),
      });
    } catch (err) {
      console.error("Error updating blog:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || err.message || "Failed to update";
      toast.error(`Failed to update post: ${errorMsg}`, { containerId: "edit" });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-gray-400">
        <svg
          className="animate-spin h-8 w-8 text-yellow-300 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading post...
      </div>
    );

  return (
    <div className="p-4 sm:p-8 bg-gray-950 min-h-screen text-gray-200 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Edit Post</h1>
          <Link
            to="/admin/posts"
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg shadow-md hover:bg-gray-700 transition-colors flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Posts
          </Link>
        </header>

        <form onSubmit={handleSave} className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-700 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="Title"
                required
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Author</label>
              <input
                name="author"
                value={form.author}
                onChange={onChange}
                placeholder="Author"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Excerpt <span className="text-red-500">*</span></label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={onChange}
              placeholder="A short summary"
              rows={3}
              required
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Content <span className="text-red-500">*</span></label>
            <textarea
              name="content"
              value={form.content}
              onChange={onChange}
              placeholder="Write your blog post content here..."
              rows={10}
              required
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
              <input
                name="date"
                value={form.date}
                onChange={onChange}
                type="date"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Categories</label>
              <input
                name="categories"
                value={Array.isArray(form.categories) ? form.categories.join(", ") : form.categories}
                onChange={onChange}
                placeholder="comma, separated"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tags</label>
              <input
                name="tags"
                value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
                onChange={onChange}
                placeholder="web, dev, react"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileUp className="h-5 w-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-400">Featured Image</label>
            </div>

            {form.imageUrl && (
              <div className="mb-3">
                <img src={form.imageUrl} alt="preview" className="w-full max-h-48 object-contain rounded-lg border border-gray-700 mb-2" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150"
              />
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={onChange}
                placeholder="Or paste an image URL"
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 rounded-lg shadow-lg flex items-center font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                saving ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              } text-black`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* page-level toast container to ensure toasts from this page render */}
      <ToastContainer
        containerId="edit"
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
