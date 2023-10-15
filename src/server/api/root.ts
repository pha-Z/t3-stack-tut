import { postsRouter } from "~/server/api/routers/posts";
import { userProfileRouter } from "~/server/api/routers/userprofile";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  userProfile: userProfileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
