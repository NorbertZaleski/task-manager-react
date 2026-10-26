
type InputProps = {
    placeholder: string;
}

function Input({placeholder}: InputProps) {
    return (
        <input
        placeholder={placeholder}
        className="outline-(--border-mute) flex-1"
        >
        
        </input>
    )
}

export default Input;