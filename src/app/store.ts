import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../shared/api/baseApi";
import { authApi } from "../shared/api/auth.service";
import { userService } from "@/shared/api/user.service";
import { projectsService } from "@/shared/api/projects.service";
import { currencyService } from "@/shared/api/currency.service";
import { clientService } from "@/shared/api/client.service";
import { taskService } from "@/shared/api/task.service";
import { timeLogService } from "@/shared/api/time-log.service";
import { searchService } from "@/shared/api/search.service";
import { notesService } from "@/shared/api/notes.service";
import { subscriptionsService } from "@/shared/api/subscriptions.service";
import { plansService } from "@/shared/api/plans.service";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userService.reducerPath]: userService.reducer,
    [projectsService.reducerPath]: projectsService.reducer,
    [currencyService.reducerPath]: currencyService.reducer,
    [clientService.reducerPath]: clientService.reducer,
    [taskService.reducerPath]: taskService.reducer,
    [timeLogService.reducerPath]: timeLogService.reducer,
    [searchService.reducerPath]: searchService.reducer,
    [notesService.reducerPath]: notesService.reducer,
    [subscriptionsService.reducerPath]: subscriptionsService.reducer,
    [plansService.reducerPath]: plansService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      authApi.middleware,
      userService.middleware,
      projectsService.middleware,
      currencyService.middleware,
      clientService.middleware,
      taskService.middleware,
      timeLogService.middleware,
      searchService.middleware,
      notesService.middleware,
      subscriptionsService.middleware,
      plansService.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
