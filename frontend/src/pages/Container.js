import IssueList from '../components/IssueList.js';
import './Container.css';


export default function Container() {

    return (
    <div className="container">
        <IssueList name="My first issue list"/>
        <IssueList name="My second issue list"/>
    </div>
    )
}


