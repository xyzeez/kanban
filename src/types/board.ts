export interface Column {
  id?: string;
  title: string;
  boardId?: string;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  unassignedColumn: Column;
  ownerId: string;
  slug: string;
}

export interface CreateBoardDto {
  name: string;
  columns: Column[];
}

export interface UpdateBoardDto {
  id: string;
  name?: string;
  columns?: Column[];
}

export interface BoardsApiResponse {
  board?: Board;
  boards?: Board[];
  columns?: Column[];
}
