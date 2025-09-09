// "use server";

// import { FilterQuery, SortOrder } from "mongoose";

// import Community from "../models/community.model";
// import Thread from "../models/thread.model";
// import User from "../models/user.model";

// import { connectToDB } from "../mongoose";

// export async function createCommunity(
//   id: string,
//   name: string,
//   username: string,
//   image: string,
//   bio: string,
//   createdById: string // Change the parameter name to reflect it's an id
// ) {
//   try {
//     connectToDB();

//     // Find the user with the provided unique id
//     const user = await User.findOne({ id: createdById });

//     if (!user) {
//       throw new Error("User not found"); // Handle the case if the user with the id is not found
//     }

//     const newCommunity = new Community({
//       id,
//       name,
//       username,
//       image,
//       bio,
//       createdBy: user._id, // Use the mongoose ID of the user
//     });

//     const createdCommunity = await newCommunity.save();

//     // Update User model
//     user.communities.push(createdCommunity._id);
//     await user.save();

//     return createdCommunity;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error creating community:", error);
//     throw error;
//   }
// }

// export async function fetchCommunityDetails(id: string) {
//   try {
//     connectToDB();

//     const communityDetails = await Community.findOne({ id }).populate([
//       "createdBy",
//       {
//         path: "members",
//         model: User,
//         select: "name username image _id id",
//       },
//     ]);

//     return communityDetails;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error fetching community details:", error);
//     throw error;
//   }
// }

// export async function fetchCommunityPosts(id: string) {
//   try {
//     connectToDB();

//     const communityPosts = await Community.findById(id).populate({
//       path: "threads",
//       model: Thread,
//       populate: [
//         {
//           path: "author",
//           model: User,
//           select: "name image id", // Select the "name" and "_id" fields from the "User" model
//         },
//         {
//           path: "children",
//           model: Thread,
//           populate: {
//             path: "author",
//             model: User,
//             select: "image _id", // Select the "name" and "_id" fields from the "User" model
//           },
//         },
//       ],
//     });

//     return communityPosts;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error fetching community posts:", error);
//     throw error;
//   }
// }

// export async function fetchCommunities({
//   searchString = "",
//   pageNumber = 1,
//   pageSize = 20,
//   sortBy = "desc",
// }: {
//   searchString?: string;
//   pageNumber?: number;
//   pageSize?: number;
//   sortBy?: SortOrder;
// }) {
//   try {
//     connectToDB();

//     // Calculate the number of communities to skip based on the page number and page size.
//     const skipAmount = (pageNumber - 1) * pageSize;

//     // Create a case-insensitive regular expression for the provided search string.
//     const regex = new RegExp(searchString, "i");

//     // Create an initial query object to filter communities.
//     const query: FilterQuery<typeof Community> = {};

//     // If the search string is not empty, add the $or operator to match either username or name fields.
//     if (searchString.trim() !== "") {
//       query.$or = [
//         { username: { $regex: regex } },
//         { name: { $regex: regex } },
//       ];
//     }

//     // Define the sort options for the fetched communities based on createdAt field and provided sort order.
//     const sortOptions = { createdAt: sortBy };

//     // Create a query to fetch the communities based on the search and sort criteria.
//     const communitiesQuery = Community.find(query)
//       .sort(sortOptions)
//       .skip(skipAmount)
//       .limit(pageSize)
//       .populate("members");

//     // Count the total number of communities that match the search criteria (without pagination).
//     const totalCommunitiesCount = await Community.countDocuments(query);

//     const communities = await communitiesQuery.exec();

//     // Check if there are more communities beyond the current page.
//     const isNext = totalCommunitiesCount > skipAmount + communities.length;

//     return { communities, isNext };
//   } catch (error) {
//     console.error("Error fetching communities:", error);
//     throw error;
//   }
// }

// export async function addMemberToCommunity(
//   communityId: string,
//   memberId: string
// ) {
//   try {
//     connectToDB();

//     // Find the community by its unique id
//     const community = await Community.findOne({ id: communityId });

//     if (!community) {
//       throw new Error("Community not found");
//     }

//     // Find the user by their unique id
//     const user = await User.findOne({ id: memberId });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Check if the user is already a member of the community
//     if (community.members.includes(user._id)) {
//       throw new Error("User is already a member of the community");
//     }

//     // Add the user's _id to the members array in the community
//     community.members.push(user._id);
//     await community.save();

//     // Add the community's _id to the communities array in the user
//     user.communities.push(community._id);
//     await user.save();

//     return community;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error adding member to community:", error);
//     throw error;
//   }
// }

// export async function removeUserFromCommunity(
//   userId: string,
//   communityId: string
// ) {
//   try {
//     connectToDB();

//     const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
//     const communityIdObject = await Community.findOne(
//       { id: communityId },
//       { _id: 1 }
//     );

//     if (!userIdObject) {
//       throw new Error("User not found");
//     }

//     if (!communityIdObject) {
//       throw new Error("Community not found");
//     }

//     // Remove the user's _id from the members array in the community
//     await Community.updateOne(
//       { _id: communityIdObject._id },
//       { $pull: { members: userIdObject._id } }
//     );

//     // Remove the community's _id from the communities array in the user
//     await User.updateOne(
//       { _id: userIdObject._id },
//       { $pull: { communities: communityIdObject._id } }
//     );

//     return { success: true };
//   } catch (error) {
//     // Handle any errors
//     console.error("Error removing user from community:", error);
//     throw error;
//   }
// }

// export async function updateCommunityInfo(
//   communityId: string,
//   name: string,
//   username: string,
//   image: string
// ) {
//   try {
//     connectToDB();

//     // Find the community by its _id and update the information
//     const updatedCommunity = await Community.findOneAndUpdate(
//       { id: communityId },
//       { name, username, image }
//     );

//     if (!updatedCommunity) {
//       throw new Error("Community not found");
//     }

//     return updatedCommunity;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error updating community information:", error);
//     throw error;
//   }
// }

// export async function deleteCommunity(communityId: string) {
//   try {
//     connectToDB();

//     // Find the community by its ID and delete it
//     const deletedCommunity = await Community.findOneAndDelete({
//       id: communityId,
//     });

//     if (!deletedCommunity) {
//       throw new Error("Community not found");
//     }

//     // Delete all threads associated with the community
//     await Thread.deleteMany({ community: communityId });

//     // Find all users who are part of the community
//     const communityUsers = await User.find({ communities: communityId });

//     // Remove the community from the 'communities' array for each user
//     const updateUserPromises = communityUsers.map((user) => {
//       user.communities.pull(communityId);
//       return user.save();
//     });

//     await Promise.all(updateUserPromises);

//     return deletedCommunity;
//   } catch (error) {
//     console.error("Error deleting community: ", error);
//     throw error;
//   }
// }






// "use server";

// import { FilterQuery, SortOrder } from "mongoose";

// import Community from "../models/community.model";
// import Thread from "../models/thread.model";
// import User from "../models/user.model";

// import { connectToDB } from "../mongoose";

// export async function createCommunity(
//   id: string,
//   name: string,
//   username: string,
//   image: string,
//   bio: string,
//   createdById: string // Change the parameter name to reflect it's an id
// ) {
//   try {
//     connectToDB();

//     // Find the user with the provided unique id
//     const user = await User.findOne({ id: createdById });

//     if (!user) {
//       throw new Error("User not found"); // Handle the case if the user with the id is not found
//     }

//     const newCommunity = new Community({
//       id,
//       name,
//       username,
//       image,
//       bio,
//       createdBy: user._id, // Use the mongoose ID of the user
//     });

//     const createdCommunity = await newCommunity.save();

//     // Update User model
//     user.communities.push(createdCommunity._id);
//     await user.save();

//     return createdCommunity;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error creating community:", error);
//     throw error;
//   }
// }

// export async function fetchCommunityDetails(id: string) {
//   try {
//     connectToDB();

//     const communityDetails = await Community.findOne({ id }).populate([
//       "createdBy",
//       {
//         path: "members",
//         model: User,
//         select: "name username image _id id",
//       },
//     ]);

//     return communityDetails;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error fetching community details:", error);
//     throw error;
//   }
// }

// export async function fetchCommunityPosts(id: string) {
//   try {
//     connectToDB();

//     const communityPosts = await Community.findById(id).populate({
//       path: "threads",
//       model: Thread,
//       populate: [
//         {
//           path: "author",
//           model: User,
//           select: "name image id", // Select the "name" and "_id" fields from the "User" model
//         },
//         {
//           path: "children",
//           model: Thread,
//           populate: {
//             path: "author",
//             model: User,
//             select: "image _id", // Select the "name" and "_id" fields from the "User" model
//           },
//         },
//       ],
//     });

//     return communityPosts;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error fetching community posts:", error);
//     throw error;
//   }
// }

// export async function fetchCommunities({
//   searchString = "",
//   pageNumber = 1,
//   pageSize = 20,
//   sortBy = "desc",
// }: {
//   searchString?: string;
//   pageNumber?: number;
//   pageSize?: number;
//   sortBy?: SortOrder;
// }) {
//   try {
//     connectToDB();

//     // Calculate the number of communities to skip based on the page number and page size.
//     const skipAmount = (pageNumber - 1) * pageSize;

//     // Create a case-insensitive regular expression for the provided search string.
//     const regex = new RegExp(searchString, "i");

//     // Create an initial query object to filter communities.
//     const query: FilterQuery<typeof Community> = {};

//     // If the search string is not empty, add the $or operator to match either username or name fields.
//     if (searchString.trim() !== "") {
//       query.$or = [
//         { username: { $regex: regex } },
//         { name: { $regex: regex } },
//       ];
//     }

//     // Define the sort options for the fetched communities based on createdAt field and provided sort order.
//     const sortOptions = { createdAt: sortBy };

//     // Create a query to fetch the communities based on the search and sort criteria.
//     const communitiesQuery = Community.find(query)
//       .sort(sortOptions)
//       .skip(skipAmount)
//       .limit(pageSize)
//       .populate("members");

//     // Count the total number of communities that match the search criteria (without pagination).
//     const totalCommunitiesCount = await Community.countDocuments(query);

//     const communities = await communitiesQuery.exec();

//     // Check if there are more communities beyond the current page.
//     const isNext = totalCommunitiesCount > skipAmount + communities.length;

//     return { communities, isNext };
//   } catch (error) {
//     console.error("Error fetching communities:", error);
//     throw error;
//   }
// }

// export async function addMemberToCommunity(
//   communityId: string,
//   memberId: string
// ) {
//   try {
//     connectToDB();

//     // Find the community by its unique id
//     const community = await Community.findOne({ id: communityId });

//     if (!community) {
//       throw new Error("Community not found");
//     }

//     // Find the user by their unique id
//     const user = await User.findOne({ id: memberId });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Check if the user is already a member of the community
//     if (community.members.includes(user._id)) {
//       throw new Error("User is already a member of the community");
//     }

//     // Add the user's _id to the members array in the community
//     community.members.push(user._id);
//     await community.save();

//     // Add the community's _id to the communities array in the user
//     user.communities.push(community._id);
//     await user.save();

//     return community;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error adding member to community:", error);
//     throw error;
//   }
// }

// export async function removeUserFromCommunity(
//   userId: string,
//   communityId: string
// ) {
//   try {
//     connectToDB();

//     const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
//     const communityIdObject = await Community.findOne(
//       { id: communityId },
//       { _id: 1 }
//     );

//     if (!userIdObject) {
//       throw new Error("User not found");
//     }

//     if (!communityIdObject) {
//       throw new Error("Community not found");
//     }

//     // Remove the user's _id from the members array in the community
//     await Community.updateOne(
//       { _id: communityIdObject._id },
//       { $pull: { members: userIdObject._id } }
//     );

//     // Remove the community's _id from the communities array in the user
//     await User.updateOne(
//       { _id: userIdObject._id },
//       { $pull: { communities: communityIdObject._id } }
//     );

//     return { success: true };
//   } catch (error) {
//     // Handle any errors
//     console.error("Error removing user from community:", error);
//     throw error;
//   }
// }

// export async function updateCommunityInfo(
//   communityId: string,
//   name: string,
//   username: string,
//   image: string
// ) {
//   try {
//     connectToDB();

//     // Find the community by its _id and update the information
//     const updatedCommunity = await Community.findOneAndUpdate(
//       { id: communityId },
//       { name, username, image }
//     );

//     if (!updatedCommunity) {
//       throw new Error("Community not found");
//     }

//     return updatedCommunity;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error updating community information:", error);
//     throw error;
//   }
// }

// export async function deleteCommunity(communityId: string) {
//   try {
//     connectToDB();

//     // Find the community by its ID and delete it
//     const deletedCommunity = await Community.findOneAndDelete({
//       id: communityId,
//     });

//     if (!deletedCommunity) {
//       throw new Error("Community not found");
//     }

//     // Delete all threads associated with the community
//     await Thread.deleteMany({ community: communityId });

//     // Find all users who are part of the community
//     const communityUsers = await User.find({ communities: communityId });

//     // Remove the community from the 'communities' array for each user
//     const updateUserPromises = communityUsers.map((user) => {
//       user.communities.pull(communityId);
//       return user.save();
//     });

//     await Promise.all(updateUserPromises);

//     return deletedCommunity;
//   } catch (error) {
//     console.error("Error deleting community: ", error);
//     throw error;
//   }
// }







// "use server";

// import { FilterQuery, SortOrder, Types } from "mongoose";

// import Community from "../models/community.model";
// import Thread from "../models/thread.model";
// import User from "../models/user.model";

// import { connectToDB } from "../mongoose";

// // ---------------------------
// // CREATE COMMUNITY
// // ---------------------------
// export async function createCommunity(
//   id: string,
//   name: string,
//   username: string,
//   image: string,
//   bio: string,
//   createdById: string,
//   visibility: "public" | "private" = "public" // 👈 new param with default
// ) {
//   try {
//     await connectToDB();

//     const user = await User.findOne({ id: createdById });
//     if (!user) throw new Error("User not found");

//     const newCommunity = new Community({
//       id,
//       name,
//       username,
//       image,
//       bio,
//       createdBy: user._id,
//       visibility, // 👈 store
//     });

//     const createdCommunity = await newCommunity.save();

//     user.communities.push(createdCommunity._id);
//     await user.save();

//     return createdCommunity;
//   } catch (error) {
//     console.error("Error creating community:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // FETCH COMMUNITY DETAILS
// // ---------------------------
// export async function fetchCommunityDetails(id: string) {
//   try {
//     await connectToDB();

//     const communityDetails = await Community.findOne({ id }).populate([
//       "createdBy",
//       {
//         path: "members",
//         model: User,
//         select: "name username image _id id",
//       },
//     ]);

//     return communityDetails;
//   } catch (error) {
//     console.error("Error fetching community details:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // FETCH COMMUNITY POSTS
// // ---------------------------
// export async function fetchCommunityPosts(id: string) {
//   try {
//     await connectToDB();

//     const communityPosts = await Community.findById(id).populate({
//       path: "threads",
//       model: Thread,
//       populate: [
//         {
//           path: "author",
//           model: User,
//           select: "name image id",
//         },
//         {
//           path: "children",
//           model: Thread,
//           populate: {
//             path: "author",
//             model: User,
//             select: "image _id",
//           },
//         },
//       ],
//     });

//     return communityPosts;
//   } catch (error) {
//     console.error("Error fetching community posts:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // FETCH COMMUNITIES (with visibility filter)
// // ---------------------------
// export async function fetchCommunities({
//   searchString = "",
//   pageNumber = 1,
//   pageSize = 20,
//   sortBy = "desc",
//   currentUserId = null, // 👈 new param to handle private communities
// }: {
//   searchString?: string;
//   pageNumber?: number;
//   pageSize?: number;
//   sortBy?: SortOrder;
//   currentUserId?: string | null;
// }) {
//   try {
//     await connectToDB();

//     const skipAmount = (pageNumber - 1) * pageSize;
//     const regex = new RegExp(searchString, "i");

//     let query: FilterQuery<typeof Community> = {};

//     // search filter
//     if (searchString.trim() !== "") {
//       query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
//     }

//     // visibility filter
//     if (!currentUserId) {
//       // guests → only public
//       query.visibility = "public";
//     } else {
//       const user = await User.findOne({ id: currentUserId }).select("_id").lean();
//       if (user?._id) {
//         query.$or = [
//           { visibility: "public" },
//           { visibility: "private", members: user._id },
//           { createdBy: user._id },
//         ];
//       } else {
//         query.visibility = "public";
//       }
//     }

//     const sortOptions = { createdAt: sortBy };

//     const communitiesQuery = Community.find(query)
//       .sort(sortOptions)
//       .skip(skipAmount)
//       .limit(pageSize)
//       .populate("members");

//     const totalCommunitiesCount = await Community.countDocuments(query);
//     const communities = await communitiesQuery.exec();
//     const isNext = totalCommunitiesCount > skipAmount + communities.length;

//     return { communities, isNext };
//   } catch (error) {
//     console.error("Error fetching communities:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // ADD MEMBER
// // ---------------------------
// export async function addMemberToCommunity(communityId: string, memberId: string) {
//   try {
//     await connectToDB();

//     const community = await Community.findOne({ id: communityId });
//     if (!community) throw new Error("Community not found");

//     const user = await User.findOne({ id: memberId });
//     if (!user) throw new Error("User not found");

//     if (community.members.includes(user._id)) {
//       throw new Error("User is already a member of the community");
//     }

//     community.members.push(user._id);
//     await community.save();

//     user.communities.push(community._id);
//     await user.save();

//     return community;
//   } catch (error) {
//     console.error("Error adding member to community:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // REMOVE MEMBER
// // ---------------------------
// export async function removeUserFromCommunity(userId: string, communityId: string) {
//   try {
//     await connectToDB();

//     const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
//     const communityIdObject = await Community.findOne({ id: communityId }, { _id: 1 });

//     if (!userIdObject) throw new Error("User not found");
//     if (!communityIdObject) throw new Error("Community not found");

//     await Community.updateOne(
//       { _id: communityIdObject._id },
//       { $pull: { members: userIdObject._id } }
//     );

//     await User.updateOne(
//       { _id: userIdObject._id },
//       { $pull: { communities: communityIdObject._id } }
//     );

//     return { success: true };
//   } catch (error) {
//     console.error("Error removing user from community:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // UPDATE COMMUNITY
// // ---------------------------
// export async function updateCommunityInfo(
//   communityId: string,
//   name: string,
//   username: string,
//   image: string,
//   visibility?: "public" | "private" // 👈 allow updating
// ) {
//   try {
//     await connectToDB();

//     const updateFields: any = { name, username, image };
//     if (visibility) updateFields.visibility = visibility;

//     const updatedCommunity = await Community.findOneAndUpdate(
//       { id: communityId },
//       updateFields,
//       { new: true }
//     );

//     if (!updatedCommunity) throw new Error("Community not found");

//     return updatedCommunity;
//   } catch (error) {
//     console.error("Error updating community information:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // DELETE COMMUNITY
// // ---------------------------
// export async function deleteCommunity(communityId: string) {
//   try {
//     await connectToDB();

//     const deletedCommunity = await Community.findOneAndDelete({ id: communityId });
//     if (!deletedCommunity) throw new Error("Community not found");

//     await Thread.deleteMany({ community: communityId });

//     const communityUsers = await User.find({ communities: communityId });
//     const updateUserPromises = communityUsers.map((user) => {
//       user.communities.pull(communityId);
//       return user.save();
//     });

//     await Promise.all(updateUserPromises);

//     return deletedCommunity;
//   } catch (error) {
//     console.error("Error deleting community: ", error);
//     throw error;
//   }
// }















// "use server";

// import { FilterQuery, SortOrder } from "mongoose";

// import Community from "../models/community.model";
// import Thread from "../models/thread.model";
// import User from "../models/user.model";

// import { connectToDB } from "../mongoose";

// // ---------------------------
// // CREATE COMMUNITY
// // ---------------------------
// export async function createCommunity(
//   id: string,
//   name: string,
//   username: string,
//   image: string,
//   bio: string,
//   createdById: string,
//   visibility: "public" | "private" = "public" // default public
// ) {
//   try {
//     await connectToDB();

//     const user = await User.findOne({ id: createdById });
//     if (!user) throw new Error("User not found");

//     const newCommunity = new Community({
//       id,
//       name,
//       username,
//       image,
//       bio,
//       createdBy: user._id,
//       visibility,
//     });

//     const createdCommunity = await newCommunity.save();

//     user.communities.push(createdCommunity._id);
//     await user.save();

//     return createdCommunity;
//   } catch (error) {
//     console.error("Error creating community:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // FETCH COMMUNITY DETAILS
// // ---------------------------
// export async function fetchCommunityDetails(id: string) {
//   try {
//     await connectToDB();

//     const communityDetails = await Community.findOne({ id })
//       .populate([
//         "createdBy",
//         {
//           path: "members",
//           model: User,
//           select: "name username image _id id",
//         },
//       ])
//       .select("id name username image bio visibility members createdBy threads");

//     return communityDetails;
//   } catch (error) {
//     console.error("Error fetching community details:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // FETCH COMMUNITY POSTS
// // ---------------------------
// export async function fetchCommunityPosts(id: string) {
//   try {
//     await connectToDB();

//     const communityPosts = await Community.findOne({ id }).populate({
//       path: "threads",
//       model: Thread,
//       populate: [
//         {
//           path: "author",
//           model: User,
//           select: "name image id",
//         },
//         {
//           path: "children",
//           model: Thread,
//           populate: {
//             path: "author",
//             model: User,
//             select: "image _id",
//           },
//         },
//       ],
//     });

//     return communityPosts;
//   } catch (error) {
//     console.error("Error fetching community posts:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // FETCH COMMUNITIES (with visibility filter)
// // ---------------------------
// export async function fetchCommunities({
//   searchString = "",
//   pageNumber = 1,
//   pageSize = 20,
//   sortBy = "desc",
//   currentUserId = null,
// }: {
//   searchString?: string;
//   pageNumber?: number;
//   pageSize?: number;
//   sortBy?: SortOrder;
//   currentUserId?: string | null;
// }) {
//   try {
//     await connectToDB();

//     const skipAmount = (pageNumber - 1) * pageSize;
//     const regex = new RegExp(searchString, "i");

//     let query: FilterQuery<typeof Community> = {};

//     // Search filter
//     if (searchString.trim() !== "") {
//       query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
//     }

//     // Visibility filter
//     if (!currentUserId) {
//       query.visibility = "public"; // guest → public only
//     } else {
//       const user = await User.findOne({ id: currentUserId }).select("_id").lean();
//       if (user?._id) {
//         query.$or = [
//           { visibility: "public" },
//           { visibility: "private", members: user._id },
//           { createdBy: user._id },
//         ];
//       } else {
//         query.visibility = "public";
//       }
//     }

//     const sortOptions = { createdAt: sortBy };

//     const communitiesQuery = Community.find(query)
//       .sort(sortOptions)
//       .skip(skipAmount)
//       .limit(pageSize)
//       .populate("members")
//       .select("id name username image bio visibility members createdBy");

//     const totalCommunitiesCount = await Community.countDocuments(query);
//     const communities = await communitiesQuery.exec();
//     const isNext = totalCommunitiesCount > skipAmount + communities.length;

//     return { communities, isNext };
//   } catch (error) {
//     console.error("Error fetching communities:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // ADD MEMBER
// // ---------------------------
// export async function addMemberToCommunity(communityId: string, memberId: string) {
//   try {
//     await connectToDB();

//     const community = await Community.findOne({ id: communityId });
//     if (!community) throw new Error("Community not found");

//     const user = await User.findOne({ id: memberId });
//     if (!user) throw new Error("User not found");

//     if (community.members.includes(user._id)) {
//       throw new Error("User is already a member of the community");
//     }

//     community.members.push(user._id);
//     await community.save();

//     user.communities.push(community._id);
//     await user.save();

//     return community;
//   } catch (error) {
//     console.error("Error adding member to community:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // REMOVE MEMBER
// // ---------------------------
// export async function removeUserFromCommunity(userId: string, communityId: string) {
//   try {
//     await connectToDB();

//     const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
//     const communityIdObject = await Community.findOne({ id: communityId }, { _id: 1 });

//     if (!userIdObject) throw new Error("User not found");
//     if (!communityIdObject) throw new Error("Community not found");

//     await Community.updateOne(
//       { _id: communityIdObject._id },
//       { $pull: { members: userIdObject._id } }
//     );

//     await User.updateOne(
//       { _id: userIdObject._id },
//       { $pull: { communities: communityIdObject._id } }
//     );

//     return { success: true };
//   } catch (error) {
//     console.error("Error removing user from community:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // UPDATE COMMUNITY
// // ---------------------------
// export async function updateCommunityInfo(
//   communityId: string,
//   name: string,
//   username: string,
//   image: string,
//   visibility?: "public" | "private"
// ) {
//   try {
//     await connectToDB();

//     const updateFields: any = { name, username, image };
//     if (visibility) updateFields.visibility = visibility;

//     const updatedCommunity = await Community.findOneAndUpdate(
//       { id: communityId },
//       updateFields,
//       { new: true }
//     ).select("id name username image bio visibility members createdBy");

//     if (!updatedCommunity) throw new Error("Community not found");

//     return updatedCommunity;
//   } catch (error) {
//     console.error("Error updating community information:", error);
//     throw error;
//   }
// }

// // ---------------------------
// // DELETE COMMUNITY
// // ---------------------------
// export async function deleteCommunity(communityId: string) {
//   try {
//     await connectToDB();

//     const deletedCommunity = await Community.findOneAndDelete({ id: communityId });
//     if (!deletedCommunity) throw new Error("Community not found");

//     await Thread.deleteMany({ community: communityId });

//     const communityUsers = await User.find({ communities: communityId });
//     const updateUserPromises = communityUsers.map((user) => {
//       user.communities.pull(communityId);
//       return user.save();
//     });

//     await Promise.all(updateUserPromises);

//     return deletedCommunity;
//   } catch (error) {
//     console.error("Error deleting community: ", error);
//     throw error;
//   }
// }






// "use server";

// import { FilterQuery, SortOrder } from "mongoose";

// import Community from "../models/community.model";
// import Thread from "../models/thread.model";
// import User from "../models/user.model";

// import { connectToDB } from "../mongoose";

// // ------------------- CREATE COMMUNITY -------------------
// export async function createCommunity(
//   id: string,
//   name: string,
//   username: string,
//   image: string,
//   bio: string,
//   createdById: string
// ) {
//   try {
//     await connectToDB();

//     const user = await User.findOne({ id: createdById });
//     if (!user) throw new Error("User not found");

//     const newCommunity = new Community({
//       id,
//       name,
//       username,
//       image,
//       bio,
//       createdBy: user._id,
//     });

//     const createdCommunity = await newCommunity.save();

//     user.communities.push(createdCommunity._id);
//     await user.save();

//     return JSON.parse(JSON.stringify(createdCommunity));
//   } catch (error) {
//     console.error("❌ Error creating community:", error);
//     throw error;
//   }
// }

// // ------------------- FETCH COMMUNITY DETAILS -------------------
// export async function fetchCommunityDetails(id: string) {
//   try {
//     await connectToDB();

//     const communityDetails = await Community.findOne({ id }).populate([
//       "createdBy",
//       {
//         path: "members",
//         model: User,
//         select: "name username image _id id",
//       },
//     ]);

//     return JSON.parse(JSON.stringify(communityDetails));
//   } catch (error) {
//     console.error("❌ Error fetching community details:", error);
//     throw error;
//   }
// }

// // ------------------- FETCH COMMUNITY POSTS -------------------
// export async function fetchCommunityPosts(id: string) {
//   try {
//     await connectToDB();

//     const communityPosts = await Community.findById(id).populate({
//       path: "threads",
//       model: Thread,
//       populate: [
//         {
//           path: "author",
//           model: User,
//           select: "name image id",
//         },
//         {
//           path: "children",
//           model: Thread,
//           populate: {
//             path: "author",
//             model: User,
//             select: "image _id",
//           },
//         },
//       ],
//     });

//     return JSON.parse(JSON.stringify(communityPosts));
//   } catch (error) {
//     console.error("❌ Error fetching community posts:", error);
//     throw error;
//   }
// }

// // ------------------- FETCH ALL COMMUNITIES -------------------
// export async function fetchCommunities({
//   searchString = "",
//   pageNumber = 1,
//   pageSize = 20,
//   sortBy = "desc",
// }: {
//   searchString?: string;
//   pageNumber?: number;
//   pageSize?: number;
//   sortBy?: SortOrder;
// }) {
//   try {
//     await connectToDB();

//     const skipAmount = (pageNumber - 1) * pageSize;
//     const regex = new RegExp(searchString, "i");

//     const query: FilterQuery<typeof Community> = {};
//     if (searchString.trim() !== "") {
//       query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
//     }

//     const sortOptions = { createdAt: sortBy };

//     const communitiesQuery = Community.find(query)
//       .sort(sortOptions)
//       .skip(skipAmount)
//       .limit(pageSize)
//       .populate("members");

//     const totalCommunitiesCount = await Community.countDocuments(query);
//     const communities = await communitiesQuery.exec();

//     const isNext = totalCommunitiesCount > skipAmount + communities.length;

//     return { communities: JSON.parse(JSON.stringify(communities)), isNext };
//   } catch (error) {
//     console.error("❌ Error fetching communities:", error);
//     throw error;
//   }
// }

// // ------------------- ADD MEMBER -------------------
// export async function addMemberToCommunity(
//   communityId: string,
//   memberId: string
// ) {
//   try {
//     await connectToDB();

//     const community = await Community.findOne({ id: communityId });
//     if (!community) throw new Error("Community not found");

//     const user = await User.findOne({ id: memberId });
//     if (!user) throw new Error("User not found");

//     if (community.members.includes(user._id)) {
//       throw new Error("User already a member");
//     }

//     community.members.push(user._id);
//     await community.save();

//     user.communities.push(community._id);
//     await user.save();

//     return JSON.parse(JSON.stringify(community));
//   } catch (error) {
//     console.error("❌ Error adding member:", error);
//     throw error;
//   }
// }

// // ------------------- REMOVE MEMBER -------------------
// export async function removeUserFromCommunity(
//   userId: string,
//   communityId: string
// ) {
//   try {
//     await connectToDB();

//     const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
//     const communityIdObject = await Community.findOne({ id: communityId }, { _id: 1 });

//     if (!userIdObject) throw new Error("User not found");
//     if (!communityIdObject) throw new Error("Community not found");

//     await Community.updateOne(
//       { _id: communityIdObject._id },
//       { $pull: { members: userIdObject._id } }
//     );

//     await User.updateOne(
//       { _id: userIdObject._id },
//       { $pull: { communities: communityIdObject._id } }
//     );

//     return { success: true };
//   } catch (error) {
//     console.error("❌ Error removing user:", error);
//     throw error;
//   }
// }

// // ------------------- UPDATE COMMUNITY -------------------
// export async function updateCommunityInfo(
//   communityId: string,
//   name: string,
//   username: string,
//   image: string
// ) {
//   try {
//     await connectToDB();

//     const updatedCommunity = await Community.findOneAndUpdate(
//       { id: communityId },
//       { name, username, image },
//       { new: true }
//     );

//     if (!updatedCommunity) throw new Error("Community not found");

//     return JSON.parse(JSON.stringify(updatedCommunity));
//   } catch (error) {
//     console.error("❌ Error updating community:", error);
//     throw error;
//   }
// }

// // ------------------- DELETE COMMUNITY -------------------
// export async function deleteCommunity(communityId: string) {
//   try {
//     await connectToDB();

//     const deletedCommunity = await Community.findOneAndDelete({ id: communityId });
//     if (!deletedCommunity) throw new Error("Community not found");

//     await Thread.deleteMany({ community: communityId });

//     const communityUsers = await User.find({ communities: communityId });
//     const updateUserPromises = communityUsers.map((user) => {
//       user.communities.pull(communityId);
//       return user.save();
//     });

//     await Promise.all(updateUserPromises);

//     return JSON.parse(JSON.stringify(deletedCommunity));
//   } catch (error) {
//     console.error("❌ Error deleting community:", error);
//     throw error;
//   }
// }



// "use server";

// import { FilterQuery, SortOrder } from "mongoose";
// import { clerkClient } from "@clerk/nextjs/server";

// import Community from "../models/community.model";
// import Thread from "../models/thread.model";
// import User from "../models/user.model";
// import { connectToDB } from "../mongoose";

// // ------------------- CREATE COMMUNITY -------------------
// export async function createCommunity(
//   name: string,
//   username: string,
//   image: string,
//   bio: string,
//   createdById: string
// ) {
//   try {
//     await connectToDB();

//     const user = await User.findOne({ id: createdById });
//     if (!user) throw new Error("User not found");

//     // 1. Create Clerk Organization
//     const org = await clerkClient.organizations.createOrganization({
//       name,
//       slug: username,
//       createdBy: createdById,
//     });

//     // 2. Mirror into MongoDB
//     const newCommunity = new Community({
//       id: org.id, // store Clerk org.id
//       name,
//       username,
//       image,
//       bio,
//       createdBy: user._id,
//     });

//     const createdCommunity = await newCommunity.save();

//     user.communities.push(createdCommunity._id);
//     await user.save();

//     return JSON.parse(JSON.stringify(createdCommunity));
//   } catch (error) {
//     console.error("❌ Error creating community:", error);
//     throw error;
//   }
// }

// // ------------------- FETCH COMMUNITY DETAILS -------------------
// export async function fetchCommunityDetails(id: string) {
//   try {
//     await connectToDB();

//     // Fetch from MongoDB
//     const communityDetails = await Community.findOne({ id }).populate([
//       "createdBy",
//       {
//         path: "members",
//         model: User,
//         select: "name username image _id id",
//       },
//     ]);

//     if (!communityDetails) {
//       // fallback: fetch directly from Clerk
//       const org = await clerkClient.organizations.getOrganization({ organizationId: id });
//       if (!org) throw new Error("Community not found in Clerk or DB");

//       return {
//         id: org.id,
//         name: org.name,
//         username: org.slug,
//         image: org.logoUrl,
//         members: [],
//       };
//     }

//     return JSON.parse(JSON.stringify(communityDetails));
//   } catch (error) {
//     console.error("❌ Error fetching community details:", error);
//     throw error;
//   }
// }

// // ------------------- FETCH ALL COMMUNITIES -------------------
// export async function fetchCommunities({
//   searchString = "",
//   pageNumber = 1,
//   pageSize = 20,
//   sortBy = "desc",
// }: {
//   searchString?: string;
//   pageNumber?: number;
//   pageSize?: number;
//   sortBy?: SortOrder;
// }) {
//   try {
//     await connectToDB();

//     // Pull all Clerk organizations
//     const { data: orgs } = await clerkClient.organizations.getOrganizationList({
//       limit: pageSize,
//       offset: (pageNumber - 1) * pageSize,
//     });

//     // Pull MongoDB communities
//     const dbCommunities = await Community.find({
//       id: { $in: orgs.map((o) => o.id) },
//     });

//     // Merge Clerk + Mongo data
//     const communities = orgs.map((org) => {
//       const dbCommunity = dbCommunities.find((c) => c.id === org.id);
//       return {
//         id: org.id,
//         name: org.name,
//         username: org.slug,
//         image: org.logoUrl,
//         bio: dbCommunity?.bio || "",
//         createdBy: dbCommunity?.createdBy || null,
//         members: dbCommunity?.members || [],
//       };
//     });

//     const isNext = orgs.length === pageSize;

//     return { communities, isNext };
//   } catch (error) {
//     console.error("❌ Error fetching communities:", error);
//     throw error;
//   }
// }
// // ------------------- FETCH COMMUNITY POSTS -------------------
// export async function fetchCommunityDetails(id: string, userId?: string) {
//   await connectToDB();

//   const communityDetails = await Community.findOne({ id }).populate([
//     {
//       path: "createdBy",
//       model: User,
//       select: "id name username image",
//     },
//     {
//       path: "members",
//       model: User,
//       select: "id name username image",
//     },
//   ]);

//   if (!communityDetails) {
//     const org = await clerkClient().organizations.getOrganization({ organizationId: id });
//     if (!org) return null;

//     return {
//       id: org.id,
//       name: org.name,
//       username: org.slug,
//       image: org.logoUrl,
//       createdBy: null, // ✅ fallback
//       members: [],
//     };
//   }

//   return JSON.parse(JSON.stringify(communityDetails));
// }




// "use server";

// import { SortOrder } from "mongoose";
// import { clerkClient } from "@clerk/nextjs/server";

// import Community from "../models/community.model";
// import Thread from "../models/thread.model";
// import User from "../models/user.model";
// import { connectToDB } from "../mongoose";

// /* ------------------- CREATE COMMUNITY ------------------- */
// export async function createCommunity(
//   name: string,
//   username: string,
//   image: string,
//   bio: string,
//   createdById: string
// ) {
//   try {
//     await connectToDB();

//     const user = await User.findOne({ id: createdById });
//     if (!user) throw new Error("User not found");

//     // 1. Create Clerk Organization
//     const org = await clerkClient.organizations.createOrganization({
//       name,
//       slug: username,
//       createdBy: createdById,
//     });

//     // 2. Mirror into MongoDB
//     const newCommunity = new Community({
//       id: org.id, // Clerk org.id
//       name,
//       username,
//       image,
//       bio,
//       createdBy: user._id, // Mongo ref
//       createdByClerkId: createdById, // Clerk user ID
//     });

//     const createdCommunity = await newCommunity.save();

//     user.communities.push(createdCommunity._id);
//     await user.save();

//     return JSON.parse(JSON.stringify(createdCommunity));
//   } catch (error) {
//     console.error("❌ Error creating community:", error);
//     throw error;
//   }
// }

// /* ------------------- FETCH COMMUNITY DETAILS ------------------- */
// export async function fetchCommunityDetails(id: string) {
//   try {
//     await connectToDB();

//     const communityDetails = await Community.findOne({ id }).populate([
//       {
//         path: "members",
//         model: User,
//         select: "id name username image",
//       },
//     ]);

//     if (!communityDetails) {
//       // fallback: fetch from Clerk
//       const org = await clerkClient.organizations.getOrganization({
//         organizationId: id,
//       });
//       if (!org) return null;

//       return {
//         id: org.id,
//         name: org.name,
//         username: org.slug,
//         image: org.logoUrl,
//         createdByClerkId: null,
//         members: [],
//       };
//     }

//     return JSON.parse(JSON.stringify(communityDetails));
//   } catch (error) {
//     console.error("❌ Error fetching community details:", error);
//     throw error;
//   }
// }

// /* ------------------- FETCH ALL COMMUNITIES ------------------- */
// export async function fetchCommunities({
//   searchString = "",
//   pageNumber = 1,
//   pageSize = 20,
// }: {
//   searchString?: string;
//   pageNumber?: number;
//   pageSize?: number;
// }) {
//   await connectToDB();

//   // 1️⃣ Fetch all orgs from Clerk
//   const { data: orgs } = await clerkClient.organizations.getOrganizationList({
//     limit: pageSize,
//     offset: (pageNumber - 1) * pageSize,
//   });

//   // 2️⃣ Sync to MongoDB
//   for (const org of orgs) {
//     const exists = await Community.findOne({ id: org.id });
//     if (!exists) {
//       await Community.create({
//         id: org.id,
//         name: org.name,
//         username: org.slug,
//         image: org.logoUrl,
//         bio: "",
//         createdBy: null,
//         members: [],
//       });
//     }
//   }

//   // 3️⃣ Pull Mongo data (now fully synced)
//   const dbCommunities = await Community.find({
//     id: { $in: orgs.map((o) => o.id) },
//   });

//   // 4️⃣ Merge Clerk + Mongo
//   const communities = orgs.map((org) => {
//     const dbCommunity = dbCommunities.find((c) => c.id === org.id);
//     return {
//       id: org.id,
//       name: org.name,
//       username: org.slug,
//       image: org.logoUrl,
//       bio: dbCommunity?.bio || "",
//       createdBy: dbCommunity?.createdBy || null,
//       members: dbCommunity?.members || [],
//     };
//   });

//   return { communities, isNext: orgs.length === pageSize };
// }

// /* ------------------- FETCH COMMUNITY POSTS ------------------- */
// export async function fetchCommunityPosts(id: string) {
//   try {
//     await connectToDB();

//     const threads = await Thread.find({ community: id })
//       .populate({
//         path: "author",
//         model: User,
//         select: "id name username image",
//       })
//       .populate({
//         path: "community",
//         model: Community,
//         select: "id name username image",
//       })
//       .sort({ createdAt: -1 });

//     return JSON.parse(JSON.stringify(threads));
//   } catch (error) {
//     console.error("❌ Error fetching community posts:", error);
//     throw error;
//   }
// }





// "use server";

// import { clerkClient } from "@clerk/nextjs/server";
// import Community from "../models/community.model";
// import Thread from "../models/thread.model";
// import User from "../models/user.model";
// import { connectToDB } from "../mongoose";

// /* ------------------- CREATE COMMUNITY ------------------- */
// export async function createCommunity(
//   name: string,
//   username: string,
//   image: string,
//   bio: string,
//   createdById: string
// ) {
//   try {
//     await connectToDB();

//     const user = await User.findOne({ id: createdById });
//     if (!user) throw new Error("User not found");

//     // 1️⃣ Create organization in Clerk
//     const org = await clerkClient.organizations.createOrganization({
//       name,
//       slug: username,
//       createdBy: createdById,
//     });

//     // 2️⃣ Mirror organization into Mongo
//     const newCommunity = new Community({
//       id: org.id,                // Clerk org ID
//       name,
//       username,
//       image,
//       bio,
//       createdBy: user._id,       // Mongo ref for queries
//       createdByClerkId: createdById, // Clerk user ID
//       members: [],
//       threads: [],
//     });

//     const createdCommunity = await newCommunity.save();

//     // Add to user's communities
//     user.communities.push(createdCommunity._id);
//     await user.save();

//     // Return plain object for Next.js
//     return {
//       ...createdCommunity.toObject(),
//       _id: createdCommunity._id.toString(),
//     };
//   } catch (error) {
//     console.error("❌ Error creating community:", error);
//     throw error;
//   }
// }

// /* ------------------- FETCH COMMUNITY DETAILS ------------------- */
// export async function fetchCommunityDetails(id: string) {
//   try {
//     await connectToDB();

//     const community = await Community.findOne({ id }).populate({
//       path: "members",
//       model: User,
//       select: "id name username image",
//     });

//     if (!community) {
//       // fallback to Clerk organization
//       const org = await clerkClient.organizations.getOrganization({ organizationId: id });
//       if (!org) return null;

//       return {
//         _id: null,
//         clerkId: org.id,
//         name: org.name,
//         username: org.slug,
//         image: org.logoUrl || "/assets/community.svg",
//         createdById: null,
//         members: [],
//         threads: [],
//       };
//     }

//     // Normalize members and convert _id to string
//     const members = (community.members || []).map((m: any) => ({
//       id: m.id?.toString() || "",
//       name: m.name || "",
//       username: m.username || "",
//       image: m.image || "/assets/default-profile.png",
//     }));

//     return {
//       _id: community._id.toString(),
//       clerkId: community.id,
//       name: community.name,
//       username: community.username,
//       image: community.image || "/assets/community.svg",
//       bio: community.bio || "",
//       visibility: community.visibility || "public",
//       createdById: community.createdByClerkId || null,
//       members,
//       threads: [],
//     };
//   } catch (error) {
//     console.error("❌ Error fetching community details:", error);
//     throw error;
//   }
// }

// /* ------------------- FETCH ALL COMMUNITIES ------------------- */
// export async function fetchCommunities({
//   searchString = "",
//   pageNumber = 1,
//   pageSize = 20,
// }: {
//   searchString?: string;
//   pageNumber?: number;
//   pageSize?: number;
// }) {
//   await connectToDB();

//   const { data: orgs } = await clerkClient.organizations.getOrganizationList({
//     limit: pageSize,
//     offset: (pageNumber - 1) * pageSize,
//   });

//   // Sync new orgs into Mongo
//   for (const org of orgs) {
//     const exists = await Community.findOne({ id: org.id });
//     if (!exists) {
//       await Community.create({
//         id: org.id,
//         name: org.name,
//         username: org.slug,
//         image: org.logoUrl || "/assets/community.svg",
//         bio: "",
//         createdBy: null,
//         members: [],
//         threads: [],
//       });
//     }
//   }

//   // Pull Mongo data
//   const dbCommunities = await Community.find({ id: { $in: orgs.map((o) => o.id) } });

//   // Merge Clerk + Mongo
//   const communities = orgs.map((org) => {
//     const dbCommunity = dbCommunities.find((c) => c.id === org.id);
//     return {
//       _id: dbCommunity?._id?.toString() || null,
//       clerkId: org.id,
//       name: org.name,
//       username: org.slug,
//       image: org.logoUrl || "/assets/community.svg",
//       bio: dbCommunity?.bio || "",
//       createdById: dbCommunity?.createdByClerkId || null,
//       members: dbCommunity?.members || [],
//       threads: [],
//     };
//   });

//   return { communities, isNext: orgs.length === pageSize };
// }

// /* ------------------- FETCH COMMUNITY POSTS ------------------- */
// export async function fetchCommunityPosts(communityMongoId: string) {
//   await connectToDB();

//   const threads = await Thread.find({ community: communityMongoId }) // ✅ Use Mongo _id here
//     .populate({
//       path: "author",
//       model: User,
//       select: "id name username image",
//     })
//     .populate({
//       path: "community",
//       model: Community,
//       select: "id name username image",
//     })
//     .sort({ createdAt: -1 });

//   return threads.map((t: any) => ({
//     _id: t._id.toString(),
//     title: t.title,
//     content: t.content,
//     createdAt: t.createdAt.toISOString(),
//     author: {
//       id: t.author?.id,
//       name: t.author?.name,
//       username: t.author?.username,
//       image: t.author?.image || "/public/assets/members.svg",
//     },
//     community: {
//       clerkId: t.community?.id, // for UI
//       name: t.community?.name,
//     },
//   }));
// }






"use server";

import { clerkClient } from "@clerk/nextjs/server";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

/* ------------------- CREATE COMMUNITY ------------------- */
export async function createCommunity(
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string
) {
  try {
    await connectToDB();

    const user = await User.findOne({ id: createdById });
    if (!user) throw new Error("User not found");

    // Create Clerk Organization
    const org = await clerkClient.organizations.createOrganization({
      name,
      slug: username,
      createdBy: createdById,
    });

    // Mirror into MongoDB
    const newCommunity = new Community({
      id: org.id, // Clerk org.id
      name,
      username,
      image,
      bio,
      createdBy: user._id, // Mongo reference
      createdByClerkId: createdById, // Clerk user ID
    });

    const createdCommunity = await newCommunity.save();

    user.communities.push(createdCommunity._id);
    await user.save();

    // Return plain JS object
    return JSON.parse(JSON.stringify(createdCommunity));
  } catch (error) {
    console.error("❌ Error creating community:", error);
    throw error;
  }
}

/* ------------------- FETCH COMMUNITY DETAILS ------------------- */
export async function fetchCommunityDetails(id: string) {
  try {
    await connectToDB();

    const community = await Community.findOne({ id }).populate([
      {
        path: "members",
        model: User,
        select: "id name username image",
      },
    ]);

    if (!community) {
      // Fallback: fetch from Clerk
      const org = await clerkClient.organizations.getOrganization({
        organizationId: id,
      });
      if (!org) return null;

      return {
        _id: id, // fallback _id same as Clerk ID for UI, DB queries won't work here
        id: org.id,
        name: org.name,
        username: org.slug,
        image: org.logoUrl,
        createdByClerkId: null,
        members: [],
        threads: [],
      };
    }

    // Normalize for client
    return {
      _id: community._id.toString(),
      id: community.id, // Clerk org id
      name: community.name,
      username: community.username,
      image: community.image || "/assets/community.svg",
      bio: community.bio || "",
      visibility: community.visibility || "public",
      createdById: community.createdByClerkId || community.createdBy?.toString(),
      members: community.members.map((m: any) => ({
        id: m.id,
        name: m.name,
        username: m.username,
        image: m.image || "/assets/default-profile.png",
      })),
      threads: [], // will populate later
    };
  } catch (error) {
    console.error("❌ Error fetching community details:", error);
    throw error;
  }
}

/* ------------------- FETCH ALL COMMUNITIES ------------------- */
export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  await connectToDB();

  const { data: orgs } = await clerkClient.organizations.getOrganizationList({
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
  });

  // Sync to MongoDB
  for (const org of orgs) {
    const exists = await Community.findOne({ id: org.id });
    if (!exists) {
      await Community.create({
        id: org.id,
        name: org.name,
        username: org.slug,
        image: org.logoUrl,
        bio: "",
        createdBy: null,
        members: [],
      });
    }
  }

  // Fetch Mongo data
  const dbCommunities = await Community.find({
    id: { $in: orgs.map((o) => o.id) },
  });

  // Merge Clerk + Mongo
  const communities = orgs.map((org) => {
    const dbCommunity = dbCommunities.find((c) => c.id === org.id);
    return {
      _id: dbCommunity?._id.toString() || org.id, // Mongo _id if exists
      id: org.id, // Clerk org id
      name: org.name,
      username: org.slug,
      image: org.logoUrl,
      bio: dbCommunity?.bio || "",
      createdById: dbCommunity?.createdByClerkId || null,
      members: dbCommunity?.members || [],
    };
  });

  return { communities, isNext: orgs.length === pageSize };
}

/* ------------------- FETCH COMMUNITY POSTS ------------------- */
export async function fetchCommunityPosts(mongoId: string) {
  try {
    await connectToDB();

    const threads = await Thread.find({ community: mongoId }) // ✅ Mongo _id
      .populate({
        path: "author",
        model: User,
        select: "id name username image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "id name username image",
      })
      .sort({ createdAt: -1 });
    console.log("Fetched threads:", threads);

    // Normalize threads for client
    return threads.map((t: any) => ({
      _id: t._id.toString(),
      title: t.title,
      content: t.content,
      createdAt: t.createdAt.toISOString(),
      author: {
        id: t.author?.id,
        name: t.author?.name,
        username: t.author?.username,
        image: t.author?.image || "/public/assets/members.svg",
      },
      community: {
        _id: t.community?._id.toString(), // Mongo _id
        clerkId: t.community?.id, // for UI
        name: t.community?.name,
      },
    }));
  } catch (error) {
    console.error("❌ Error fetching community posts:", error);
    throw error;
  }
}