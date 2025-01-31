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

  const getBoards = async () => {
    try {
      const boards = await boardService.getBoards();
      return boards;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getBoard = async ({ boardId }: { boardId: string }) => {
    try {
      const board = await boardService.getBoard(boardId);
      return board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createBoard = async (data: CreateBoardDto) => {
    try {
      const board = await boardService.createBoard(data);
      return board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateBoard = async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateBoardDto;
  }) => {
    try {
      const board = await boardService.updateBoard(id, data);
      return board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      await boardService.deleteBoard(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addColumns = async ({
    id,
    columns,
  }: {
    id: string;
    columns: Pick<Column, "title">[];
  }) => {
    try {
      const board = await boardService.addColumns(id, columns);
      return board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const boardsQuery = useQuery({
    queryKey: boardsQueryKey,
    queryFn: () => (user ? getBoards() : []),
    enabled: isAuthenticated,
  });

  const boardQuery = useQuery({
    queryKey: boardQueryKey,
    queryFn: () => (boardId ? getBoard({ boardId }) : null),
    enabled: isAuthenticated && !!boardId,
  });

  const createBoardMutation = useMutation({
    mutationFn: (data: CreateBoardDto) => createBoard(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: boardsQueryKey });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardDto }) =>
      updateBoard({ id, data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: boardsQueryKey });
      void queryClient.invalidateQueries({ queryKey: boardQueryKey });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id: string) => deleteBoard(id),
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
    }) => addColumns({ id, columns }),
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
    // columns: columnsQuery.data ?? [],
    // isLoading:
    //   boardsQuery.isLoading || boardQuery.isLoading || columnsQuery.isLoading,
    // isError: boardsQuery.isError || boardQuery.isError || columnsQuery.isError,

    // Mutations
    createBoard: createBoardMutation.mutateAsync,
    updateBoard: updateBoardMutation.mutateAsync,
    deleteBoard: deleteBoardMutation.mutateAsync,
    addColumns: addColumnsMutation.mutateAsync,
  };
};
