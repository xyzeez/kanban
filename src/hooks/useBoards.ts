import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Services
import { boardService } from "../services/boardService";

// Hooks
import { useAuth } from "./useAuth";

// Types
import { Column, CreateBoardDto, UpdateBoardDto } from "../types/board";

export const useBoards = (boardId?: string) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const boardsQueryKey = ["boards", user?.id];
  const boardQueryKey = ["board", boardId];

  const boardsQuery = useQuery({
    queryKey: boardsQueryKey,
    queryFn: () => (user ? boardService.getBoards() : []),
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
    mutationFn: (data: UpdateBoardDto) => boardService.updateBoard(data),
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

  const addColumnsMutation = useMutation({
    mutationFn: ({
      id,
      columns,
    }: {
      id: string;
      columns: Pick<Column, "title">[];
    }) => boardService.addColumns({ id, columns }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: boardQueryKey });
    },
  });

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
    addColumns: addColumnsMutation.mutateAsync,
  };
};
