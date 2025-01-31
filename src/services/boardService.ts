// Services
import { apiService } from "./axios";

// Types
import { Board, Column, CreateBoardDto, UpdateBoardDto } from "../types/board";

export const boardService = {
  getBoards: async () => {
    const response = await apiService.get<{ data: { boards: Board[] } }>(
      "/boards",
    );
    if (!response.data || !response.data.data) {
      throw new Error("Failed to fetch boards");
    }
    return response.data.data.boards;
  },

  getBoard: async (id: string) => {
    const response = await apiService.get<{ data: { board: Board } }>(
      `/boards/${id}`,
    );
    if (!response.data || !response.data.data) {
      throw new Error("Failed to fetch board");
    }
    return response.data.data.board;
  },

  createBoard: async (data: CreateBoardDto) => {
    const response = await apiService.post<{ data: { board: Board } }>(
      "/boards",
      data,
    );
    if (!response.data || !response.data.data) {
      throw new Error("Failed to create board");
    }
    return response.data.data.board;
  },

  updateBoard: async (id: string, data: UpdateBoardDto) => {
    const response = await apiService.patch<{ data: { board: Board } }>(
      `/boards/${id}`,
      data,
    );
    if (!response.data || !response.data.data) {
      throw new Error("Failed to update board");
    }
    return response.data.data.board;
  },

  deleteBoard: async (id: string) => {
    await apiService.delete(`/boards/${id}`);
  },

  addColumns: async (boardId: string, columns: Pick<Column, "title">[]) => {
    const response = await apiService.post<{ data: { board: Board } }>(
      `/boards/${boardId}/columns`,
      { columns },
    );

    if (!response.data || !response.data.data) {
      throw new Error("Failed to add columns");
    }
    return response.data.data.board;
  },

  getColumns: async (id: string) => {
    const response = await apiService.get<{ data: { columns: Column[] } }>(
      `/boards/${id}/columns`,
    );
    if (!response.data || !response.data.data) {
      throw new Error("Failed to fetch columns");
    }
    return response.data.data.columns;
  },
};
