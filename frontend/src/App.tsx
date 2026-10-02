import BoardList from "./components/BoardList";
import ThemeToggle from "./components/ThemeToggle";
import BoardPage from "./pages/BoardPage";

function App(){

  return (
    <>
      <BoardList></BoardList>
      <BoardPage></BoardPage>
      <div>
        <ThemeToggle></ThemeToggle>
      </div>
    </>
  )
}

export default App;