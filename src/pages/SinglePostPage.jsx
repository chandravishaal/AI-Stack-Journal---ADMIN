// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api from "../api/axiosInstance";

// export default function SinglePostPage() {
//   const { slug } = useParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchPost = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/blogs/${slug}`);
//       setPost(res.data);
//     } catch (err) {
//       console.error("fetchPost error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPost();
//   }, [slug]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-[60vh] text-gray-400 bg-gray-900">
//         Loading post...
//       </div>
//     );

//   if (!post)
//     return (
//       <div className="flex flex-col justify-center items-center h-[60vh] text-gray-400 bg-gray-900">
//         <p>Post not found</p>
//         <Link
//           to="/admin/posts"
//           className="mt-4 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 text-white transition"
//         >
//           Back to Posts
//         </Link>
//       </div>
//     );

//   return (
//     <div className="p-6 min-h-screen bg-gray-900 text-gray-200 max-w-4xl mx-auto">
//       <h1 className="text-4xl font-bold mb-4 text-white">{post.title}</h1>
//       <p className="text-gray-400 mb-6">
//         By {post.author || "Admin"} |{" "}
//         {post.date
//           ? post.date.slice(0, 10)
//           : new Date(post.createdAt).toISOString().slice(0, 10)}
//       </p>
//       {post.imageUrl && (
//         <img
//           src={post.imageUrl}
//           alt={post.title}
//           className="w-full rounded-md mb-6 shadow-md"
//         />
//       )}
//       <div className="prose prose-invert max-w-full">
//         <p>{post.content}</p>
//       </div>
//       <Link
//         to="/admin/posts"
//         className="mt-6 inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
//       >
//         Back to Posts
//       </Link>
//     </div>
//   );
// }
