import React, { useEffect, useState } from 'react';
import { chatServices } from './services/chat-services';
import { Grid, CircularProgress, Typography } from '@mui/material';
import { KeyboardReturn } from '@mui/icons-material';

const Chat = () => {
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        setError(null);
        setUserInput(event.target.value);
    };

    const handlSendUserInput = async (event) => {
        event.persist();
        if (event.key !== "Enter") {
            return;
        }

        try {
            setLoading(true);
            const { response } = await chatServices.create({ userInput });
            setAnswer(response);
          } catch (err) {
            setError(err);
            return;
          } finally {
            setLoading(false);
          }
    }

    useEffect(() => {
        if (userInput != null && userInput.trim() === "") {
          setAnswer('');
        }
      }, [userInput]);
    
    const gridStyle = {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    };

    const inputStyle = {
      boxShadow: 24,
      height: '25px',
      width: '300px',
      minWidth: '100px',
    }

    return (
        <Grid container spacing={2} style={gridStyle}>
          <Grid item xs={8} style={{ display: 'flex', flexDirection: 'row' }}>
            <input style={inputStyle} 
                value={userInput} 
                onChange={handleInputChange}
                onKeyDown={handlSendUserInput}
                disabled={loading}
            >
            </input>
            <div style={{ marginLeft: '5px', marginTop: '5px' }}>
              <KeyboardReturn />
            </div>
          </Grid>
          <Grid item xs={8}>
            <div>
                {loading && <div>
                  <CircularProgress color="secondary" />
                  <CircularProgress color="success" />
                  <CircularProgress color="inherit" />   
                </div>}
                {answer && <Typography>{answer}</Typography>}
                {error && <p>Something bad happened</p>}
            </div>
          </Grid>
        </Grid>
    );
};

export { Chat };