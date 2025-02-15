import { ProcessedPageable, Pageable, Page } from '../interfaces';
import { Prisma } from '.prisma/client';

const processOrderBy = (orderBys: string[] | string) => {
  if (!orderBys) return undefined;
  const order = {};
  if (!Array.isArray(orderBys)) {
    const [field, direction] = orderBys.split(',');
    order[field.trim()] =
      direction.trim() === 'desc'
        ? Prisma.SortOrder.desc
        : Prisma.SortOrder.asc;
    return order;
  }
  orderBys &&
    orderBys.forEach((orderBy) => {
      const [field, direction] = orderBy.split(',');
      order[field.trim()] =
        direction.trim() === 'desc'
          ? Prisma.SortOrder.desc
          : Prisma.SortOrder.asc;
    });
  return order;
};

const processPageable = <T>(pageable: Pageable) => {
  const { page, limit, orderBy, ...filter } = pageable;

  const pageValue = page ? Math.max(1, Number(page)) : 1;
  const limitValue = limit ? Math.max(1, Number(limit)) : 10;
  const skipValue = (pageValue - 1) * limitValue;

  return {
    orderBy: processOrderBy(orderBy),
    page: pageValue,
    limit: limitValue,
    skip: skipValue,
    filter: filter,
  } as ProcessedPageable<T>;
};

const responseToPageable = <T>(
  query: ProcessedPageable<T>,
  count?: number,
  data?: T[],
) => {
  const actualTotalPage = Math.ceil(count / query.limit);
  return {
    pageNumber: query.page,
    pageSize: (data as []).length,
    totalItems: count,
    totalPages: count < query.limit ? 1 : actualTotalPage,
    hasNext: query.page < actualTotalPage,
    firstPage: query.page === 1,
    lastPage: actualTotalPage === query.page,
    data: data,
  } as Page<any>;
};

const pageableHandler = {
  process: processPageable,
  responseToPageable,
};

export default pageableHandler;
