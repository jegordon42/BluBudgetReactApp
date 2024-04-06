import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import Paper from '../Common/Paper';
import PieChart from './PieChart'
import Metrics from './Metrics';
import Compared from './Compared';
import CategoriesGrid from './CategoriesGrid'

function CategoriesPage(props) {
  const type = useSelector((state) => state.filters.type)
  
  return (
    <div style={page}>
      <div style={{marginRight:10, flex:1, display:'flex', flexDirection:'column'}}>
        <Paper style={{marginBottom:10}}>
          <Metrics />
        </Paper>
        <Paper style={{height:'100%'}}>
          <PieChart />
        </Paper>
      </div>
      <Paper style={{flex:1, height:'100%', paddingRight:0, paddingLeft:0, paddingBottom:0}}>  
        <CategoriesGrid />
      </Paper>
    </div>
  );
}

const page = {
  display:'flex',
  flexDirection:'row',
  padding:10,
  width:'100%',
  height:'100%'
}

export default CategoriesPage;
