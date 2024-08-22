import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { CircularProgress, Typography, TextField, Box, Button } from '@mui/material';




const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    

    setEmailError('');
    setPasswordError('');
    setError('');

    // Validation
    if (!email) {
      setEmailError('Email is required');
    }
    if (!password) {
      setPasswordError('Password is required');
    }
    if (!email || !password) {
      
      return;
    }
    setIsLoading(true);
    try {
      // This is a placeholder for real authentication logic
      // Replace this with actual authentication in the future
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

      if (error) {
        setError(error.message);
        console.log(error.message);
      } else {
        if (data.length === 1) {
          // Placeholder: You should validate the password here in the future
          console.log(data[0].first_name, data[0].last_name);
          setUser(data[0]);
          navigate(`/`);
        } else {
          setError("No account with this email was found");
          console.log("No account with this email was found");
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const buttonStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    gradient: "bg-gradient-to-r from-orange-400 to-orange-600 focus:ring-orange-500 text-primary-foreground font-bold hover:bg-primary/90 text-base",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };


  const buttonSizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50" display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box className="w-full max-w-md mx-auto text-center" width="100%" maxWidth="400px" textAlign="center">
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 'bold',
          marginBottom: '16px',
          textAlign: 'left',
        }}
      >
        Welcome!
      </Typography>
        
        <form onSubmit={handleSubmit} className="w-full space-y-6 justify-between">
          <Box className="flex flex-col items-center" >
            <TextField
              type="email"
              label="Email"
              value={email}
              error={!!emailError}  // Trigger red outline when there is an error
              helperText={emailError}  // Display error message in red
              onChange={(e) => setEmail(e.target.value)}
              
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px', // Fully rounded corners
                },
              }}
            />
          </Box>
          <Box className="flex flex-col items-center"  >
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}  // Trigger red outline when there is an error
              helperText={passwordError}  // Display error message in red
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '50px', // Fully rounded corners
                },
              }}
            />
          </Box>
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button
            type="submit"
            disabled={isLoading}
            fullWidth
            sx={{
              color: 'white',
              borderRadius: '50px',
              background: 'linear-gradient(45deg, #FB923C 30%, #EA590E 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #F28934 30%, #DF530B 90%)', // Darker shade on hover
              },
              textTransform: 'none',
              fontWeight: 'bold', // Make the text bold
              fontSize: '18px', // Increase the font size 
            }}
            
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <CircularProgress size={24} className="text-white" />
                <span className="ml-2">Loading</span>
              </div>
            ) : (
              'Login'
            )}
          </Button>
        </form>
        <Box className="mt-4" marginTop="16px">
          <Typography variant="body2">
            Are you a restaurant owner?{' '}
            <Link to="/restaurant/login" className="text-orange-600">
              Login here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box> 
    
    
    
  );
};


export default Login;
{/* <div className="flex items-center justify-center min-h-screen bg-background">
  <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 className="text-4xl font-bold mb-4 text-center text-foreground">Welcome!</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full py-2 px-4 border border-border rounded-md focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full py-2 px-4 border border-border rounded-md focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p className="text-destructive text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 text-white bg-primary rounded-full shadow-md hover:bg-primary-foreground focus:outline-none ${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-white border-t-transparent border-t-4 rounded-full animate-spin"></div>
              <span className="ml-2">Loading</span>
            </div>
          ) : (
            'Login'
          )}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-muted">
          Are you a restaurant owner?{' '}
          <Link to="/restaurant/login" className="text-accent">
            Login here
          </Link>
        </p>
      </div>
  </div>
</div> */}


     