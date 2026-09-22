import { useAuth } from "../context/AuthContext";

function Items() {
    const {logout} = useAuth();

    return (
        <div>
            <h2>Items Page</h2>
            <p>
                You Already Login
            </p>
            <button 
            onClick={logout}>
                Logout
            </button>
        </div>
    )
}

export default Items;