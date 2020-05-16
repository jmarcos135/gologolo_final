import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const prepareList = list => list.map((e) => ({...e, id: `item-${e.layerIndex}`, content: `item ${e.layerIndex}`}));

// a little function to help us with reordering the result
/*
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
*/

const reorder = (list, startIndex, endIndex) => {
  const result = list.concat([]);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "#ffffff",
  padding: grid,
  width: 250
});

class LayersMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: prepareList(this.props.textBoxes.concat(this.props.imageBoxes).sort((a,b)=>{return b.layerIndex - a.layerIndex}))
    };
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    console.log("before:");
    this.state.layers.forEach((item)=>{
        console.log(item.url)
    })
    const layers = reorder(
      this.state.layers,
      result.source.index,
      result.destination.index
    );

    console.log("after:");
    layers.forEach((item)=>{
        console.log(item.url)
    })

    this.setState({
        layers: layers
    }, ()=>{this.props.updateLayers(layers)});
  }

  componentDidUpdate = (prevProps) => {
    console.log("\tLayersMenu component did update");
    if (this.props.textBoxes!== prevProps.textBoxes || this.props.imageBoxes!==prevProps.imageBoxes){
        this.setState({
            layers: prepareList(this.props.textBoxes.concat(this.props.imageBoxes).sort((a,b)=>{return b.layerIndex - a.layerIndex}))
        });
    }
}
  componentDidMount= () => {
    console.log("\tLayersMenu component did mount");
    /*
    this.setState({
        layers: prepareList(this.props.textBoxes.concat(this.props.imageBoxes).sort((a,b)=>{return a.layerIndex - b.layerIndex}))
    });*/
}

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.layers.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.url!==undefined ? item.url : item.text}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default LayersMenu;