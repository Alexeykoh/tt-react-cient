export interface PaginatedResponse<T> {
  data: Array<T>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
