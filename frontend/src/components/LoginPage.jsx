import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Image,
} from '@chakra-ui/react';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
  
    try {
      // Retrieve the IP address from localStorage
      const ipAddress = localStorage.getItem('ipAddress');
      if (!ipAddress) {
        throw new Error('IP address not found. Please refresh the page.');
      }
  
      // Send login request
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, ip_address: ipAddress }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Store user details, role, and token
        localStorage.setItem('access_token', data.access_token); // Save JWT token
        localStorage.setItem('user', JSON.stringify({ username, role: data.role })); // Save username and role
  
        // Pass role to App.js and redirect based on role
        onLogin(data.role); // Notify App.js about the login
        navigate(data.role === 'guard' ? '/guard-panel' : '/admin-panel', { replace: true });
      } else {
        // Display backend error message if available
        setErrorMessage(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while logging in. Please try again.');
      console.error('Login error:', error);
    }
  };
  
  // Updated color scheme for consistency with the home page
  const gradientBg =
    "linear-gradient(135deg, #4A628A, #7AB2D3, #B9E5E8, #DFF2EB)";
  const containerBg =
    "linear-gradient(135deg, rgba(223, 242, 235, 0.7), rgba(185, 229, 232, 0.6), rgba(122, 178, 211, 0.5), rgba(74, 98, 138, 0.4))";
  const buttonBg = "#4A628A";
  const buttonHoverBg = "#7AB2D3";
  const textColor = "#1C2D3A";
  const placeholderColor = "#4A628A";
  const boxShadow = "0px 8px 24px rgba(0, 0, 0, 0.15)";
  const buttonBorderHover = "#DFF2EB";

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg={gradientBg} p={8}>
      {/* Logo and Text Section */}
      <Box textAlign="center" mb={8}>
        <Image
          src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/BITS_Pilani-Logo.svg/1200px-BITS_Pilani-Logo.svg.png"
          alt="BITS Pilani Logo"
          boxSize="120px"
          mx="auto"
        />
        <Heading color={textColor} fontSize="3xl" fontWeight="bold" mt={4}>
          BITS PILANI
        </Heading>
        <Text color={textColor} fontSize="md" fontWeight="medium" mt={2}>
          Entry Exit System
        </Text>
      </Box>

      {/* Login Panel */}
      <Box
        bg={containerBg}
        backdropFilter="blur(15px) saturate(180%)"
        w="full"
        maxW="lg"
        p={8}
        borderRadius="xl"
        boxShadow={boxShadow}
        textAlign="center"
      >
        <Heading color={textColor} fontSize="2xl" fontWeight="bold" mb={6}>
          Login
        </Heading>
        {errorMessage && (
          <Alert status="error" mb={4} borderRadius="lg">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl id="username" isRequired>
              <FormLabel color={textColor}>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                bg="rgba(255, 255, 255, 0.3)"
                color={textColor}
                _placeholder={{ color: placeholderColor }}
                borderRadius="full"
                focusBorderColor={buttonBg}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel color={textColor}>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                bg="rgba(255, 255, 255, 0.3)"
                color={textColor}
                _placeholder={{ color: placeholderColor }}
                borderRadius="full"
                focusBorderColor={buttonBg}
              />
            </FormControl>
            <Button
              type="submit"
              bg={buttonBg}
              color="#FFFFFF"
              borderRadius="full"
              w="full"
              _hover={{
                bg: buttonHoverBg,
                border: `2px solid ${buttonBorderHover}`,
              }}
              _active={{ bg: buttonHoverBg }}
              boxShadow="sm"
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
      {/* Footer */}
      <Box
        as="footer"
        mt="auto"
        textAlign="center"
        p={0}
        
        color="black"
        fontSize="sm"
        borderRadius="md"
        
      >
        © 2024 BITS Pilani | Contact us :{' '}
        <a href="mailto:webmaster@pilani.bits-pilani.ac.in" style={{ color: 'black' }}>
          webmaster@pilani.bits-pilani.ac.in
        </a>
      </Box>
    </Box>
  );
};

export default LoginPage;
