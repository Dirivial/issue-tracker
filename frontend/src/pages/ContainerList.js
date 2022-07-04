import NewContainerButton from '../components/NewContainerButton.js';
import ContainerListItem from '../components/ContainerListItem.js';

import './ContainerList.css';

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
                <NewContainerButton />
            </div>
        </div>
    </div>
  )
}
