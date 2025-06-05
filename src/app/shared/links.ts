import { defineLinks } from "rwsdk/router";

/**
 * Define the links for the application
 * @returns The defined links
 */
export const link = defineLinks(["/",
  "/user/login",
  "/user/signup",
  "/user/logout",
  "/legal/privacy",
  "/legal/terms",
  "/dashboard",
  "/settings",
  "/dashboard/chat/:id",
  "/dashboard/new"
]);
