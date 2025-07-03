import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Text,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';

function Home({ onLogout }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e) => {
    const input = e.target.value;

    if (/^\d*$/.test(input) && input.length <= 10) {
      setMobileNumber(input);
    }
  };

  // Handle focus and blur events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (!mobileNumber.trim()) {
      setIsFocused(false);
    }
  };

  // Submit logic
  const handleSubmit = () => {
    if (mobileNumber.trim().length === 10) {
      navigate('/visitor-details', { state: { mobileNumber } });
    } else {
      alert('Please enter a valid 10-digit mobile number.');
    }
  };

  // Logout logic
  // const handleLogout = async () => {
  //   try {
  //     const token = localStorage.getItem('access_token');
  //     console.log(token);
  //     if (!token) {
  //       alert('No token found. Please log in again.');
  //       navigate('/');
  //       return;
  //     }
  
  //     const response = await fetch('http://localhost:5000/logout', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`, // Include the token
  //       },
  //     });
  
  //     if (response.ok) {
  //       localStorage.removeItem('access_token'); // Clear the token
  //       alert('Logged out successfully.');
  //       navigate('/'); // Redirect to login page
  //     } else {
  //       const errorData = await response.json();
  //       alert(`Logout failed: ${errorData.error}`);
  //     }
  //   } catch (error) {
  //     alert('An error occurred during logout. Please try again.');
  //   }
  // };

  const handleLogout = async () => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token || token.trim() === '') {
            alert('No valid token found. Please log in again.');
            navigate('/'); // Redirect to login page
            return;
        }

        console.log("Sending token:", token); // Debugging log

        const response = await fetch('http://localhost:5000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include the token
            },
        });

        if (response.ok) {
            // Clear session data
            localStorage.removeItem('access_token');
            // localStorage.removeItem('user');
            onLogout();
            alert('Logged out successfully.');
            navigate('/'); // Redirect to login page
        } else {
            const errorData = await response.json();
            alert(`Logout failed: ${errorData.error || 'Unknown error occurred.'}`);
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout. Please try again.');
    }
};

  

  // Button click actions
  const handleExitClick = () => {
    navigate('/exit-contact');
  };

  // Styling variables
  const gradientBg = 'linear-gradient(135deg, #4A628A, #7AB2D3, #B9E5E8, #DFF2EB)';
  const containerBg = 'linear-gradient(135deg, rgba(223, 242, 235, 0.7), rgba(185, 229, 232, 0.6), rgba(122, 178, 211, 0.5), rgba(74, 98, 138, 0.4))';
  const buttonBg = '#4A628A';
  const buttonHoverBg = '#7AB2D3';
  const textColor = '#1C2D3A'; // Darker text color for better readability
  const placeholderColor = '#4A628A'; // Matching the theme while readable
  const boxShadow = '0px 8px 24px rgba(0, 0, 0, 0.15)';
  const buttonBorderHover = '#DFF2EB';

  // Inline styles for placeholder animation
  const placeholderStyle = {
    position: 'absolute',
    top: isFocused || mobileNumber ? '0' : '50%',
    left: '16px',
    fontSize: '14px',
    color: isFocused || mobileNumber ? '#FFFFFF' : placeholderColor,
    fontWeight: 'normal',
    background: isFocused || mobileNumber ? buttonBg : 'transparent',
    borderRadius: '8px',
    padding: isFocused || mobileNumber ? '2px 6px' : '0',
    transform: isFocused || mobileNumber
      ? 'translateY(-50%)'
      : 'translateY(-50%)',
    lineHeight: '1',
    opacity: 1,
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
  };

  // Input container styling
  const inputContainerStyle = {
    position: 'relative',
    width: '100%',
    border: `2px solid ${isFocused ? buttonBg : placeholderColor}`,
    borderRadius: '25px',
    background: 'rgba(255, 255, 255, 0.3)',
    padding: '12px 16px',
    transition: 'border-color 0.3s ease, padding 0.3s ease',
  };

  // Input field styling
  const inputStyle = {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    background: 'transparent',
    color: textColor,
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={gradientBg} p={8}>
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
        <VStack spacing={6}>
          {/* Header */}
          <Heading color={textColor} fontSize="2xl" fontWeight="bold">
            BITS Visitor System
          </Heading>
          <Text fontSize="sm" color={textColor}>
            Managing Visitors Seamlessly
          </Text>

          {/* Entry Section */}
          <VStack spacing={4} w="full">
            <Text fontSize="lg" fontWeight="medium" color={textColor}>
              Enter Mobile Number
            </Text>
            <Box style={inputContainerStyle}>
              <input
                type="text"
                value={mobileNumber}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                maxLength={10}
                style={inputStyle}
              />
              <span style={placeholderStyle}>Mobile Number</span>
            </Box>
            <Button
              onClick={handleSubmit}
              bg={buttonBg}
              color="#FFFFFF"
              borderRadius="full"
              w="full"
              _hover={{
                bg: buttonHoverBg,
                border: `2px solid ${buttonBorderHover}`,
              }}
              _active={{ bg: buttonHoverBg }}
            >
              Submit
            </Button>
          </VStack>

          {/* Exit Options */}
          <VStack spacing={4} w="full">
            <Text fontSize="lg" fontWeight="medium" color={textColor}>
              Exit Options
            </Text>
            <Button
              onClick={handleExitClick}
              bg={buttonBg}
              color="#FFFFFF"
              borderRadius="full"
              w="full"
              _hover={{
                bg: buttonHoverBg,
                border: `2px solid ${buttonBorderHover}`,
              }}
              _active={{ bg: buttonHoverBg }}
            >
              Exit
            </Button>
          </VStack>

          {/* Visitor Info Section */}
          <VStack spacing={4} w="full">
            <Text fontSize="lg" fontWeight="medium" color={textColor}>
              Visitor Information
            </Text>
            <Button
              onClick={() => navigate('/inside-visitors')}
              bg={buttonBg}
              color="#FFFFFF"
              borderRadius="full"
              w="full"
              _hover={{
                bg: buttonHoverBg,
                border: `2px solid ${buttonBorderHover}`,
              }}
              _active={{ bg: buttonHoverBg }}
            >
              Visitors Inside
            </Button>
            <Button
              onClick={() => navigate('/visitors')}
              bg={buttonBg}
              color="#FFFFFF"
              borderRadius="full"
              w="full"
              _hover={{
                bg: buttonHoverBg,
                border: `2px solid ${buttonBorderHover}`,
              }}
              _active={{ bg: buttonHoverBg }}
            >
              All Visitors
            </Button>
          </VStack>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            bg="red.600"
            color="#FFFFFF"
            borderRadius="full"
            w="full"
            _hover={{
              bg: "red.700",
              border: `2px solid ${buttonBorderHover}`,
            }}
            _active={{ bg: "red.700" }}
          >
            Logout
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

export default Home;
