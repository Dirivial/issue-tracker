import "./IssueListItem.css";

export default function IssueListItem(props) {
    return (
        <div className="issue-list-item">
            <p>{props.name}</p>
        </div>
    )
}
