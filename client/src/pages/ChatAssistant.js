import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Avatar,
  Chip,
  Fade,
  Zoom,
  CircularProgress,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from 'axios';

const quickQuestions = [
  { text: "What are the current property trends?", icon: <ApartmentIcon /> },
  { text: "How do I price my property?", icon: <AttachMoneyIcon /> },
  { text: "Help me find a property", icon: <SearchIcon /> },
];

function ChatAssistant() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const chatEndRef = useRef(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(message);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = text.trim();
    setMessage('');
    setChatHistory((prev) => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: formatTimestamp()
    }]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5013/api/chat', {
        message: userMessage,
      });

      // Simulate typing effect
      setTypingTimeout(setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { 
            role: 'assistant', 
            content: response.data.reply,
            timestamp: formatTimestamp()
          },
        ]);
      }, 500));

    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: formatTimestamp()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Zoom in={true} timeout={800}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            borderRadius: '12px 12px 0 0',
            mb: 2
          }}>
            <Typography variant="h4" component="h1" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontWeight: 600
            }}>
              <SmartToyIcon sx={{ fontSize: 32 }} />
              AI Property Assistant
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Your personal guide for all property-related queries
            </Typography>
          </Box>

          {chatHistory.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 3,
              my: 4 
            }}>
              <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
                Get started with some quick questions
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {quickQuestions.map((q, index) => (
                  <Grid item key={index}>
                    <Chip
                      icon={q.icon}
                      label={q.text}
                      onClick={() => handleQuickQuestion(q.text)}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        '&:hover': {
                          background: theme.palette.primary.light,
                          color: 'white'
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            px: 2,
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
              '&:hover': {
                background: '#666',
              },
            },
          }}>
            <List>
              {chatHistory.map((chat, index) => (
                <Fade in={true} timeout={500} key={index}>
                  <ListItem
                    sx={{
                      flexDirection: 'column',
                      alignItems: chat.role === 'user' ? 'flex-end' : 'flex-start',
                      py: 1,
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      maxWidth: '80%',
                      flexDirection: chat.role === 'user' ? 'row-reverse' : 'row'
                    }}>
                      <Avatar
                        sx={{
                          bgcolor: chat.role === 'assistant' ? 'primary.main' : 'secondary.main',
                        }}
                      >
                        {chat.role === 'assistant' ? <SmartToyIcon /> : <PersonIcon />}
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          bgcolor: chat.role === 'assistant' ? 'grey.100' : 'primary.main',
                          color: chat.role === 'assistant' ? 'text.primary' : 'white',
                        }}
                      >
                        <Typography variant="body1">
                          {chat.content}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block',
                            mt: 1,
                            opacity: 0.7,
                            textAlign: chat.role === 'user' ? 'right' : 'left'
                          }}
                        >
                          {chat.timestamp}
                        </Typography>
                      </Paper>
                    </Box>
                  </ListItem>
                </Fade>
              ))}
              {isLoading && (
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <SmartToyIcon />
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <CircularProgress size={20} />
                      <Typography>Thinking...</Typography>
                    </Paper>
                  </Box>
                </ListItem>
              )}
              <div ref={chatEndRef} />
            </List>
          </Box>

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              mt: 2,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: 'background.paper',
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={isLoading || !message.trim()}
                  sx={{
                    height: '100%',
                    px: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    }
                  }}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Zoom>
    </Container>
  );
}

export default ChatAssistant; 