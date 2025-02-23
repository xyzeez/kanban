import { FC } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";

// Hooks
import { useApp } from "../hooks/useApp";
import { useBoards } from "../hooks/useBoards";

// Components
import Logo from "../components/Logo";
import { ChevronDownIcon, EllipsisIcon, PlusIcon } from "../components/Icons";

// UIs
import MobileNav from "./navs/MobileNav";
import { EditBoardForm } from "./forms/BoardForms";
import DeleteBoard from "./modals/DeleteBoard";
import { CreateTaskForm } from "./forms/TaskForms";

// Utils
import { cn } from "../utils/styles";

const Header: FC = () => {
  const { boardId } = useParams<{
    boardId: string;
  }>();
  const { board, isLoading } = useBoards(boardId);
  const {
    openSideBar,
    openMobileNav,
    toggleMobileNav,
    openBoardOptions,
    toggleBoardOptions,
    openModal,
  } = useApp();

  return (
    <header className="relative grid grid-cols-[auto_1fr] bg-white transition-colors dark:bg-grey-800">
      <div
        className={`flex items-center border-b border-grey-100 py-4 pl-4 transition-all dark:border-grey-700 md:border-r md:pl-6 md:pr-4 xl:pr-8 ${
          openSideBar
            ? "md:w-[260px] md:max-w-[260px] md:border-b-white md:dark:border-b-grey-800 xl:w-[300px] xl:max-w-[300px]"
            : "w-auto md:w-[210px] md:max-w-[210px]"
        }`}
      >
        <Logo />
      </div>
      <div className="relative flex w-full flex-row items-center justify-between border-b border-grey-100 py-4 pl-4 pr-4 transition-colors dark:border-grey-700 md:pl-6 md:pr-6 xl:pb-7 xl:pt-5">
        <div className="font-sans text-lg font-bold transition-colors md:text-xl xl:text-2xl">
          {board?.name && (
            <h1 className="hidden capitalize text-black dark:text-white md:block">
              {board.name}
            </h1>
          )}
          <motion.button
            onClick={() => toggleMobileNav()}
            className={cn(
              "flex flex-row items-center gap-2 text-black dark:text-white md:hidden",
              openMobileNav && "text-purple dark:text-purple",
            )}
          >
            {board?.name && <span className="capitalize">{board.name}</span>}
            <motion.div
              animate={{ rotate: openMobileNav ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ChevronDownIcon className="text-purple" />
            </motion.div>
          </motion.button>
          {openMobileNav && (
            <div className="absolute left-0 top-[calc(100%+16px)] z-20">
              <MobileNav />
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-4 md:gap-6">
          <button
            disabled={isLoading || !board || !board.columns.length}
            onClick={() => {
              if (board) {
                openModal(<CreateTaskForm />);
              }
            }}
            className="icon-btn btn-primary btn-large md:hidden"
          >
            <PlusIcon />
          </button>
          <button
            disabled={isLoading || !board || !board.columns.length}
            onClick={() => {
              if (board) {
                openModal(<CreateTaskForm />);
              }
            }}
            className="btn btn-primary btn-large hidden md:flex"
          >
            <PlusIcon />
            Add New Task
          </button>
          <button
            disabled={isLoading || !board}
            onClick={() => toggleBoardOptions()}
            className="icon-btn text-black dark:text-white"
          >
            <EllipsisIcon />
          </button>
          {openBoardOptions && (
            <div className="absolute right-1 top-[calc(100%+16px)] z-10 flex w-[calc(100%-32px)] justify-end md:right-3 md:w-[calc(100%-48px)]">
              <div className="flex w-full max-w-48 flex-col gap-4 rounded-lg bg-white p-4 shadow-lg transition-colors dark:bg-grey-800">
                <button
                  disabled={isLoading || !board}
                  onClick={() => {
                    if (board) {
                      toggleBoardOptions(false);
                      openModal(<EditBoardForm />);
                    }
                  }}
                  className="text-btn text-grey-500"
                >
                  Edit Board
                </button>
                <button
                  disabled={isLoading || !board}
                  onClick={() => {
                    if (board?.id) {
                      toggleBoardOptions(false);
                      openModal(<DeleteBoard id={board.id} />);
                    }
                  }}
                  className="text-btn text-red"
                >
                  Delete Board
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {openMobileNav && (
        <div
          onClick={() => toggleMobileNav(false)}
          className="absolute inset-0 top-full z-10 h-[calc(100vh-69px)] bg-black/50 md:hidden"
        />
      )}
    </header>
  );
};

export default Header;
