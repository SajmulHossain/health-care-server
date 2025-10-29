type TOptions = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

type TReturn = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
};

const getPaginationInfo = (options: TOptions): TReturn => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    sortBy,
    sortOrder,
  };
};

export default getPaginationInfo;