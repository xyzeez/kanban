import { FC } from "react";
import { NavLink } from "react-router";

// Hooks
import { useBoards } from "../../../hooks/useBoards";

// Components
import { BoardIcon } from "../../../components/Icons";
import CreateBoardButton from "./CreateBoardButton";

// Types
import { BoardItemProps } from "../../../types/navs";

const BoardItem: FC<BoardItemProps> = ({ title, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-btn w-full max-w-[276px] rounded-r-full px-6 py-4 font-bold capitalize transition-colors xl:px-8 ${
        isActive
          ? "bg-purple text-white"
          : "text-grey-500 enabled:hover:bg-purple-light/10 enabled:hover:text-purple"
      } `
    }
  >
    <BoardIcon />
    <span>{title}</span>
  </NavLink>
);

const BoardList: FC = () => {
  const { boards } = useBoards();

  return (
    <menu className="scrollbar md:hover-scrollbar relative overflow-y-auto overflow-x-hidden pr-3 font-sans">
      <li className="nav-header-bg sticky top-0 py-4 pl-6">
        <h2 className="text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
          All Boards ({boards?.length || 0})
        </h2>
      </li>
      {boards?.map((board) => (
        <li key={board.id}>
          <BoardItem title={board.name} to={`/boards/${board.slug}`} />
        </li>
      ))}
      <li className="w-full max-w-[276px] px-6 py-4 xl:px-8">
        <CreateBoardButton />
      </li>
    </menu>
  );
};

export default BoardList;
