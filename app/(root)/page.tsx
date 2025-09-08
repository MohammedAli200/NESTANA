
// // app/(root)/page.tsx
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// import ThreadCard from "@/components/cards/ThreadCard";
// import Pagination from "@/components/shared/Pagination";

// import { fetchPosts } from "@/lib/actions/thread.actions";
// import { fetchUser } from "@/lib/actions/user.actions";

// async function Home({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | undefined };
// }) {
//   // ✅ Get userId from Clerk auth
//   const { userId } = auth();
//   if (!userId) {
//     redirect("/sign-in");
//   }

//   // ✅ Fetch user from your DB
//   const userInfo = await fetchUser(userId);
//   if (!userInfo?.onboarded) redirect("/onboarding");

//   // ✅ Fetch paginated threads
//   const result = await fetchPosts(
//     searchParams.page ? +searchParams.page : 1,
//     30
//   );

//   return (
//     <>
//       <h1 className="head-text text-left-dark-1">Home</h1>

//       <section className="mt-9 flex flex-col gap-10">
//         {result.posts.length === 0 ? (
//           <p className="no-result">No threads found</p>
//         ) : (
//           result.posts.map((post) => (
//             <ThreadCard
//               key={post._id.toString?.() || post._id}
//               id={post._id.toString?.() || post._id}
//               currentUserId={userId}
//               parentId={post.parentId || null}
//               content={post.text}
//               author={{
//                 id: post.author?.id || post.author?._id?.toString() || "",
//                 name: post.author?.name || "Unknown",
//                 image: post.author?.image || "/default-avatar.png",
//               }}
//               community={
//                 post.community
//                   ? {
//                     id: post.community?.id || post.community?._id?.toString(),
//                     name: post.community?.name || "Community",
//                     image: post.community?.image || "/default-avatar.png",
//                   }
//                   : null
//               }
//               createdAt={post.createdAt?.toString() || ""}
//               comments={post.children || []}
//             />
//           ))
//         )}
//       </section>

//       <Pagination
//         path='/'
//         pageNumber={searchParams?.page ? +searchParams.page : 1}
//         isNext={result.isNext}
//       />
//     </>
//   );
// }

// export default Home;


// app/(root)/page.tsx
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import ThreadCard from "@/components/cards/ThreadCard"
import Pagination from "@/components/shared/Pagination"

import { fetchPosts } from "@/lib/actions/thread.actions"
import { fetchUser } from "@/lib/actions/user.actions"




export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  // ✅ Await searchParams
  const params = await props.searchParams
  const pageNumber = params?.page ? Number(params.page) : 1

  // ✅ Await Clerk auth()
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  // ✅ Fetch user from your DB
  const userInfo = await fetchUser(userId)
  if (!userInfo?.onboarded) redirect("/onboarding")

  // ✅ Fetch paginated threads
  const result = await fetchPosts(pageNumber, 30)

  return (
    <>
      <h1 className="head-text text-left-dark-1 text-primary-500">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          result.posts.map((post) => (
            <ThreadCard
              key={post._id.toString?.() || post._id}
              id={post._id.toString?.() || post._id}
              currentUserId={userId}
              parentId={post.parentId || null}
              content={post.text}
              author={{
                id: post.author?.id || post.author?._id?.toString() || "",
                name: post.author?.name || "Unknown",
                image: post.author?.image || "/default-avatar.png",
              }}
              community={
                post.community
                  ? {
                    id:
                      post.community?.id ||
                      post.community?._id?.toString() ||
                      "",
                    name: post.community?.name || "Community",
                    image: post.community?.image || "/default-avatar.png",
                  }
                  : null
              }
              createdAt={post.createdAt?.toString() || ""}
              comments={post.children || []}
            />
          ))
        )}
      </section>

      <Pagination path="/" pageNumber={pageNumber} isNext={result.isNext} />
    </>
  )
}
