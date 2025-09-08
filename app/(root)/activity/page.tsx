import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchUser, getActivity } from "@/lib/actions/user.actions";

export default async function Page() {
  // ❌ no await here
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const userInfo = await fetchUser(userId);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);

  return (
    <>
      <h1 className="head-text text-primary-500">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          activity.map((activity) => {
            const author = activity.author || null;

            return (
              <Link
                key={activity._id?.toString?.() || activity._id}
                href={`/thread/${activity.parentId}`}
              >
                <article className="activity-card">
                  <Image
                    src={author?.image || "/default-avatar.png"}
                    alt={author?.name || "user"}
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {author?.name || "Unknown User"}
                    </span>{" "}
                    replied to your post
                  </p>
                </article>
              </Link>
            );
          })
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </>
  );
}