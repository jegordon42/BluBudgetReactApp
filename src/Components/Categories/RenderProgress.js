import * as React from 'react';
import clsx from 'clsx';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: 26,
        borderRadius: 2,
      },
      value: {
        position: 'absolute',
        lineHeight: '24px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      },
      bar: {
        height: '100%',
        '&.low': {
          backgroundColor: '#f44336',
        },
        '&.medium': {
          backgroundColor: '#efbb5aa3',
        },
        '&.high': {
          backgroundColor: '#088208a3',
        },
      },
    }),
  { defaultTheme },
);

const ProgressBar = React.memo(function ProgressBar(props) {
  const value = props.value;
  const valueInPercent = value * 100;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.value}>{`${valueInPercent.toLocaleString()} %`}</div>
      <div
        className={clsx(classes.bar, {
          high: valueInPercent < 70,
          medium: valueInPercent >= 70 && valueInPercent <= 100,
          low: valueInPercent > 100,
        })}
        style={{ maxWidth: `${valueInPercent}%`, transition:'ease-in 0.5s'}}
      />
    </div>
  );
});

export function renderProgress(params) {
  return <ProgressBar value={params.value} />;
}