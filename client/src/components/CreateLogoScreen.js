import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import { Button, Modal } from 'react-bootstrap';
import LayersMenu from './LayersMenu.js';
import ScaleText from "react-scale-text";

const ADD_LOGO = gql`
    mutation addLogo(
        $userId: String!
        $name: String!,
        $width: Int!,
        $height: Int!,
        $backgroundColor: String!,
        $borderColor: String!,
        $borderRadius: Int!,
        $borderWidth: Int!,
        $textBoxes: [textBoxInput],
        $imageBoxes: [imageBoxInput]) {
        addLogo(
            userId: $userId,
            name: $name,
            width: $width,
            height: $height,
            backgroundColor: $backgroundColor,
            borderColor: $borderColor,
            borderRadius: $borderRadius,
            borderWidth: $borderWidth,
            textBoxes: $textBoxes,
            imageBoxes: $imageBoxes),
             {
            _id
        }
    }
`;

class CreateLogoScreen extends Component {


    constructor(props) {
        super(props);
        // initial state with default logo attributes 

        this.state = {
            userId: "5ebc3e37ffbda00ce3d1d399",
            name: "goLogoLo Logo",
            width: 500,
            height: 500,
            backgroundColor : "#cccc44",
            borderColor: "#444444",
            borderRadius: 5,
            borderWidth: 2,
            textBoxes: [],
            imageBoxes: [],
            x: 100,
            y: 100,
            showImgModal: false,
            showTextModal: false,
            showToolsMenu: true,
            numLayers: 0 ,
        };

        this.logo = null;
    }


    isWithinRange = (e) => {
        let val=parseInt(e.target.value); let min=parseInt(e.target.min) ;let max=parseInt(e.target.max); 
        return (val>=min && val<=max);
    }

    printState = () =>{

    }

    handleShowImgModal = () => {
        this.setState({
            showImgModal : !this.state.showImgModal
        });
    }

    handleShowTextModal= () => {
        this.setState({
            showTextModal : !this.state.showTextModal
        });
    }

    updateLayers = (newLayers) => {
        // newLayers is ordered from topmost layer to bottommost 
        // for each item in newLayers build a new textBoxes and imageBoxes arrays to reflect the change in layer order 

        let newTextBoxes = [];
        let newImageBoxes = [];
        newLayers.reverse().forEach((item, index) => {
            if(item.url!==undefined){
                newImageBoxes.push({layerIndex: index, url: item.url, width: item.width, height: item.height, x: item.x, y: item.y});
            }
            else{
                newTextBoxes.push({layerIndex: index, text: item.text, fontSize: item.fontSize, color: item.color, width: item.width, height: item.height, x: item.x, y: item.y});
            }
        });

        this.setState({textBoxes: newTextBoxes, imageBoxes: newImageBoxes});
    }



    render() {
        let name, width, height, backgroundColor, borderColor, borderRadius, borderWidth, imageURL, text, fontSize, color;
        console.log("imageBoxes:  " + this.state.imageBoxes.length);
        console.log(...(this.state.imageBoxes.concat(this.state.textBoxes).sort((a,b)=>(a.layerIndex-b.layerIndex))));
        return (
            <Mutation mutation={ADD_LOGO} onCompleted={() => this.props.history.push('/')}>
                {(addLogo, { loading, error }) => (
                    <div className="">
                        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">

                            <Link to="/"><a class="navbar-brand" href="#">GoLogoLo</a></Link>
                            <div class="collapse navbar-collapse" id="navbarText">
                                <ul class="navbar-nav mr-auto">
                                </ul>
                                <span class="navbar-text">

                                    <ul class="navbar-nav mr-auto">
                                        <li class="nav-item">
                                            <a class="nav-link" href="#">Logout</a>
                                        </li>
                                    </ul>
                                </span>
                            </div>
                        </nav>

                        <div className="">
                            <div className="row" style={{height: "100vh"}}>
                                <div className="col-md-3">
                                    <div className="card card-default">
                                        <div className="card-body">
                                            <div className="card-heading">
                                                <h3 className="card-title">
                                                    Create Logo
                                                </h3>
                                            </div>
                                            <ul class="nav nav-tabs" >
                                                <li class="nav-item">
                                                    <a class={this.state.showToolsMenu ? "nav-link active" : "nav-link"} href="#" onClick={() => {this.setState({showToolsMenu: true})}}>Tools</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class={this.state.showToolsMenu ? "nav-link" : "nav-link active"} href="#" onClick={() => {this.setState({showToolsMenu: false})}}>Layers</a>
                                                </li>
                                            </ul>
                                            <div className="card card-default bg-dark" style={{color: "#ffffff"}}>
                                                <div className="card-body" >
                                                    { this.state.showToolsMenu ? <form onSubmit={e => {
                                                        e.preventDefault();
                                                        addLogo({ variables: { userId: this.state.userId,
                                                                            name: name.value, 
                                                                            width: parseInt(width.value), 
                                                                            height: parseInt(height.value), 
                                                                            backgroundColor: backgroundColor.value,
                                                                            borderColor: borderColor.value,
                                                                            borderRadius:  parseInt(borderRadius.value),
                                                                            borderWidth: parseInt(borderWidth.value),
                                                                            textBoxes: this.state.textBoxes,
                                                                            imageBoxes: this.state.imageBoxes 
                                                                            } });
                                                    }}>
                                                        <div className="form-group">
                                                            <label htmlFor="name">Name:</label>
                                                            <input type="text" required={true} className="form-control" name="name" onChange={(e) => this.setState({name: e.target.value}, this.printState)} ref={node => {
                                                                name = node;
                                                            }} placeholder="Name" defaultValue={this.state.name}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="width">Width:</label>
                                                            <input type="number" required={true}  min="2" max="500" className="form-control" name="width" onChange={(e) => {if (this.isWithinRange(e)) this.setState({width: e.target.value}, this.printState);}} ref={node => {
                                                                width = node;
                                                            }} placeholder="Width" defaultValue={this.state.width}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="height">Height:</label>
                                                            <input type="number" required={true}  min="2" max="500" className="form-control" name="height" onChange={(e) => {if (this.isWithinRange(e)) this.setState({height: e.target.value}, this.printState);}} ref={node => {
                                                                height = node;
                                                            }} placeholder="Height" defaultValue={this.state.height}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="backgroundColor">Background Color:</label>
                                                            <input type="color" required={true} className="form-control" name="color" onChange={(e) => this.setState({backgroundColor: e.target.value}, this.printState)} ref={node => {
                                                                backgroundColor = node;
                                                            }} placeholder="Background Color" defaultValue={this.state.backgroundColor}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="borderColor">Border Color:</label>
                                                            <input type="color" required={true} className="form-control" name="color" onChange={(e) => this.setState({borderColor: e.target.value}, this.printState)} ref={node => {
                                                                borderColor = node;
                                                            }} placeholder="Border Color" defaultValue={this.state.borderColor}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="borderRadius">Border Radius:</label>
                                                            <input type="number" required={true} min="0" max="144" className="form-control" name="borderRadius" onChange={(e) =>{ if (this.isWithinRange(e)) this.setState({borderRadius: e.target.value}, this.printState) }} ref={node => {
                                                                borderRadius = node;
                                                            }} placeholder="Border Radius" defaultValue={this.state.borderRadius} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="borderWidth">Border Width:</label>
                                                            <input type="number" required={true} min="0" max="144" className="form-control" name="borderWidth" onChange={(e) => {if (this.isWithinRange(e)) this.setState({borderWidth: e.target.value}, this.printState)}} ref={node => {
                                                                borderWidth = node;
                                                            }} placeholder="Border Width" defaultValue={this.state.borderWidth}/>
                                                        </div>
                                                        <div className="container"> 
                                                            <div className="row">
                                                                <div className="col-md-6 d-flex justify-content-center">
                                                                    <Button variant="primary" onClick={this.handleShowTextModal}>
                                                                           Insert Text 
                                                                    </Button>

                                                                    <Modal show={this.state.showTextModal} onHide={this.handleShowTextModal}>
                                                                        <Modal.Header closeButton>
                                                                            <Modal.Title>Insert Text</Modal.Title>
                                                                        </Modal.Header>
                                                                        <Modal.Body>
                                                                            <div class="input-group mb-3">
                                                                                <div class="input-group-prepend">
                                                                                    <span class="input-group-text" id="basic-addon1">Text</span>
                                                                                </div>
                                                                                <input type="text" class="form-control" placeHolder="Example Text" aria-label="TextBoxText" aria-describedby="basic-addon1" 
                                                                                ref={node => {text = node;}}/>
                                                                            </div>
                                                                            <div className="input-group mb-3">
                                                                                <div class="input-group-prepend">
                                                                                    <span class="input-group-text" id="basic-addon1">Color</span>
                                                                                </div>
                                                                                <input type="color" required={true} className="form-control" name="color"  ref={node => {
                                                                                    color = node;
                                                                                }} placeholder="Color" defaultValue="#000000" />
                                                                            </div>
                                                                        </Modal.Body>
                                                                        <Modal.Footer>
                                                                            <Button variant="secondary" onClick={this.handleShowTextModal}>
                                                                                Cancel
                                                                            </Button>
                                                                            <Button variant="primary" 

                                                                                    onClick={() =>{
                                                                                                    this.handleShowTextModal(); 
                                                                                                    this.setState((prevState) => {
                                                                                                        let newTextBoxArr = prevState.textBoxes;
                                                                                                        newTextBoxArr.push({layerIndex: prevState.numLayers, text: text.value, fontSize: fontSize.value, color: color.value, width: 100, height: "auto", x: 0, y: 0});
                                                                                                        return {textBoxes: newTextBoxArr, numLayers: prevState.numLayers+1}})
                                                                                                }}>
                                                                                Enter 
                                                                            </Button>
                                                                        </Modal.Footer>
                                                                    </Modal>
                                                                </div>

                                                                <div className="col-md-6 d-flex justify-content-center">
                                                                    <Button variant="primary" onClick={this.handleShowImgModal}>
                                                                           Insert Image 
                                                                    </Button>

                                                                    <Modal show={this.state.showImgModal} onHide={this.handleShowImgModal}>
                                                                        <Modal.Header closeButton>
                                                                            <Modal.Title>Insert Image</Modal.Title>
                                                                        </Modal.Header>
                                                                        <Modal.Body>
                                                                            <div class="input-group mb-3">
                                                                                <div class="input-group-prepend">
                                                                                    <span class="input-group-text" id="basic-addon1">Image URL</span>
                                                                                </div>
                                                                                <input type="text" class="form-control" placeHolder="http://example.com/image.jpg" aria-label="ImageURL" aria-describedby="basic-addon1" 
                                                                                ref={node => {imageURL = node;}}/>
                                                                            </div>
                                                                        </Modal.Body>
                                                                        <Modal.Footer>
                                                                            <Button variant="secondary" onClick={this.handleShowImgModal}>
                                                                                Cancel 
                                                                            </Button>
                                                                            <Button variant="primary" 
                                                                                    onClick={() =>{
                                                                                                    this.handleShowImgModal(); 
                                                                                                    this.setState((prevState) => {
                                                                                                        let newImageBoxArr = prevState.imageBoxes;
                                                                                                        newImageBoxArr.push({layerIndex: prevState.numLayers, url: imageURL.value, width: 30, height: 30, x: 0, y: 0});
                                                                                                        return {imageBoxes: newImageBoxArr, numLayers: prevState.numLayers+1}})
                                                                                                }}>
                                                                            Enter 
                                                                            </Button>
                                                                        </Modal.Footer>
                                                                    </Modal>
                                                                </div>
                                                            </div>
                                                            
                                                            <br/>
                                                            <div className="row">
                                                                <div className="col-md-12 d-flex justify-content-center">
                                                                    <button type="submit" className="btn btn-success">Submit</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form> : 
                                                    <LayersMenu textBoxes={this.state.textBoxes} imageBoxes={this.state.imageBoxes} updateLayers={this.updateLayers}></LayersMenu>
                                                  } 
                                                    {loading && <p>Loading...</p>}
                                                    {error && <p>Error :( Please try again</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-9 d-flex justify-content-center" style={{overflow: "auto"}}>
                                    <div className="align-self-center" style={{display: "block", width: this.state.width+"px", height: this.state.height+"px", backgroundColor: this.state.backgroundColor,
                                                borderColor: this.state.borderColor, borderRadius: this.state.borderRadius+"px", borderWidth: this.state.borderWidth+"px",
                                                borderStyle: "solid", position: "absolute" }}>

                                    {
                                        (this.state.textBoxes.concat(this.state.imageBoxes)).sort((a, b) => {return a.layerIndex-b.layerIndex}).map((item)=>(
                                        <Rnd
                                            size={{width:item.width, height:item.height}}
                                            enableResizing={{ top:true, right:true, bottom:true, left:true, topRight:true, bottomRight:true, bottomLeft:true, topLeft:true} } 
                                            bounds="parent"
                                            style={{borderStyle:"solid"}}
                                            onDragStop={(e, d) => { 
                                                this.setState(prevState =>{ 
                                                        return {
                                                            imageBoxes: prevState.imageBoxes.map((imageBox) => 
                                                                                                    {
                                                                                                        if (imageBox.layerIndex !== item.layerIndex) return imageBox;
                                                                                                        return {
                                                                                                            ...imageBox,
                                                                                                            x: d.x,
                                                                                                            y: d.y
                                                                                                        }
                                                                                                    }),
                                                            textBoxes: prevState.textBoxes.map((textBox) => 
                                                                                                    {
                                                                                                        if (textBox.layerIndex !== item.layerIndex) return textBox;
                                                                                                        return {
                                                                                                            ...textBox,
                                                                                                            x: d.x,
                                                                                                            y: d.y
                                                                                                        }
                                                                                                    })
                                                        }
                                                })
                                             }}
                                            position={{ x: item.x, y: item.y }}
                                            onResize={(e, direction, ref, delta, position) => {
                                                this.setState(prevState => ({
                                                    imageBoxes: prevState.imageBoxes.map((imageBox) => {
                                                       if (imageBox.layerIndex !== item.layerIndex) return imageBox;
                                                       return {
                                                            ...imageBox,
                                                            width: ref.style.width,
                                                            height: ref.style.height,
                                                            ...position
                                                        }

                                                    }),
                                                    textBoxes: prevState.textBoxes.map((textBox) => {
                                                       if (textBox.layerIndex !== item.layerIndex) return textBox;
                                                       return {
                                                            ...textBox,
                                                            width: ref.style.width,
                                                            height: ref.style.height,
                                                            ...position
                                                        }

                                                    }),
                                                }), this.setState({}))
                                            }}>
                                            {item.url!==undefined ? (<img src={item.url} draggable="false" alt="Image Error!" height={item.height+"px"} width={item.width+"px"}></img>) 
                                            : (<div style={{overflow:"hidden", width:"100%", height:"100%"}}><ScaleText widthOnly={true}><p >{item.text}</p></ScaleText></div>)}
                                        </Rnd>))
                                    }

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </Mutation>
        );
    }
}

export default CreateLogoScreen;