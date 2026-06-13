import {useState} from "react";

function Home() {
    const [showMessage, setShowMessage] = useState(true);
    return (
        <>
            <h1>Career Companion</h1>
            {showMessage && <p>Welcome to Career Companion!</p>}
            <button onClick={() => setShowMessage(prev => !prev)}>Toggle Message</button>
        </>
    );   

}

export default Home;