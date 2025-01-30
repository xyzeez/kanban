import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Services
import { boardService } from "../services/boardService";

// Hooks
import { useAuth } from "./useAuth";

// Types
import { CreateBoardDto, UpdateBoardDto } from "../types/board";

export const useBoards = (boardId?: string) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const boardsQueryKey = ["boards"];
  const boardQueryKey = ["board", boardId];

  const boardsQuery = useQuery({
    queryKey: boardsQueryKey,
    queryFn: boardService.getBoards,
    enabled: isAuthenticated,
  });

  const boardQuery = useQuery({
    queryKey: boardQueryKey,
    queryFn: () => (boardId ? boardService.getBoard(boardId) : null),
    enabled: isAuthenticated && !!boardId,
  });

  const createBoardMutation = useMutation({
    mutationFn: (data: CreateBoardDto) => boardService.createBoard(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: boardsQueryKey });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardDto }) =>
      boardService.updateBoard(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: boardsQueryKey });
      void queryClient.invalidateQueries({ queryKey: boardQueryKey });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id: string) => boardService.deleteBoard(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: boardsQueryKey });
    },
  });

  const fetchBoards = async () => {
    const boards = await boardService.getBoards();
    console.log(boards);
    // ... handle boards data
  };

  const addBoard = async (board: { name: string; description?: string }) => {
    const newBoard = await boardService.createBoard(board);
    console.log(newBoard);
    // ... handle new board
  };

  const editBoard = async (
    id: string,
    updates: Partial<{ name: string; description: string }>,
  ) => {
    const updatedBoard = await boardService.updateBoard(id, updates);
    console.log(updatedBoard);
    // ... handle updated board
  };

  const removeBoard = async (id: string) => {
    await boardService.deleteBoard(id);
    // ... handle board removal
  };

  return {
    // Queries
    boards: boardsQuery.data ?? [],
    board: boardQuery.data,
    isLoading: boardsQuery.isLoading || boardQuery.isLoading,
    isError: boardsQuery.isError || boardQuery.isError,

    // Mutations
    createBoard: createBoardMutation.mutateAsync,
    updateBoard: updateBoardMutation.mutateAsync,
    deleteBoard: deleteBoardMutation.mutateAsync,
    fetchBoards,
    addBoard,
    editBoard,
    removeBoard,
  };
};
