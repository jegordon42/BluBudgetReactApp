import React from 'react';
import * as constants from '../../constants'

const Paper = props => {
  return (
    <div style={{ ...paper, ...props.style }}>
        {props.children}
    </div>
  );
};

const paper = {
  padding:20,
  borderRadius:5,
  backgroundColor:'white',
  boxShadow: '0px 0px 5px ' + constants.colors.primaryColorButDarker
}

export default Paper;