// import Image from "next/image";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect, notFound } from "next/navigation";

// import { communityTabs } from "@/constants";
// import UserCard from "@/components/cards/UserCard";
// import ThreadsTab, { Thread } from "@/components/shared/ThreadsTab";
// import ProfileHeader from "@/components/shared/ProfileHeader";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { fetchCommunityDetails, fetchCommunityPosts } from "@/lib/actions/community.actions";

// type PageProps = {
//   params: { id: string };
// };

// export default async function Page({ params }: PageProps) {
//   const user = await currentUser();
//   if (!user) redirect("/sign-in");

//   // Fetch community details
//   const communityRaw = await fetchCommunityDetails(params.id);
//   if (!communityRaw) notFound();

//   const communityDetails = {
//     _id: communityRaw._id?.toString() || "",
//     id: communityRaw.id || communityRaw._id?.toString(),
//     name: communityRaw.name || "Community",
//     username: communityRaw.username || "",
//     image: communityRaw.image || "/assets/community.svg",
//     bio: communityRaw.bio || "",
//     visibility: communityRaw.visibility || "public",
//     createdById: communityRaw.createdById || user.id,
//     members: Array.isArray(communityRaw.members)
//       ? communityRaw.members.map((m: any) => ({
//         id: m.id || "",
//         name: m.name || "Unknown",
//         username: m.username || "",
//         image: m.image || "/assets/default-profile.png",
//       }))
//       : [],
//   };

//   // Fetch threads
//   let threads: Thread[] = [];
//   try {
//     const threadsRaw = await fetchCommunityPosts(communityDetails.id);
//     threads = (threadsRaw || []).map((t: any) => ({
//       _id: t._id?.toString() || "",
//       text: t.text || "",
//       createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
//       parentId: t.parentId || null,
//       author: {
//         id: t.author?.id || "",
//         name: t.author?.name || "Unknown",
//         image: t.author?.image || "/assets/default-profile.png",
//       },
//       community: {
//         id: t.community?.id || communityDetails.id,
//         name: t.community?.name || communityDetails.name,
//         image: t.community?.image || communityDetails.image,
//       },
//       children: Array.isArray(t.children) ? t.children : [],
//     }));
//   } catch (err) {
//     console.error("Error fetching threads:", err);
//     threads = [];
//   }

//   return (
//     <section>
//       {/* Profile Header */}
//       <ProfileHeader
//         accountId={communityDetails.createdById}
//         authUserId={user.id}
//         name={communityDetails.name}
//         username={communityDetails.username}
//         imgUrl={communityDetails.image || null}
//         bio={communityDetails.bio}
//         type="Community"
//       />

//       {/* Visibility */}
//       <p className="mt-2 text-sm text-gray-400">
//         {communityDetails.visibility === "private" ? "🔒 Private Community" : "🌍 Public Community"}
//       </p>

//       {/* Tabs */}
//       <div className="mt-9">
//         <Tabs defaultValue="threads" className="w-full">
//           <TabsList className="tab">
//             {communityTabs.map((tab) => (
//               <TabsTrigger key={tab.label} value={tab.value} className="tab">
//                 {tab.icon && <Image src={tab.icon || "/assets/community.svg"} alt={tab.label} width={24} height={24} />}
//                 <p className="max-sm:hidden">{tab.label}</p>
//                 {tab.label === "Threads" && (
//                   <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">{threads.length}</p>
//                 )}
//               </TabsTrigger>
//             ))}
//           </TabsList>

//           {/* Threads */}
//           <TabsContent value="threads" className="w-full text-light-1">
//             <ThreadsTab currentUserId={user.id} accountId={communityDetails.id} accountType="Community" threads={threads} />
//           </TabsContent>

//           {/* Members */}
//           <TabsContent value="members" className="mt-9 w-full text-light-1">
//             {communityDetails.members.length > 0 ? (
//               <section className="mt-9 flex flex-col gap-10">
//                 {communityDetails.members.map((member) => (
//                   <UserCard key={member.id} id={member.id} name={member.name} username={member.username} imgUrl={member.image || null} personType="User" />
//                 ))}
//               </section>
//             ) : (
//               <p className="mt-4 text-gray-400">No members yet.</p>
//             )}
//           </TabsContent>

//           {/* Requests */}
//           <TabsContent value="requests" className="w-full text-light-1">
//             <p className="mt-4 text-gray-400">No requests yet.</p>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </section>
//   );
// }









// "use client";

// import Image from "next/image";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect, notFound } from "next/navigation";

// import { communityTabs } from "@/constants";
// import UserCard from "@/components/cards/UserCard";
// import ThreadsTab, { Thread } from "@/components/shared/ThreadsTab";
// import ProfileHeader from "@/components/shared/ProfileHeader";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { fetchCommunityDetails, fetchCommunityPosts } from "@/lib/actions/community.actions";

// type PageProps = {
//   params: { id: string };
//   searchParams?: { [key: string]: string | string[] | undefined };
// };

// export default async function Page({ params }: PageProps): Promise<JSX.Element> {
//   // 1️⃣ Get current user
//   const user = await currentUser();
//   if (!user) redirect("/sign-in");

//   // 2️⃣ Fetch community details
//   const communityRaw = await fetchCommunityDetails(params.id);
//   if (!communityRaw) notFound();

//   // 3️⃣ Normalize community details
//   const communityDetails = {
//     _id: communityRaw._id?.toString() || "",
//     id: communityRaw.id || communityRaw._id?.toString(),
//     name: communityRaw.name || "Community",
//     username: communityRaw.username || "",
//     image: communityRaw.image || "/assets/community.svg",
//     bio: communityRaw.bio || "",
//     visibility: communityRaw.visibility || "public",
//     createdById: communityRaw.createdById || user.id,
//     members: Array.isArray(communityRaw.members)
//       ? communityRaw.members.map((m: any) => ({
//         id: m.id || "",
//         name: m.name || "Unknown",
//         username: m.username || "",
//         image: m.image || "/assets/default-profile.png",
//       }))
//       : [],
//   };

//   // 4️⃣ Fetch threads using Mongo _id
//   let threads: Thread[] = [];
//   try {
//     const threadsRaw = await fetchCommunityPosts(communityDetails._id);
//     threads = (threadsRaw || []).map((t: any) => ({
//       _id: t._id.toString(),
//       text: t.text || "",
//       createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
//       parentId: t.parentId || null,
//       author: {
//         id: t.author?.id || "",
//         name: t.author?.name || "Unknown",
//         username: t.author?.username || "",
//         image: t.author?.image || "/assets/default-profile.png",
//       },
//       community: {
//         id: t.community?.id || communityDetails.id,
//         _id: t.community?._id?.toString() || communityDetails._id,
//         name: t.community?.name || communityDetails.name,
//         image: t.community?.image || communityDetails.image,
//       },
//       children: Array.isArray(t.children) ? t.children : [],
//     }));
//   } catch (error) {
//     console.error("Error fetching threads:", error);
//     threads = [];
//   }

//   return (
//     <section>
//       {/* Profile header */}
//       <ProfileHeader
//         accountId={communityDetails.createdById}
//         authUserId={user.id}
//         name={communityDetails.name}
//         username={communityDetails.username}
//         imgUrl={communityDetails.image}
//         bio={communityDetails.bio}
//         type="Community"
//       />

//       <p className="mt-2 text-sm text-gray-400">
//         {communityDetails.visibility === "private" ? "🔒 Private Community" : "🌍 Public Community"}
//       </p>

//       {/* Tabs */}
//       <div className="mt-9">
//         <Tabs defaultValue="threads" className="w-full">
//           <TabsList className="tab">
//             {communityTabs.map((tab) => (
//               <TabsTrigger key={tab.label} value={tab.value} className="tab">
//                 {tab.icon && <Image src={tab.icon} alt={tab.label} width={24} height={24} />}
//                 <p className="max-sm:hidden">{tab.label}</p>
//                 {tab.label === "Threads" && (
//                   <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
//                     {threads.length}
//                   </p>
//                 )}
//               </TabsTrigger>
//             ))}
//           </TabsList>

//           {/* Threads Tab */}
//           <TabsContent value="threads" className="w-full text-light-1">
//             <ThreadsTab
//               currentUserId={user.id}
//               accountId={communityDetails._id}
//               accountType="Community"
//               threads={threads}
//             />
//           </TabsContent>

//           {/* Members Tab */}
//           <TabsContent value="members" className="mt-9 w-full text-light-1">
//             {communityDetails.members.length > 0 ? (
//               <section className="mt-9 flex flex-col gap-10">
//                 {communityDetails.members.map((member) => (
//                   <UserCard
//                     key={member.id}
//                     id={member.id}
//                     name={member.name}
//                     username={member.username}
//                     imgUrl={member.image || null}
//                     personType="User"
//                   />
//                 ))}
//               </section>
//             ) : (
//               <p className="mt-4 text-gray-400">No members yet.</p>
//             )}
//           </TabsContent>

//           {/* Requests Tab */}
//           <TabsContent value="requests" className="w-full text-light-1">
//             <p className="mt-4 text-gray-400">No requests yet.</p>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </section>
//   );
// }








// import ProfileHeader from "@/components/shared/ProfileHeader";
// import ThreadsTab, { Thread } from "@/components/shared/ThreadsTab";
// import UserCard from "@/components/cards/UserCard";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { fetchCommunityDetails, fetchCommunityPosts } from "@/lib/actions/community.actions";
// import { communityTabs } from "@/constants";

// type PageProps = { params: { id: string } };

// export default async function Page({ params }: PageProps) {
//   const community = await fetchCommunityDetails(params.id);
//   if (!community) return <p>Community not found</p>;

//   const threads: Thread[] = await fetchCommunityPosts(community._id);

//   return (
//     <section>
//       <ProfileHeader
//         accountId={community.createdById}
//         authUserId={community.createdById}
//         name={community.name}
//         username={community.username}
//         imgUrl={community.image}
//         bio={community.bio}
//         type="Community"
//       />

//       <div className="mt-9">
//         <Tabs defaultValue="threads">
//           <TabsList>
//             {communityTabs.map((tab) => (
//               <TabsTrigger key={tab.value} value={tab.value}>
//                 {tab.label}
//               </TabsTrigger>
//             ))}
//           </TabsList>

//           <TabsContent value="threads">
//             <ThreadsTab threads={threads} />
//           </TabsContent>

//           <TabsContent value="members">
//             {community.members.map((member) => (
//               <UserCard key={member.id} {...member} personType="User" />
//             ))}
//           </TabsContent>

//           <TabsContent value="requests">
//             <p>No requests yet.</p>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </section>
//   );
// }




import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

import { communityTabs } from "@/constants";

import UserCard from "@/components/cards/UserCard";
import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchCommunityDetails } from "@/lib/actions/community.actions";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return <div>User not authenticated</div>;

  const communityDetails = await fetchCommunityDetails(params.id);
  if (!communityDetails) return <div>Community not found</div>;

  const createdById = communityDetails.createdBy?.id ?? "";
  const threadsCount = communityDetails.threads?.length ?? 0;
  const members = communityDetails.members ?? [];

  return (
    <section>
      <ProfileHeader
        accountId={createdById}
        authUserId={user.id}
        name={communityDetails.name ?? "Unknown Community"}
        username={communityDetails.username ?? ""}
        imgUrl={communityDetails.image ?? ""}
        bio={communityDetails.bio ?? ""}
        type='Community'
      />

      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {threadsCount}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='threads' className='w-full text-light-1'>
            {communityDetails._id ? (
              <ThreadsTab
                currentUserId={user.id}
                accountId={communityDetails._id}
                accountType='Community'
              />
            ) : (
              <div>No threads available</div>
            )}
          </TabsContent>

          <TabsContent value='members' className='mt-9 w-full text-light-1'>
            <section className='mt-9 flex flex-col gap-10'>
              {members.length > 0 ? (
                members.map((member: any) => (
                  <UserCard
                    key={member.id ?? member._id}
                    id={member.id ?? member._id}
                    name={member.name ?? "Unknown"}
                    username={member.username ?? ""}
                    imgUrl={member.image ?? ""}
                    personType='User'
                  />
                ))
              ) : (
                <div>No members yet</div>
              )}
            </section>
          </TabsContent>

          <TabsContent value='requests' className='w-full text-light-1'>
            {communityDetails._id ? (
              <ThreadsTab
                currentUserId={user.id}
                accountId={communityDetails._id}
                accountType='Community'
              />
            ) : (
              <div>No requests available</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;