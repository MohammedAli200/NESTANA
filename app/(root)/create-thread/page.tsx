// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// import PostThread from "@/components/forms/PostThread";
// import { fetchUser } from "@/lib/actions/user.actions";

// async function Page() {
//   const user = await currentUser();
//   if (!user) return null;

//   // fetch organization list created by user
//   const userInfo = await fetchUser(user.id);
//   if (!userInfo?.onboarded) redirect("/onboarding");

//   return (
//     <>
//       <h1 className='head-text'>Create Thread</h1>

//       <PostThread userId={userInfo._id} />
//     </>
//   );
// }

// export default Page;





// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// import PostThread from "@/components/forms/PostThread";
// import { fetchUser } from "@/lib/actions/user.actions";

// export default async function Page() {
//   // ✅ use auth() instead of currentUser()
//   const { userId } = await auth();
//   if (!userId) return null;

//   // fetch organization list created by user
//   const userInfo = await fetchUser(userId);
//   if (!userInfo?.onboarded) redirect("/onboarding");

//   return (
//     <>
//       <h1 className="head-text">Create Post</h1>
//       <PostThread userId={userInfo._id} />
//     </>
//   );
// }



import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import PostThread from "@/components/forms/PostThread"
import { fetchUser } from "@/lib/actions/user.actions"

export default async function Page() {
  // ✅ use auth() without await
  const { userId } = auth()
  if (!userId) {
    redirect("/sign-in");
  }

  // fetch user info
  const userInfo = await fetchUser(userId)
  if (!userInfo?.onboarded) redirect("/onboarding")

  return (
    <>
      <h1 className="head-text text-primary-500">Create Post</h1>
      {/* ✅ Ensure ObjectId is converted to string */}
      <PostThread userId={userInfo._id.toString()} />
    </>
  )
}