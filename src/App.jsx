import React from 'react';
import { Chat } from './Chat';

export default () => {
  const gridStyle = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <>
    <div style={gridStyle}>
      <h1>Welcome to the LLM React App</h1>
      <p>This app is connected to a large language model and ready to go. Ask it anything below.</p>
      <Chat/>
    </div>
    
    </>
  )
};
