import React, {useRef, useEffect} from 'react';
import * as constants from '../../constants'
import Paper from './Paper'

const Modal = (props) => {
  const ref = useRef(null)

  let modal = {
    position:'absolute',
    zIndex:1000,
  }
  if(props.center){
    modal = {
      ...modal,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
        if(props.ignoreRef && props.ignoreRef.current && props.ignoreRef.current.contains(event.target))
          return
        if (ref.current && !ref.current.contains(event.target))
            props.onClose()
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {document.removeEventListener("mousedown", handleClickOutside);};
  }, [ref]);

  if(!props.show) 
    return null

  return (
    <div style={{ ...props.style, ...modal }} ref={ref}>
      <Paper style={props.paperStyle}>
        {props.children}
      </Paper>
    </div>
    
  );
};

export default Modal