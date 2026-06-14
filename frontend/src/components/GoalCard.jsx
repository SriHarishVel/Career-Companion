function GoalCard(props) {
    return (
        <>
            <h2>{props.title}</h2>
            <p>Progress: {props.progress}%</p>
            <button onClick={()=> props.onProgress(props.id)}>Update Progress</button>
            <button onClick={()=> props.onDelete(props.id)}>Delete Goal</button>
        </>
    );
}

export default GoalCard;