import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";

import { communityTabs } from "@/constants";
import UserCard from "@/components/cards/UserCard";
import ThreadsTab, { Thread } from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCommunityDetails, fetchCommunityPosts } from "@/lib/actions/community.actions";

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Fetch community details
  const communityRaw = await fetchCommunityDetails(params.id);
  if (!communityRaw) notFound();

  const communityDetails = {
    _id: communityRaw._id?.toString() || "",
    id: communityRaw.id || communityRaw._id?.toString(),
    name: communityRaw.name || "Community",
    username: communityRaw.username || "",
    image: communityRaw.image || "/assets/community.svg",
    bio: communityRaw.bio || "",
    visibility: communityRaw.visibility || "public",
    createdById: communityRaw.createdById || user.id,
    members: Array.isArray(communityRaw.members)
      ? communityRaw.members.map((m: any) => ({
        id: m.id || "",
        name: m.name || "Unknown",
        username: m.username || "",
        image: m.image || "/assets/default-profile.png",
      }))
      : [],
  };

  // Fetch threads
  let threads: Thread[] = [];
  try {
    const threadsRaw = await fetchCommunityPosts(communityDetails.id);
    threads = (threadsRaw || []).map((t: any) => ({
      _id: t._id?.toString() || "",
      text: t.text || "",
      createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
      parentId: t.parentId || null,
      author: {
        id: t.author?.id || "",
        name: t.author?.name || "Unknown",
        image: t.author?.image || "/assets/default-profile.png",
      },
      community: {
        id: t.community?.id || communityDetails.id,
        name: t.community?.name || communityDetails.name,
        image: t.community?.image || communityDetails.image,
      },
      children: Array.isArray(t.children) ? t.children : [],
    }));
  } catch (err) {
    console.error("Error fetching threads:", err);
    threads = [];
  }

  return (
    <section>
      {/* Profile Header */}
      <ProfileHeader
        accountId={communityDetails.createdById}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image || null}
        bio={communityDetails.bio}
        type="Community"
      />

      {/* Visibility */}
      <p className="mt-2 text-sm text-gray-400">
        {communityDetails.visibility === "private" ? "🔒 Private Community" : "🌍 Public Community"}
      </p>

      {/* Tabs */}
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                {tab.icon && <Image src={tab.icon || "/assets/community.svg"} alt={tab.label} width={24} height={24} />}
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">{threads.length}</p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Threads */}
          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadsTab currentUserId={user.id} accountId={communityDetails.id} accountType="Community" threads={threads} />
          </TabsContent>

          {/* Members */}
          <TabsContent value="members" className="mt-9 w-full text-light-1">
            {communityDetails.members.length > 0 ? (
              <section className="mt-9 flex flex-col gap-10">
                {communityDetails.members.map((member) => (
                  <UserCard key={member.id} id={member.id} name={member.name} username={member.username} imgUrl={member.image || null} personType="User" />
                ))}
              </section>
            ) : (
              <p className="mt-4 text-gray-400">No members yet.</p>
            )}
          </TabsContent>

          {/* Requests */}
          <TabsContent value="requests" className="w-full text-light-1">
            <p className="mt-4 text-gray-400">No requests yet.</p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}