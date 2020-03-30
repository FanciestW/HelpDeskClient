import React from 'react';
import { Typography } from '@material-ui/core';

import travolta from '../../assets/confused_travolta.gif';

export default function NotFound() {
  return (
    <div style={{textAlign: 'center', margin: '20px'}}>
      <Typography variant='h3' component='h3' color='textPrimary'>404</Typography>
      <Typography variant='h4' component='h4' color='textPrimary'>Page Not Found</Typography>
      <img style={{position: 'fixed', left: 'calc(50% - 238px)', bottom: '0px'}} src={travolta} alt="Sorry..." />
    </div>
  );
}