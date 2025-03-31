import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../shared/api/baseApi";
import { authApi } from "../shared/api/auth.service";
import { userService } from "@/shared/api/user.service";
import { projectsService } from "@/shared/api/projects.service";
import { currencyService } from "@/shared/api/currency.service";
import { clientService } from "@/shared/api/client.service";
import { taskService } from "@/shared/api/task.service";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userService.reducerPath]: userService.reducer,
    [projectsService.reducerPath]: projectsService.reducer,
    [currencyService.reducerPath]: currencyService.reducer,
    [clientService.reducerPath]: clientService.reducer,
    [taskService.reducerPath]: taskService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      authApi.middleware,
      userService.middleware,
      projectsService.middleware,
      currencyService.middleware,
      clientService.middleware,
      taskService.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
