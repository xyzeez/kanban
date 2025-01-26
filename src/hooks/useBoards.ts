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
  };
}

export const useBoards = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const queryKey = ["boards", user?.id];

  const query = useQuery<Board[]>({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse>("/boards");
      return data.data.boards;
    },
    enabled: isAuthenticated,
  });

  const createBoard = useMutation<Board, Error, CreateBoardDto>({
    mutationFn: async (newBoard: CreateBoardDto) => {
      const { data } = await axiosInstance.post<ApiResponse>(
        "/boards",
        newBoard,
      );
      return data.data.board;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    ...query,
    createBoard: createBoard.mutateAsync,
    // updateBoard,
    // deleteBoard,
  };
};
