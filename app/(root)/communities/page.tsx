// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// import Searchbar from "@/components/shared/Searchbar";
// import Pagination from "@/components/shared/Pagination";
// import CommunityCard from "@/components/cards/CommunityCard";

// import { fetchUser } from "@/lib/actions/user.actions";
// import { fetchCommunities } from "@/lib/actions/community.actions";

// async function Page({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | undefined };
// }) {
//   const user = await currentUser();
//   if (!user) {
//     redirect("/sign-in");
//   }

//   const userInfo = await fetchUser(user.id);
//   if (!userInfo?.onboarded) redirect("/onboarding");

//   const result = await fetchCommunities({
//     searchString: searchParams.q,
//     pageNumber: searchParams?.page ? +searchParams.page : 1,
//     pageSize: 25,
//   });

//   return (
//     <>
//       <h1 className='head-text text-primary-500'>Communities</h1>

//       <div className='mt-5'>
//         <Searchbar routeType='communities' />
//       </div>

//       <section className='mt-9 flex flex-wrap gap-4'>
//         {result.communities.length === 0 ? (
//           <p className='no-result'>No Result</p>
//         ) : (
//           <>
//             {result.communities.map((community) => (
//               <CommunityCard
//                 key={community.id}
//                 id={community.id}
//                 name={community.name}
//                 username={community.username}
//                 imgUrl={community.image}
//                 bio={community.bio}
//                 members={community.members}
//               />
//             ))}
//           </>
//         )}
//       </section>

//       <Pagination
//         path='communities'
//         pageNumber={searchParams?.page ? +searchParams.page : 1}
//         isNext={result.isNext}
//       />
//     </>
//   );
// }

// export default Page;





import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommunityDetails, fetchCommunityPosts } from "@/lib/actions/community.actions";

import CommunityCard from "@/components/cards/CommunityCard";
import ThreadCard from "@/components/cards/ThreadCard";

async function Page({ params }: { params: { id: string } }) {
  // Clerk authentication
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch community details
  const community = await fetchCommunityDetails(params.id);
  if (!community) {
    return <p className="no-result">Community not found</p>;
  }

  // Fetch community posts
  const posts = await fetchCommunityPosts(community._id);

  return (
    <div className="flex flex-col gap-6">
      {/* Community Header */}
      <CommunityCard
        id={community.id}
        name={community.name}
        username={community.username}
        imgUrl={community.image}
        bio={community.bio}
        members={community.members}
      />

      {/* Posts in this community */}
      <section>
        <h2 className="head-text text-primary-500">Posts</h2>
        <div className="mt-5 flex flex-col gap-4">
          {posts?.threads?.length ? (
            posts.threads.map((thread: any) => (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user.id}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
              />
            ))
          ) : (
            <p className="no-result">No posts yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Page;