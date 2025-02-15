type Pageable<T = Record<string, any>> = Partial<{
  page: number;
  limit: number;
  orderBy: string[];
}> &
  T;
type Page<T = Record<string, any>> = Partial<{
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  data: T[];
  firstPage: boolean;
  lastPage: boolean;
}> &
  T;

interface PageableOrderBy<T = string> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

/** This is the object converted to after @{link PageableInterface} has been gotten from request*/
type ProcessedPageable<T = Record<string, any>> = Partial<{
  page: number;
  limit: number;
  skip: number;
  orderBy: {
    [key: string]: string;
  };
  filter?: T;
}>;

interface PageableResponse<T extends Record<string, any>> {
  total: number;
  totalPages: number;
  currentPage: number;
  data: T;
}

export interface ResponseDto<T> {
  status: string;
  message: string;
  data: T;
}

export default Pageable;
export { Page, PageableResponse, ProcessedPageable, PageableOrderBy };
