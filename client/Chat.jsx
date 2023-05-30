import React, { useEffect, useState } from 'react';
import { chatServices } from './services/chat-services';
import { Grid, CircularProgress, Typography, List, ListItem, Button } from '@mui/material';
import { KeyboardReturn } from '@mui/icons-material';

const styles = {
  list: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '60%', 
    border: '1px solid green', 
    borderRadius: '2rem', 
    margin: '0 auto 2rem'
  },
  listItem: {
    width: '50%', 
    padding: '1rem', 
    textAlign: 'center', 
    listStyleType: 'none', 
    cursor: 'pointer', 
    transition: 'all 0.7s'
  },
  hoverListItem: {
    width: '50%', 
    padding: '1rem', 
    textAlign: 'center', 
    listStyleType: 'none', 
    cursor: 'pointer', 
    transition: 'all 0.7s',
    backgroundColor: '#39A2DB'
  },
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

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <List style={styles.list}>
      <ListItem onClick={() => setActiveTab('chat')} style={ activeTab === 'chat' ? styles.hoverListItem : styles.listItem}>
        Chat
      </ListItem>
      <ListItem onClick={() => setActiveTab('text')} style={ activeTab === 'text' ? styles.hoverListItem : styles.listItem}>
        Text file
      </ListItem>
    </List>
  );
};

const Chat = () => {
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('text');
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

    const handleFileUpload = (event) => {
      if (selectedFile) {
        // Perform the upload logic here
        console.log('Uploading file:', selectedFile);
        // Reset the selected file
        setSelectedFile(null);
      }
    }

    useEffect(() => {
        if (userInput != null && userInput.trim() === "") {
          setAnswer('');
        }
      }, [userInput]);

    return (
        <Grid container spacing={2} style={styles.grid}>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab}></Tabs>
          <Grid item xs={8} style={{ display: 'flex', flexDirection: 'column' }}>
            <input style={styles.input} 
                value={userInput} 
                onChange={handleInputChange}
                onKeyDown={handlSendUserInput}
                disabled={loading}
              />

              {activeTab === 'text' && <input accept="image/*" id="file-input" type="file" onChange={handleFileChange}/>}

              <Typography variant="subtitle1">
                {(selectedFile) ? `Selected file: ${selectedFile.name}` : 'No file selected'}
              </Typography>
              {selectedFile && (
                <Button>
                  Upload
                </Button>
              )}
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