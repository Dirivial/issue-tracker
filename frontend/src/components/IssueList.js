import Issue from '../components/IssueListItem.js';
import './IssueList.css';

export default function IssueList(props) {

    return (
        <div className="issue-list">
            <div className="list-name-wrapper">
                <h3>{props.name}</h3>
            </div>

            <div className="list-of-items">
                <Issue info="First issue in this list"/>
                <Issue info="Second issue in this list"/>
            </div>
        </div>
    )
}
