import { useNavigate } from 'react-router-dom';

import { Draggable } from 'react-beautiful-dnd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';
import './ContainerListItem.css';

export default function ContainerListItem({containerid, name, position}) {

    const navigate = useNavigate();

    const openContainer = () => {
        navigate("/containers/" + containerid);
    }

    const deleteContainer = () => {
        //deleteContainer(containerid);
        console.log("Tried deleting container with id", containerid);
    }

    return (
        <Draggable 
            draggableId={"" + containerid}
            index={position}
            type="CONTAINER"
        >
            {(provided, snapshot) => {
                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                            ...provided.draggableProps.style
                        }}
                        className="containerCard"
                        onClick={openContainer}
                    >
                        <h4 className="cardTitle">
                            {name}
                        </h4>
                    </div>
                );
            }}
        </Draggable>
    )
}
