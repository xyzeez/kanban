export interface BoardItemProps {
  title: string;
  to: string;
  onNavigate?: () => void;
}

export interface ThemeToggleProps {
  onToggle?: () => void;
}
