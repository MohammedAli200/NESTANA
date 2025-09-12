// // import { currentUser } from "@clerk/nextjs/server";
// // import { redirect } from "next/navigation";

// // import Searchbar from "@/components/shared/Searchbar";
// // import Pagination from "@/components/shared/Pagination";
// // import CommunityCard from "@/components/cards/CommunityCard";

// // import { fetchUser } from "@/lib/actions/user.actions";
// // import { fetchCommunities } from "@/lib/actions/community.actions";

// // async function Page(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
// //   const searchParams = await props.searchParams;
// //   const user = await currentUser();

// //   if (!user) return null;

// //   const userInfo = await fetchUser(user.id);
// //   if (!userInfo?.onboarded) redirect("/onboarding");

// //   // 👇 Pass currentUserId to apply visibility rules
// //   const result = await fetchCommunities({
// //     searchString: searchParams.q,
// //     pageNumber: searchParams?.page ? Number(searchParams.page) : 1,
// //     pageSize: 25,
// //     sortBy: "desc",
// //     currentUserId: user.id,
// //   });

// //   return (
// //     <>
// //       <h1 className="head-text">Communities</h1>

// //       <div className="mt-5">
// //         <Searchbar routeType="communities" />
// //       </div>

// //       <section className="mt-9 flex flex-wrap gap-4">
// //         {result.communities.length === 0 ? (
// //           <p className="no-result">No Result</p>
// //         ) : (
// //           <>
// //             {result.communities.map((community) => (
// //               <CommunityCard
// //                 key={community.id}
// //                 id={community.id}
// //                 name={community.name}
// //                 username={community.username}
// //                 imgUrl={community.image}
// //                 bio={community.bio}
// //                 members={community.members}
// //                 // 👇 optional: show visibility status on the card
// //                 visibility={community.visibility}
// //               />
// //             ))}
// //           </>
// //         )}
// //       </section>

// //       <Pagination
// //         path="communities"
// //         pageNumber={searchParams?.page ? Number(searchParams.page) : 1}
// //         isNext={result.isNext}
// //       />
// //     </>
// //   );
// // }

// // export default Page;





// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// import Searchbar from "@/components/shared/Searchbar";
// import Pagination from "@/components/shared/Pagination";
// import CommunityCard from "@/components/cards/CommunityCard";

// import { fetchUser } from "@/lib/actions/user.actions";
// import { fetchCommunities } from "@/lib/actions/community.actions";

// async function Page(props: { searchParams: { [key: string]: string | string[] | undefined } }) {
//   const searchParams = props.searchParams;
//   const user = await currentUser();

//   if (!user) return null;

//   const userInfo = await fetchUser(user.id);
//   if (!userInfo?.onboarded) redirect("/onboarding");

//   const result = await fetchCommunities({
//     searchString: typeof searchParams.q === "string" ? searchParams.q : "",
//     pageNumber: searchParams?.page ? Number(searchParams.page) : 1,
//     pageSize: 25,
//     sortBy: "desc",
//     currentUserId: user.id,
//   });

//   return (
//     <>
//       <h1 className="head-text">Communities</h1>

//       <div className="mt-5">
//         <Searchbar routeType="communities" />
//       </div>

//       <section className="mt-9 flex flex-wrap gap-4">
//         {result.communities.length === 0 ? (
//           <p className="no-result">No Result</p>
//         ) : (
//           result.communities.map((community) => (
//             <CommunityCard
//               key={community.id}
//               id={community.id}
//               name={community.name}
//               username={community.username}
//               imgUrl={community.image}
//               bio={community.bio}
//               members={community.members}
//               visibility={community.visibility}
//             />
//           ))
//         )}
//       </section>

//       <Pagination
//         path="communities"
//         pageNumber={searchParams?.page ? Number(searchParams.page) : 1}
//         isNext={result.isNext}
//       />
//     </>
//   );
// }

// export default Page;






// app/(root)/communities/[id]/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";
import CommunityCard from "@/components/cards/CommunityCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommunities } from "@/lib/actions/community.actions";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <>
      <h1 className='head-text'>Communities</h1>

      <div className='mt-5'>
        <Searchbar routeType='communities' />
      </div>

      <section className='mt-9 flex flex-wrap gap-4'>
        {result.communities.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='communities'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Page;