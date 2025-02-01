// Services
import { apiService } from "./apiService";

// Types
import {
  BoardsApiResponse,
  CreateBoardDto,
  UpdateBoardDto,
} from "../types/board";

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

  createBoard: async (data: CreateBoardDto) => {
    const response = await boardsAPI.post<BoardsApiResponse>("/", data);
    if (response.status !== "success") {
      throw new Error(response.message);
    }
    return response.data.board;
  },

  updateBoard: async (data: UpdateBoardDto) => {
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

  addColumns: async (data: UpdateBoardDto) => {
    const { id, ...rest } = data;
    const response = await boardsAPI.post<BoardsApiResponse>(
      `/${id}/columns`,
      rest,
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
