import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { motion } from "framer-motion";
import { FaNewspaper, FaHashtag, FaList, FaCalendar, FaUser, FaClock } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    latestPosts: [],
    postsByMonth: [] 
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/blogs/");
        const posts = res.data;

        // Sort posts by createdAt descending (latest first)
        const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const categoriesSet = new Set();
        const tagsSet = new Set();
        const postsByMonth = {}; 

        posts.forEach((p) => {
          // Categories and tags
          p.categories.forEach((c) => categoriesSet.add(c));
          p.tags.forEach((t) => tagsSet.add(t));

          // Posts by day
          const date = new Date(p.createdAt);
          const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          postsByMonth[day] = (postsByMonth[day] || 0) + 1;

           
        });

          // Convert postsByMonth to array format for chart
          const chartData = Object.entries(postsByMonth)
            .map(([day, count]) => ({ day, count }))
            .slice(-7) // Last 7 days
            .reverse(); // Show oldest to newest

          setStats({
            totalPosts: posts.length,
            totalCategories: categoriesSet.size,
            totalTags: tagsSet.size,
            latestPosts: sortedPosts.slice(0, 5),  
            postsByMonth: chartData
          });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cardClass =
    "bg-black/80 p-6 rounded-3xl shadow-xl flex flex-col justify-center items-start text-white";

  const statsCards = [
    { title: "Total Posts", value: stats.totalPosts, icon: <FaNewspaper className="text-2xl" /> },
    { title: "Categories", value: stats.totalCategories, icon: <FaList className="text-2xl" /> },
    { title: "Tags", value: stats.totalTags, icon: <FaHashtag className="text-2xl" /> }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-yellow-400/20 to-black/40 p-6 rounded-3xl mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome to your Dashboard</h1>
        <p className="text-gray-300">Here's what's happening with your blog today.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className={cardClass}
            role="status"
            aria-label={`${card.title}: ${card.value}`}
          >
            <div className="flex items-center gap-4 w-full">
              <div className="p-3 bg-yellow-400/20 rounded-xl text-yellow-400">
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <h2 className="text-3xl font-bold text-yellow-400">{card.value}</h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

       {/* Latest Posts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-black/80 p-6 rounded-3xl shadow-xl"
      >
        <h3 className="text-xl font-semibold text-yellow-400 mb-6">Latest Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.latestPosts.map((post) => (
            <motion.div
              key={post._id}
              whileHover={{ scale: 1.02 }}
              className="bg-black/60 p-4 rounded-2xl shadow-lg border border-gray-800"
              role="article"
            >
              <h4 className="text-lg font-bold text-white mb-2">{post.title}</h4>
              <p className="text-gray-300 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.map((category, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full">
                    {category}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-gray-400 text-xs">
                <div className="flex items-center gap-2">
                  <FaCalendar />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser />
                  <span>{post.author || 'Admin'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts and Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Chart */}
        <motion.div 
          className="lg:col-span-2 bg-black/80 p-6 rounded-3xl shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">Posts Activity</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.postsByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#FFF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#FFF" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ background: '#000', border: '1px solid #333' }}
                  labelStyle={{ color: '#FFF' }}
                  cursor={{ fill: "transparent" }}
                />
                <Bar dataKey="count" fill="#FCD34D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      
      </div>

     
    </div>
  );
}
