import './ContainerList.css';

import ContainerListItem from '../components/ContainerListItem.js';

export default function ContainerList() {

  return (
    <div className="ContainerList">
        <h2 className="ContainerListHeader">These are my containers</h2>
        
        <div className="ContainerGridWrapper">
            <div className="ContainerGrid">
                <ContainerListItem name={"My first container"}/>
                <ContainerListItem name={"My second container"}/>
                <ContainerListItem name={"My second container"}/>
                <ContainerListItem name={"My second container"}/>
                <ContainerListItem name={"My second container"}/>
                <ContainerListItem name={"My second container"}/>
                <ContainerListItem name={"My second container"}/>
            </div>
        </div>
    </div>
  )
}
