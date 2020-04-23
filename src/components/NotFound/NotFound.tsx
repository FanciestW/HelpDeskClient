import React from 'react';
import { Typography } from '@material-ui/core';

import travolta from '../../assets/confused_travolta.gif';

export default function NotFound() {
  return (
    <div style={{textAlign: 'center', padding: '20px'}}>
      <Typography variant='h3' component='h3' color='textPrimary' style={{ zIndex: 0 }}>404</Typography>
      <Typography variant='h4' component='h4' color='textPrimary' style={{ zIndex: 0 }}>Page Not Found</Typography>
      <img style={{position: 'fixed', left: 'calc(50% - 238px)', bottom: '0px', zIndex: 1 }} src={travolta} alt="Sorry..." />
    </div>
  );
}