import React from 'react'
import { SketchPicker } from 'react-color'
import { useDetectClickOutside } from 'react-detect-click-outside';
import FormatColorFillRoundedIcon from '@mui/icons-material/FormatColorFillRounded';
import { IconButton} from '@mui/material';

export default function ColorBox(props) {
    var color = props.colorholder;
    let id = 0;

    if (props.id !==null){
        id = props.id;
    }

    const [displayColorPicker, setState] = React.useState(false);

    const handleClick = () => {
        setState(!displayColorPicker);
    };

    const handleClose = () => {
        setState(false);
    };

    const handleChange = (color) => {
        props.getValue(color.hex,id);
    };

    const ref = useDetectClickOutside({ onTriggered: handleClose });

        return (
            <>
                <div ref={ref} style={{ width:"40px",marginTop:"8px", marginLeft:"10px"}}>
                <IconButton style={{color:color}} onClick={() => handleClick()}>
                    <FormatColorFillRoundedIcon></FormatColorFillRoundedIcon>
                </IconButton>
                { displayColorPicker ? <div style={{position:"relative", zIndex:"10",top:"10px",left:"-100px"}}><div onClick={ handleClose }/>
                <SketchPicker color={ color } onChange={ handleChange } />
                </div> : null }
                </div>
            </>
        )
}