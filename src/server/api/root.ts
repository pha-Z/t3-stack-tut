import { postsRouter } from "~/server/api/routers/posts";
import { UserProfileRouter } from "~/server/api/routers/userProfile";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  userProfile: UserProfileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
