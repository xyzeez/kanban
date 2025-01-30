export interface Board {
  id: string;
  name: string;
  description?: string;
  slug: string;
  ownerId: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order?: number;
}

export interface CreateBoardDto {
  name: string;
  description?: string;
}

export interface UpdateBoardDto {
  name?: string;
  description?: string;
}
