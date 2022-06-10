import React, { useState } from 'react';
import IssueList from '../components/IssueList.js';
import IssuePopup from '../components/IssuePopup.js' 
import './Container.css';


export default function Container() {

    const [issuePopupShow, setIssuePopupShow] = useState(false);

    function launchIssuePopup(props) {
        setIssuePopupShow(true);
    }

    return (
    <div className="container">
        <IssueList name="My first issue list" issuePopup={launchIssuePopup}/>
        <IssueList name="My second issue list" issuePopup={launchIssuePopup}/>

        <IssuePopup
            show={issuePopupShow}
            onHide={() => {setIssuePopupShow(false)}}
        />
    </div>
    )
}


