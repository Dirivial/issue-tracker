import "./IssueListItem.css";

export default function IssueListItem(props) {
    return (
        <div className="issue-list-item">
            <p>{props.info}</p>
        </div>
    )
}
