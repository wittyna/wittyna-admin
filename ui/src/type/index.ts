export type ListResponse<T> = {
  rows: T[];
  pageCount: number;
  total: number;
};
