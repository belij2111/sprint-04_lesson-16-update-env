class PaginationModel {
  constructor(
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

export const paginationParams = new PaginationModel(1, 10, 'createdAt', 'asc');
