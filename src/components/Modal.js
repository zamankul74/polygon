import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        activeItem: {
            name: "",
            points: [['',''],['',''],['',''],['','']],
          },
        previousPointX:'',
        previousPointY:'',
        count: 0
    };
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.gRef = React.createRef()
  }

  handleChange = (data, e) => {
    let { name, value } = e.target;

    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem: activeItem});
  };

  handleMouseClick(event){
    const count = this.state.count
    const canvas = this.gRef.current;
    const x = event.offsetX;
    const y = event.offsetY;
    const previousPointX = this.state.previousPointX;
    const previousPointY = this.state.previousPointY;
    // console.log(count, count+1)
    if(count <= 4) {
        this.setState({
            previousPointX:event.offsetX,
            previousPointY:event.offsetY,
        }, ()=> {

            const ctx = canvas.getContext("2d");
            if (previousPointX === ""){
                ctx.moveTo(x,y);
                ctx.lineTo(x+1,y+1);
                ctx.stroke();
                ctx.closePath();
            } else {
                if (Math.abs(previousPointX - x) > 3 && Math.abs(previousPointY - x) > 3){
                    ctx.moveTo(previousPointX,previousPointY);
                    if(count !== 4){
                        ctx.lineTo(x,y);
                    } else {
                        ctx.lineTo(parseInt(this.state.activeItem.points[0][0]),parseInt(this.state.activeItem.points[0][1]));
                    }
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        })
    }
    if(count < 4) {
        let activeItem = { ...this.state.activeItem };
        activeItem.points[count][0] = parseFloat(x).toFixed(2)
        activeItem.points[count][1] = parseFloat(y).toFixed(2)
        console.log(this.state.activeItem, activeItem)
        this.setState({activeItem: activeItem})
    }
    this.setState({count: count + 1})
  };
  handleMouseMove(event){}
  componentDidMount() {
      // const canvas = this.gRef.current;
      // const ctx = canvas.getContext("2d");
      // ctx.fillStyle = 'rgb(200,255,255)';
      // ctx.fillRect(0, 0, 640, 425);
  }

  render() {
    const { toggle, onSave } = this.props;
    const { points } = this.state.activeItem;

    const Point = ({point,idx}) => {
        return <Label for="todo-points">Point {idx}
        {point.map( (p,k) => 
            <Input key={k} disabled={true} value={p} name={`[${idx}][${k}]`} placeholder="Enter coordinate"/> )}
        </Label>
     }

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Polygon</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="todo-name">Name</Label>
              <Input
                type="text"
                id="todo-name"
                name="name"
                value={this.state.activeItem.name}
                onChange={this.handleChange.bind(this, [])}
                placeholder="Enter Name"
              />
            </FormGroup>
            <FormGroup>
              {points.map( (point, key) => <Point point={point} idx={key} key={key} /> )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
            <div>    
                <canvas id="canvas" ref={this.gRef}
                        width={460}
                        height={425}

                        onMouseMove={
                            e => {
                                let nativeEvent = e.nativeEvent;
                                this.handleMouseMove(nativeEvent);
                            }}    
                        onClick={
                            e => {
                                let nativeEvent = e.nativeEvent;
                                this.handleMouseClick(nativeEvent);
                            }}
                />
            </div> 

          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}