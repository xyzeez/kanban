import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Contexts
import { axiosInstance } from "../contexts/AuthContext";

// Hooks
import { useAuth } from "./useAuth";

// Types
interface Column {
  id: string;
  title: string;
}

interface Board {
  name: string;
  columns: Column[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  unassignedColumn: Column;
  id: string;
  slug: string;
}

interface CreateBoardDto {
  name: string;
  columns: { title: string }[];
}

interface ApiResponse {
  status: string;
  data: {
    board: Board;
    boards: Board[];
  } | null;
}

export const useBoards = (boardName?: string) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const queryKey = ["boards", user?.id];
  const singleBoardKey = ["board", boardName, user?.id];

  const boardsQuery = useQuery<Board[]>({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse>("/boards");
      return data.data?.boards ?? [];
    },
    enabled: isAuthenticated,
  });

  const singleBoardQuery = useQuery<Board | undefined>({
    queryKey: singleBoardKey,
    queryFn: async () => {
      if (!boardName) return undefined;

      if (boardsQuery.data) {
        const board = boardsQuery.data.find(
          (board) => board.name === boardName,
        );
        if (board) return board;
      }
      const { data } = await axiosInstance.get<ApiResponse>(
        `/boards/name/${boardName}`,
      );

      return data.data?.board;
    },
    enabled: isAuthenticated && !!boardName,
  });

  const createBoard = useMutation({
    mutationFn: async (newBoard: CreateBoardDto) => {
      const { data } = await axiosInstance.post<ApiResponse>(
        "/boards",
        newBoard,
      );
      if (!data.data?.board) throw new Error("Failed to create board");
      return data.data.board;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteBoard = useMutation({
    mutationFn: async (boardId: string) => {
      const { data } = await axiosInstance.delete<ApiResponse>(
        `/boards/${boardId}`,
      );
      return data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    ...boardsQuery,
    activeBoard: singleBoardQuery.data,
    isLoadingBoard: singleBoardQuery.isLoading,
    createBoard: createBoard.mutateAsync,
    deleteBoard: deleteBoard.mutateAsync,
  };
};
