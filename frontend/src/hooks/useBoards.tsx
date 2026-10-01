function useBoards(){
    const boards = JSON.parse(localStorage.getItem('boards') ?? '[]');
    return boards.find((b)=> b.id === boardId);
}

export default useBoards;