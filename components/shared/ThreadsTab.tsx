// import React from "react";
// import ThreadCard from "../cards/ThreadCard";

// export interface Thread {
//   _id: string;
//   text: string;
//   parentId: string | null;
//   createdAt: string;
//   author: { id: string; name: string; image: string | null };
//   community: { id: string; name: string; image: string | null } | null;
//   children: { author: { image: string | null } }[];
// }

// interface ThreadsTabProps {
//   currentUserId: string;
//   accountId: string;
//   accountType: "User" | "Community";
//   threads: Thread[];
// }

// const ThreadsTab: React.FC<ThreadsTabProps> = ({ currentUserId, accountType, threads }) => {
//   if (!threads || threads.length === 0) {
//     return <p className="text-gray-400 mt-4">No threads to display.</p>;
//   }

//   return (
//     <section className="mt-9 flex flex-col gap-10">
//       {threads.map((thread) => {
//         const author =
//           accountType === "User"
//             ? { id: currentUserId, name: "You", image: null }
//             : {
//               id: thread.author?.id || "",
//               name: thread.author?.name || "Unknown",
//               image: thread.author?.image || null,
//             };

//         const community =
//           accountType === "Community"
//             ? { id: thread.community?.id || "", name: thread.community?.name || "Community", image: thread.community?.image || null }
//             : thread.community || null;

//         return (
//           <ThreadCard
//             key={thread._id}
//             id={thread._id}
//             currentUserId={currentUserId}
//             parentId={thread.parentId}
//             content={thread.text}
//             author={author}
//             community={community}
//             createdAt={thread.createdAt}
//             comments={thread.children || []}
//           />
//         );
//       })}
//     </section>
//   );
// };

// export default ThreadsTab;










// import { redirect } from "next/navigation";

// import { fetchCommunityPosts } from "@/lib/actions/community.actions";
// import { fetchUserPosts } from "@/lib/actions/user.actions";

// import ThreadCard from "../cards/ThreadCard";

// interface Result {
//   name: string;
//   image: string;
//   id: string;
//   threads: {
//     _id: string;
//     text: string;
//     parentId: string | null;
//     author: {
//       name: string;
//       image: string;
//       id: string;
//     };
//     community: {
//       id: string;
//       name: string;
//       image: string;
//     } | null;
//     createdAt: string;
//     children: {
//       author: {
//         image: string;
//       };
//     }[];
//   }[];
// }

// interface Props {
//   currentUserId: string;
//   accountId: string;
//   accountType: string;
// }

// async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
//   let result: Result | null = null;

//   if (accountType === "Community") {
//     result = await fetchCommunityPosts(accountId);
//   } else {
//     result = await fetchUserPosts(accountId);
//   }

//   if (!result) {
//     redirect("/");
//   }

//   // ✅ Prevent error if threads is missing or not an array
//   if (!result.threads || result.threads.length === 0) {
//     return <p className="text-gray-400 mt-4">No threads to display.</p>;
//   }

//   return (
//     <section className="mt-9 flex flex-col gap-10">
//       {result.threads.map((thread) => (
//         <ThreadCard
//           key={thread._id}
//           id={thread._id}
//           currentUserId={currentUserId}
//           parentId={thread.parentId}
//           content={thread.text}
//           author={
//             accountType === "User"
//               ? { name: result!.name, image: result!.image, id: result!.id }
//               : {
//                 name: thread.author.name,
//                 image: thread.author.image,
//                 id: thread.author.id,
//               }
//           }
//           community={
//             accountType === "Community"
//               ? { name: result!.name, id: result!.id, image: result!.image }
//               : thread.community
//           }
//           createdAt={thread.createdAt}
//           comments={thread.children}
//         />
//       ))}
//     </section>
//   );
// }

// export default ThreadsTab;



import { redirect } from "next/navigation";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";
import ThreadCard from "../cards/ThreadCard";

interface Thread {
  _id: string;
  text: string;
  parentId: string | null;
  author: { name: string; image: string; id: string };
  community: { id: string; name: string; image: string } | null;
  createdAt: string;
  children: { author: { image: string } }[];
}

interface Result {
  name: string;
  image: string;
  id: string;
  threads: Thread[];
}

interface Props {
  currentUserId: string;
  accountId: string;      // <- this must be the Mongo _id of the Community
  accountType: "User" | "Community";
}

export default async function ThreadsTab({
  currentUserId,
  accountId,
  accountType,
}: Props) {
  let result: Result | null = null;

  // Choose the correct fetcher
  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) {
    redirect("/");
  }

  const threads = result?.threads ?? [];
  if (threads.length === 0) {
    return <p className="mt-4 text-gray-400">No threads to display.</p>;
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {threads.map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: result!.name, image: result!.image, id: result!.id }
              : {
                name: thread.author.name,
                image: thread.author.image,
                id: thread.author.id,
              }
          }
          community={
            accountType === "Community"
              ? { name: result!.name, id: result!.id, image: result!.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
}