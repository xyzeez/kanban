import { FC } from "react";
import { NavLink } from "react-router";
import { motion } from "framer-motion";

// Hooks
import { useBoards } from "../../../hooks/useBoards";

// Components
import { BoardIcon } from "../../../components/Icons";
import CreateBoardButton from "./CreateBoardButton";

// Types
import { BoardItemProps } from "../../../types/navs";

// Utils
import { cn } from "../../../utils/styles";

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const BoardItem: FC<BoardItemProps> = ({ title, to }) => (
  <motion.li variants={itemVariants}>
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "block w-full max-w-[276px] rounded-r-full text-grey-500 transition-colors",
          isActive
            ? "bg-purple text-white"
            : "hover:bg-purple-light/10 hover:text-purple",
        )
      }
    >
      <motion.div
        className="flex flex-row items-center gap-3 px-6 py-4 text-base font-bold capitalize xl:gap-4 xl:px-8"
        whileHover={{ x: 4 }}
        whileTap={{ x: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <BoardIcon />
        <span>{title}</span>
      </motion.div>
    </NavLink>
  </motion.li>
);

const BoardList: FC = () => {
  const { boards } = useBoards();

  return (
    <motion.menu
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className="scrollbar md:hover-scrollbar relative overflow-y-auto overflow-x-hidden pr-3 font-sans"
    >
      <motion.li
        variants={itemVariants}
        className="nav-header-bg sticky top-0 py-4 pl-6"
      >
        <h2 className="text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
          All Boards ({boards?.length || 0})
        </h2>
      </motion.li>
      {boards?.map((board) => (
        <BoardItem
          key={board.id}
          title={board.name}
          to={`/boards/${board.slug}`}
        />
      ))}
      <motion.li
        variants={itemVariants}
        className="w-full max-w-[276px] px-6 py-4 xl:px-8"
      >
        <CreateBoardButton />
      </motion.li>
    </motion.menu>
  );
};

export default BoardList;
