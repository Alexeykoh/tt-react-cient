import { z } from "zod";
import { FriendshipStatus } from "../enums/friendship.enum";

export const FriendSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const FriendshipSchema = z.object({
  friendship_id: z.string(),
  status: z.nativeEnum(FriendshipStatus),
  created_at: z.string(),
  updated_at: z.string(),
  recipient: z.object({
    user_id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  sender: z.object({
    user_id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});

export const FriendshipPendingSchema = z.object({
  friendship_id: z.string(),
  status: z.nativeEnum(FriendshipStatus),
  deleted_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const FriendshipMeSchema = z.object({
  friendship_id: z.string(),
  status: z.nativeEnum(FriendshipStatus),
  created_at: z.string(),
  updated_at: z.string(),
  friend: z.object({
    user_id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});

export type Friend = z.infer<typeof FriendSchema>;
export type Friendship = z.infer<typeof FriendshipSchema>;
export type FriendshipPending = z.infer<typeof FriendshipPendingSchema>;
export type FriendshipMe = z.infer<typeof FriendshipMeSchema>;
