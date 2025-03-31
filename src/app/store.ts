import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../shared/api/baseApi";
import { authApi } from "../shared/api/auth.service";
import { userService } from "@/shared/api/user.service";
import { projectsService } from "@/shared/api/projects.service";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userService.reducerPath]: userService.reducer,
    [projectsService.reducerPath]: projectsService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      authApi.middleware,
      userService.middleware,
      projectsService.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
