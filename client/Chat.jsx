import React, { useEffect, useState } from 'react';
import { chatServices } from './services/chat-services';
import { Grid, CircularProgress, Typography, Button } from '@mui/material';
import { KeyboardReturn } from '@mui/icons-material';

const styles = {
  grid: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  input: {
    boxShadow: 24,
    height: '25px',
    width: '300px',
    minWidth: '100px'
  }
}

const Chat = () => {
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleInputChange = (event) => {
        setError('');
        setUserInput(event.target.value);
    };

    const handlSendUserInput = async (event) => {
      event.persist();
      if (event.key !== "Enter") {
          return;
      }

      try {
        setLoading(true);
          const { response } = await chatServices.chatWithLLM({ userInput });
          setAnswer(response);
        } catch (err) {
          setError(err);
          return;
        } finally {
          setLoading(false);
        }
    };

    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    }

    const handleFileUpload = async () => {
      if (selectedFile) {
        try {
          setLoading(true);
          const form = new FormData();
          form.append('chat-file', selectedFile);
    
          const { success } = await chatServices.ingestFile({ fileInput: form })
          if (success) {
            setAnswer('Successfully ingested. Ask me anything.');
          }
        } catch (err) {
          setSelectedFile(null);
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    }

    useEffect(() => {
        if (userInput != null && userInput.trim() === "") {
          setAnswer('');
        }
      }, [userInput]);

    return (
        <Grid container spacing={2} style={styles.grid}>
          <Grid item xs={8} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              <input style={styles.input} 
                value={userInput} 
                onChange={handleInputChange}
                onKeyDown={handlSendUserInput}
                disabled={loading}
              />
              
              <KeyboardReturn style={{ marginLeft: '5px', marginTop: '5px' }} />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input accept=".pdf,.txt,.csv" id="file-input" type="file" onChange={handleFileChange}/>
              {selectedFile && (
                <Button onClick={handleFileUpload}>
                  Upload
                </Button>
              )}
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