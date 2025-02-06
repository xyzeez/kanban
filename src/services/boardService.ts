// Services
import { apiService } from "./apiService";

// Types
import { Board, BoardsApiResponse, Column } from "../types/board";

// API Service
export const boardsAPI = apiService("boards");

export const boardService = {
  getBoards: async () => {
    const response = await boardsAPI.get<BoardsApiResponse>();
    if (response.status !== "success") {
      throw new Error(response.message);
    }
    return response.data.boards;
  },

  getBoard: async (id: string) => {
    const response = await boardsAPI.get<BoardsApiResponse>(`/${id}`);
    if (response.status !== "success") {
      throw new Error(response.message);
    }
    return response.data.board;
  },

  createBoard: async (data: Board) => {
    const response = await boardsAPI.post<BoardsApiResponse>("/", data);
    if (response.status !== "success") {
      throw new Error(response.message);
    }
    return response.data.board;
  },

  updateBoard: async (data: Board) => {
    const { id, ...rest } = data;
    const response = await boardsAPI.patch<BoardsApiResponse>(`/${id}`, rest);
    if (response.status !== "success") {
      throw new Error(response.message);
    }
    return response.data.board;
  },

  deleteBoard: async (id: string) => {
    await boardsAPI.delete(`/${id}`);
  },

  addColumns: async ({ id, columns }: { id: string; columns: Column[] }) => {
    const response = await boardsAPI.post<BoardsApiResponse>(
      `/${id}/columns`,
      columns,
    );
    if (response.status !== "success") {
      throw new Error(response.message);
    }
    return response.data.board;
  },

  getColumns: async (id: string) => {
    const response = await boardsAPI.get<BoardsApiResponse>(`/${id}/columns`);
    if (response.status !== "success") {
      throw new Error(response.message);
    }
    return response.data.columns;
  },
};
