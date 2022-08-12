import { useNavigate } from 'react-router-dom';

import { Draggable } from 'react-beautiful-dnd';

import './ContainerListItem.css';

export default function ContainerListItem({containerid, name, position}) {

    const navigate = useNavigate();

    const openContainer = () => {
        navigate("/containers/" + containerid);
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
