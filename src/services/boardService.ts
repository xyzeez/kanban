// Services
import { apiService } from "./axios";

// Types
import { Board, CreateBoardDto, UpdateBoardDto } from "../types/board";

export const boardService = {
  getBoards: async (): Promise<Board[]> => {
    const response = await apiService.get<{ data: { boards: Board[] } }>(
      "/boards",
    );
    if (!response.data || !response.data.data) {
      console.error("Failed to fetch boards");
      return [];
    }
    return response.data.data.boards;
  },

  getBoard: async (id: string): Promise<Board | null> => {
    const response = await apiService.get<{ data: { board: Board } }>(
      `/boards/${id}`,
    );
    if (!response.data || !response.data.data) {
      console.error("Failed to fetch board");
      return null;
    }
    return response.data.data.board;
  },

  createBoard: async (data: CreateBoardDto): Promise<Board | null> => {
    const response = await apiService.post<{ data: { board: Board } }>(
      "/boards",
      data,
    );
    if (!response.data || !response.data.data) {
      console.error("Failed to create board");
      return null;
    }
    return response.data.data.board;
  },

  updateBoard: async (
    id: string,
    data: UpdateBoardDto,
  ): Promise<Board | null> => {
    const response = await apiService.patch<{ data: { board: Board } }>(
      `/boards/${id}`,
      data,
    );
    if (!response.data || !response.data.data) {
      console.error("Failed to update board");
      return null;
    }
    return response.data.data.board;
  },

  deleteBoard: async (id: string): Promise<void> => {
    await apiService.delete(`/boards/${id}`);
  },
};
