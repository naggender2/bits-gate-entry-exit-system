import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';

function AdminPanel({ onLogout }) {
  const navigate = useNavigate();

  const handleButtonClick = (action) => {
    switch (action) {
      case 'showVisitorsInside':
        navigate('/admin-inside-visitors');
        break;
      case 'showAllVisitors':
        navigate('/admin-visitors');
        break;
      case 'resetPasswords':
        navigate('/reset-password'); // Navigate to password reset page
        break;
      case 'viewGuardActivity':
        navigate('/guard-activity'); // Navigate to guard activity page
        break;
      case 'logoutAndGoToHome':
        handleLogout(); // Call logout function
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('No token found. Please log in again.');
        navigate('/');
        return;
      }
  
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token
        },
      });
  
      if (response.ok) {
        localStorage.removeItem('access_token'); // Clear the token
        onLogout(); // Call the logout function passed via props
        alert('Logged out successfully.');
        navigate('/'); // Redirect to login page
      } else {
        const errorData = await response.json();
        alert(`Logout failed: ${errorData.error}`);
      }
    } catch (error) {
      alert('An error occurred during logout. Please try again.');
      console.error(error);
    }
  };

  const gradientBg = 'linear-gradient(135deg, #4A628A, #7AB2D3, #B9E5E8, #DFF2EB)';
  const containerBg = 'linear-gradient(135deg, rgba(223, 242, 235, 0.7), rgba(185, 229, 232, 0.6), rgba(122, 178, 211, 0.5), rgba(74, 98, 138, 0.4))';
  const buttonBg = '#4A628A';
  const buttonHoverBg = '#7AB2D3';
  const textColor = '#1C2D3A';
  const boxShadow = '0px 8px 24px rgba(0, 0, 0, 0.15)';
  const buttonBorderHover = '#DFF2EB';

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
            Admin Panel
          </Heading>
          <Text fontSize="sm" color={textColor}>
            Manage visitor information, reset passwords, and view current data.
          </Text>

          {/* Admin Actions */}
          <VStack spacing={4} w="full">
            <Text fontSize="lg" fontWeight="medium" color={textColor}>
              Actions
            </Text>
            <SimpleGrid columns={1} spacing={4} w="full">
              {[
                { action: 'showVisitorsInside', label: 'Visitors Inside' },
                { action: 'showAllVisitors', label: 'All Visitors' },
                { action: 'resetPasswords', label: 'Reset Passwords' }, // Button for password reset
                { action: 'viewGuardActivity', label: 'Guard Activity' }, // New button for guard activity
                { action: 'logoutAndGoToHome', label: 'Logout' },
              ].map(({ action, label }) => (
                <Button
                  key={action}
                  onClick={() => handleButtonClick(action)}
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
                  {label}
                </Button>
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}

export default AdminPanel;
