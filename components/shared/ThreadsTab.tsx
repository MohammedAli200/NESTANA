import React from "react";
import ThreadCard from "../cards/ThreadCard";

export interface Thread {
  _id: string;
  text: string;
  parentId: string | null;
  createdAt: string;
  author: { id: string; name: string; image: string | null };
  community: { id: string; name: string; image: string | null } | null;
  children: { author: { image: string | null } }[];
}

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: "User" | "Community";
  threads: Thread[];
}

const ThreadsTab: React.FC<ThreadsTabProps> = ({ currentUserId, accountType, threads }) => {
  if (!threads || threads.length === 0) {
    return <p className="text-gray-400 mt-4">No threads to display.</p>;
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {threads.map((thread) => {
        const author =
          accountType === "User"
            ? { id: currentUserId, name: "You", image: null }
            : {
              id: thread.author?.id || "",
              name: thread.author?.name || "Unknown",
              image: thread.author?.image || null,
            };

        const community =
          accountType === "Community"
            ? { id: thread.community?.id || "", name: thread.community?.name || "Community", image: thread.community?.image || null }
            : thread.community || null;

        return (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={author}
            community={community}
            createdAt={thread.createdAt}
            comments={thread.children || []}
          />
        );
      })}
    </section>
  );
};

export default ThreadsTab;