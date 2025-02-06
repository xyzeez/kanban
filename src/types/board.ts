export interface Column {
  id?: string;
  title: string;
  boardId?: string;
}

export interface Board {
  id?: string;
  name: string;
  columns: Column[];
  ownerId?: string;
  slug?: string;
}

export interface AddColumnsButtonProps {
  clickHandler: () => void;
  disabled: boolean;
}

export interface BoardsApiResponse {
  board?: Board;
  boards?: Board[];
  columns?: Column[];
}
