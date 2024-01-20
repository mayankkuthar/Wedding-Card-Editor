import React, { Component } from 'react';
import ColorBox from './components/form/FormColorPicker';
import { fabric } from 'fabric';
import { Container, CssBaseline, Grid, TextField, MenuItem, Select, Button } from '@mui/material';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      color: "#000000",
      objects: [],
      selected_size: "12",
      selected_font: "Arial",
      text: "",
      selectedAlignment: 'left',
    };
  }


  componentDidMount() {
    this.initCanvas();
  }

  initCanvas = () => {
    const canvasElement = this.canvasRef.current;
    this.canvas = new fabric.Canvas(canvasElement, {
      width: 756,
      height: 900,
    });

    // Set the background image with 50% opacity
    fabric.Image.fromURL('https://i.pinimg.com/736x/c7/f4/60/c7f460b2c2bd239413e22f2944559ab6.jpg', (img) => {
      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
        scaleX: this.canvas.width / img.width,
        scaleY: this.canvas.height / img.height,
        opacity: 0.5, // Set the opacity here (0 to 1)
      });
    });

    this.canvas.on('object:moving', (e) => {
      const { objects } = this.state;
      const updatedObjects = objects.map((obj) =>
        obj.id === e.target.id
          ? { ...obj, left: e.target.left, top: e.target.top }
          : obj
      );
      this.setState({ objects: updatedObjects });
    });

    this.canvas.on('mouse:down', (e) => {
      const target = this.canvas.findTarget(e.e);
      if (target && target.selectable) {
        this.canvas.setActiveObject(target);
      } else {
        this.canvas.discardActiveObject();
      }
      this.canvas.renderAll();
    });

    this.canvas.on('mouse:down', (e) => {
      const target = this.canvas.findTarget(e.e);
      if (target && target.selectable) {
        this.canvas.setActiveObject(target);
      } else {
        this.canvas.discardActiveObject();
      }
      this.canvas.renderAll();
    });

    this.canvas.on('object:selected', (e) => {
      const selectedObject = e.target;
      if (selectedObject) {
        selectedObject.set({
          lockMovementX: false,
          lockMovementY: false,
        });
        this.canvas.renderAll();
      }
    });

    this.canvas.on('selection:cleared', () => {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        activeObject.set({
          lockMovementX: true,
          lockMovementY: true,
        });
        this.canvas.renderAll();
      }
    });

    document.addEventListener('keydown', (e) => {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        switch (e.key) {
          case 'ArrowUp':
            activeObject.set({ top: activeObject.top - 5 });
            break;
          case 'ArrowDown':
            activeObject.set({ top: activeObject.top + 5 });
            break;
          case 'ArrowLeft':
            activeObject.set({ left: activeObject.left - 5 });
            break;
          case 'ArrowRight':
            activeObject.set({ left: activeObject.left + 5 });
            break;
          default:
            break;
        }
        this.canvas.renderAll();
      }
    });
  };

  addText = () => {
    const { text, selected_font, selected_size, selectedAlignment, color, objects } = this.state;

    const newText = new fabric.Textbox(text, {
      left: 350,
      top: 200,
      fontSize: selected_size,
      fill: color,
      fontFamily: selected_font,
      textAlign: selectedAlignment,
      borderColor: 'black',
      cornerColor: 'black',
      cornerSize: 10,
      transparentCorners: false,
      id: Date.now(),
      selectable: true,
      hasControls: true,
    });

    newText.on('selected', () => {
      this.canvas.setActiveObject(newText);
    });

    this.canvas.add(newText);
    this.setState({ objects: [...objects, newText] });
    this.canvas.setActiveObject(newText);
    this.canvas.renderAll();
  };

  deleteSelectedText = () => {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
      const updatedObjects = this.state.objects.filter(
        (obj) => obj.id !== activeObject.id
      );
      this.setState({ objects: updatedObjects });
    }
  };

  ColoringBasedBox(props) {
    const color_value = props.color_value;
    return (
      <>
        <Grid item style={{ display: "flex", justifyContent: "right" }}>
        </Grid>
        {// eslint-disable-next-line
          <>
            <Grid style={{ paddingLeft: "10px", backgroundColor: "rgb(243, 242, 241)", height: "76px", display: "flex", justifyContent: "Left" }}>
              Select Color 🎨 :
              <ColorBox getValue={props._getValueSerColorval} id={1} colorholder={color_value}></ColorBox>
            </Grid>
          </>
        }
      </>
    )
  }

  render() {
    console.log(this.state)
    const _getValueSerColorval = (data, id) => {
      this.setState({ color: data });
    }

    const _Changetext = (data) => {
      this.setState({ text: data });
    }

    const _Changesize = (data) => {
      this.setState({ selected_size: data });
    }

    const _Changefont = (data) => {
      this.setState({ selected_font: data });
    }

    const handleFontColorChange = () => {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        activeObject.set({ fill: this.state.color });
        activeObject.set({ fontFamily: this.state.selected_font });
        activeObject.set({ fontSize: this.state.selected_size });
        this.canvas.renderAll();
      }
    }

    return (

      <Container component="main" maxWidth="lg" style={{ height: '97vh', margin: "10px auto" }}>
        <CssBaseline />
        <Grid container spacing={2} style={{ minWidth: "100%", width: "100%", margin: "10px 10px 10px 10px" }}>
          <Grid item xs={8} style={{ width: "100%", padding: "0px 10px 10px 10px", height: "96vh" }}>
            <canvas ref={this.canvasRef}></canvas>
          </Grid>
          <Grid item xs={4} style={{ backgroundColor: "rgb(243, 242, 241)", width: "100%", padding: "10px 10px 10px 10px", display: "flex", flexDirection: "column" }}>
            <this.ColoringBasedBox _getValueSerColorval={_getValueSerColorval} color_value={this.state.color} />
            Select Font:
            <Select
              style={{ height: "60px" }}
              id="fontSelector"
              value={this.state.selected_font}
              label="Select Font"
              onChange={(e) => _Changefont(e.target.value)}
            >
              <MenuItem value="Arial">Arial</MenuItem>
              <MenuItem value="Times New Roman">Times New Roman</MenuItem>
              <MenuItem value="Courier New">Courier New</MenuItem>
              <MenuItem value="Helvetica">Helvetica</MenuItem>
              <MenuItem value="Georgia">Georgia</MenuItem>
              <MenuItem value="Palatino">Palatino</MenuItem>
              <MenuItem value="Garamond">Garamond</MenuItem>
            </Select>
            Select Size:
            <Select
              style={{ height: "60px" }}
              id="sizeSelector"
              value={this.state.selected_size}
              label="Select Size"
              onChange={(e) => _Changesize(e.target.value)}
            >
              <MenuItem value="12">12</MenuItem>
              <MenuItem value="16">16</MenuItem>
              <MenuItem value="20">20</MenuItem>
              <MenuItem value="25">25</MenuItem>
              <MenuItem value="30">30</MenuItem>
              <MenuItem value="40">40</MenuItem>
              <MenuItem value="50">50</MenuItem>
              <MenuItem value="60">60</MenuItem>
              <MenuItem value="70">70</MenuItem>
              <MenuItem value="80">80</MenuItem>
              <MenuItem value="90">90</MenuItem>
              <MenuItem value="100">100</MenuItem>
            </Select>
            Add Text:
            <TextField
              id="textInput"
              label="Enter Text"
              multiline
              rows={4}
              variant="outlined"
              value={this.state.text}
              onChange={(e) => _Changetext(e.target.value)}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <Button style={{ margin: "10px 0 0 0" }} variant="contained" color="primary" onClick={this.addText}>
              Add Text
            </Button>
            <Button style={{ margin: "10px 0 0 0" }} variant="contained" color="primary" onClick={this.deleteSelectedText}>
              Delete Text
            </Button>
            <Button style={{ margin: "10px 0 0 0" }} variant="contained" color="primary" onClick={handleFontColorChange}>
              Change Format
            </Button>
            * Use ← ↑ → ↓ keys to move selected textbox.
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default App;
