import useTheme from "../hooks/useTheme";

function ThemeToggle() {
    const {theme, toggleTheme} = useTheme();

    return (
      <button onClick={toggleTheme}>
      Przełącz motyw, aktualnie: {theme}
      </button>
    );
}
export default ThemeToggle;