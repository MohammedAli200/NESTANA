import { clerkClient } from "@clerk/nextjs/server";
import Community from "../models/community.model";
import { connectToDB } from "../mongoose";

export async function syncAllClerkOrgs() {
  await connectToDB();

  // List all organizations
  const orgs = await clerkClient.organizations.listOrganizations();

  for (const org of orgs) {
    await Community.findOneAndUpdate(
      { id: org.id },
      {
        id: org.id,
        name: org.name,
        username: org.slug,
        image: org.image_url,
        bio: org.publicMetadata?.bio || "",
        visibility: org.publicMetadata?.visibility || "public",
        members: [],
      },
      { upsert: true, new: true }
    );
  }
}