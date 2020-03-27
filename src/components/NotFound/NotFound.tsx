import React from 'react';

import travolta from '../../assets/confused_travolta.gif';

export default function NotFound() {
  return (
    <div style={{textAlign: 'center',}}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <img style={{position: 'fixed', left: 'calc(50% - 238px)', bottom: '0px'}} src={travolta} alt="Sorry..." />
    </div>
  );
}