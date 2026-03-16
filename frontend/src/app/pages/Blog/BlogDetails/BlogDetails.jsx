"use client";
import Breadcrumb from "@/app/components/Breadcum";
import React, { useState } from "react";
import {
  useGetAllBlogsQuery,
  useAddCommentMutation,
} from "../../../../../store/blogs/blogsApi";
import { useParams } from "next/navigation";

import { useGetProfileQuery } from "store/authApi/authApi";

const Tag = ({ children }) => (
  <span className="inline-block text-sm px-3 py-1 mr-2 mb-2 rounded-full bg-gray-100 text-gray-700">
    {children}
  </span>
);

export default function BlogDetails() {
  const { id } = useParams();

  const [comment, setComment] = useState("");

  const {
    data: blogs,
    isLoading: blogsLoading,
    error: blogsError,
    refetch,
  } = useGetAllBlogsQuery();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetProfileQuery();

  const [addComment, { isLoading: isCreating }] = useAddCommentMutation();

  const blog = blogs?.data?.find((item) => item._id === id);

  if (blogsLoading || profileLoading) return <p>Loading...</p>;
  if (blogsError || profileError) return <p>Something went wrong</p>;
  if (!blog) return <p>Blog not found</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) return alert("Please login to post a comment");
    if (!comment) return alert("Comment is required");

    try {
      await addComment({
        blogId: id,
        commentBody: comment,
      }).unwrap();

      setComment("");
      refetch(); // refresh blog to get updated comments
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: blog.title, href: `/blog/${id}` },
        ]}
      />

      <div className="bg-white">
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* MAIN CONTENT */}
            <article className="lg:col-span-2">
              <div className="rounded-xl overflow-hidden shadow-sm">
                <img
                  src={blog.hero}
                  alt={blog.title}
                  className="w-full h-64 object-cover sm:h-96"
                />
              </div>

              <h1 className="mt-6 text-3xl font-bold">{blog.title}</h1>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap">
                {blog.tags?.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>

              {/* Content */}
              <section className="prose max-w-none mt-6">
                <div
                  dangerouslySetInnerHTML={{
                    __html: blog.content,
                  }}
                />
              </section>

              {/* COMMENTS */}
              <div className="mt-10">
                <h4 className="text-lg font-semibold mb-4">
                  Comments (
                  {blog?.comments?.filter((c) => c.status === "active")
                    ?.length || 0}
                  )
                </h4>

                {/* Show comments */}
                <div className="space-y-4">
                  {blog?.comments
                    ?.filter((c) => c.status === "active")
                    ?.map((c) => (
                      <div key={c._id} className="p-4 border rounded">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-800">
                            {profile.data.user.name
                              ? `${profile.data.user.name} `
                              : "User"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(c.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}{" "}
                            {new Date(c.created_at).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-700">
                          {c.commentBody}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Comment Form */}
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 p-4 border rounded grid gap-3"
                >
                  {/* Show logged in user name */}
                  {profile?.data && (
                    <p className="text-sm text-gray-600">
                      Commenting as{" "}
                      <span className="font-medium text-gray-800">
                        {profile.data.firstName} {profile.data.lastName}
                      </span>
                    </p>
                  )}
                  <textarea
                    className="border rounded px-3 py-2"
                    rows={4}
                    placeholder="Write a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="text-right">
                    <button
                      disabled={isCreating}
                      className="px-4 py-2 bg-yellow-600 text-white rounded"
                    >
                      {isCreating ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </form>
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="p-4 border rounded-lg">
                  <h5 className="text-sm font-semibold mb-3">Related Posts</h5>

                  {blogs?.data
                    ?.filter((b) => b._id !== id)
                    ?.slice(0, 3)
                    ?.map((b) => (
                      <a
                        key={b._id}
                        href={`/blog/${b._id}`}
                        className="flex items-center gap-3 mb-3"
                      >
                        <img
                          src={b.hero}
                          className="w-16 h-12 object-cover rounded"
                          alt={b.title}
                        />
                        <span className="text-sm">{b.title}</span>
                      </a>
                    ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
