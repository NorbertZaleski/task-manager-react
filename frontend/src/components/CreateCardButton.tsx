function CreateCardButton(){

    const handleAddCard = () => {
        console.log("add")
    };

    return (
      <div>
        <div className="border-2 border-dashed py-4">
            <button type="button" onClick={()=>handleAddCard()} className="text-2xl">+</button>
        </div>
      </div>  
    );
};

export default CreateCardButton;