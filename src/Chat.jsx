import React, { useEffect, useState } from 'react';
import { chatServices } from './services/chat-services';
import { CircularProgress, Typography } from '@mui/material';
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
            console.log('the chat bot res ', response);
            setAnswer(response);
          } catch (err) {
            console.log('err ', err);
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

    return (
        <div>
            <input style={{ width: '50%', boxShadow: 24 }} 
                value={userInput} 
                onChange={handleInputChange}
                onKeyDown={handlSendUserInput}
                disabled={loading}
            >
            </input>
            <KeyboardReturn style={{ cursor: 'pointer' }}/>
            <div>
                {loading && <CircularProgress />}
                {answer && <Typography>{answer}</Typography>}
                {error && <p>Something bad happened</p>}
            </div>
        </div>
    );
};

export { Chat };