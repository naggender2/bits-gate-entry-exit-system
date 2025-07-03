import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Alert,
  AlertIcon,
  Flex,
  HStack,
  Text,
} from '@chakra-ui/react';

function ResetPassword() {
  const [formData, setFormData] = useState({
    username: '',
    newPassword: '',
  });

  const [userType, setUserType] = useState(''); // Track user type: 'admin' or 'guard'
  const [shift, setShift] = useState(''); // Track selected shift for guards
  const [guardList, setGuardList] = useState([]); // List of guards based on shift
  const [adminList, setAdminList] = useState([]); // List of admins
  const [oldPassword, setOldPassword] = useState(''); // Store the old password
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If username changes, fetch the old password
    if (name === 'username' && value) {
      fetchOldPassword(value);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:5000/admins');
      const data = await response.json();
      if (response.ok) {
        setAdminList(data.admins || []);
        setFormData({ ...formData, username: '' });
        setOldPassword(''); // Reset old password when user type changes
      } else {
        setErrorMessage(data.error || 'Failed to fetch admins.');
        setAdminList([]);
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching admins.');
      setAdminList([]);
    }
  };

  const fetchGuards = async (e) => {
    try {
      const response = await fetch(`http://localhost:5000/guards`);
      const data = await response.json();
      if (response.ok) {
        setGuardList(data.guards || []);
        setFormData({ ...formData, username: '' });
        setOldPassword(''); // Reset old password when user changes
      } else {
        setErrorMessage(data.error || 'Failed to fetch guards.');
        setGuardList([]);
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching guards.');
      setGuardList([]);
    }
  };

  const fetchOldPassword = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/get-password?username=${username}`);
      const data = await response.json();
      if (response.ok) {
        setOldPassword(data.password || ''); // Set the old password
      } else {
        setErrorMessage(data.error || 'Failed to fetch old password.');
        setOldPassword('');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching the old password.');
      setOldPassword('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, newPassword } = formData;

    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword, userType }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Password for ${userType} "${username}" has been reset successfully.`);
        setErrorMessage('');
        setFormData({ username: '', newPassword: '' }); // Reset form
        setOldPassword(''); // Reset old password after successful update
      } else {
        setErrorMessage(data.error || 'Failed to reset password.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setSuccessMessage('');
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
            Reset {userType ? `${userType.charAt(0).toUpperCase() + userType.slice(1)}` : ''} Password
          </Heading>

          <Text fontSize="sm" color={textColor}>
            Select the user type and enter the details to reset the password.
          </Text>

          {/* Success or Error Messages */}
          {successMessage && (
            <Alert status="success" borderRadius="lg" mb={4}>
              <AlertIcon />
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert status="error" borderRadius="lg" mb={4}>
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}

          {/* User Type Selection */}
          <HStack spacing={4}>
            <Button
              bg={userType === 'admin' ? buttonHoverBg : buttonBg}
              color="#FFFFFF"
              onClick={() => {
                setUserType('admin');
                fetchAdmins(); // Fetch admins when the button is clicked
              }}
              borderRadius="full"
              _hover={{
                bg: buttonHoverBg,
                border: `2px solid ${buttonBorderHover}`,
              }}
              _active={{ bg: buttonHoverBg }}
            >
              Admin
            </Button>
            <Button
              bg={userType === 'guard' ? buttonHoverBg : buttonBg}
              color="#FFFFFF"
              onClick={() => {
                setUserType('guard');
                fetchGuards(); // Fetch guards when the button is clicked
              }}
              borderRadius="full"
              _hover={{
                bg: buttonHoverBg,
                border: `2px solid ${buttonBorderHover}`,
              }}
              _active={{ bg: buttonHoverBg }}
            >
              Guard
            </Button>
          </HStack>

          {/* Reset Password Form */}
          {(userType === 'admin' || (userType === 'guard')) && (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4} align="stretch">
                <FormControl id="username" isRequired>
                  <FormLabel color={textColor}>Username</FormLabel>
                  {userType === 'admin' && adminList.length > 0 ? (
                    <Select
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Select admin username"
                      bg="rgba(255, 255, 255, 0.3)"
                      color={textColor}
                      _placeholder={{ color: '#4A628A' }}
                      borderRadius="full"
                      focusBorderColor={buttonBg}
                    >
                      {adminList.map((admin) => (
                        <option key={admin} value={admin}>
                          {admin}
                        </option>
                      ))}
                    </Select>
                  ) : userType === 'guard' && guardList.length > 0 ? (
                    <Select
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Select guard username"
                      bg="rgba(255, 255, 255, 0.3)"
                      color={textColor}
                      _placeholder={{ color: '#4A628A' }}
                      borderRadius="full"
                      focusBorderColor={buttonBg}
                    >
                      {guardList.map((guard) => (
                        <option key={guard} value={guard}>
                          {guard}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      bg="rgba(255, 255, 255, 0.3)"
                      color={textColor}
                      _placeholder={{ color: '#4A628A' }}
                      borderRadius="full"
                      focusBorderColor={buttonBg}
                    />
                  )}
                </FormControl>
                {oldPassword && (
                  <FormControl id="oldPassword">
                    <FormLabel color={textColor}>Old Password</FormLabel>
                    <Input
                      type="text"
                      value={oldPassword}
                      isReadOnly
                      bg="rgba(255, 255, 255, 0.1)" // Faded out
                      color="#A0A0A0" // Lighter color for faded text
                      borderRadius="full"
                      focusBorderColor="transparent" // Prevent focus highlight
                      cursor="not-allowed" // Disable pointer events
                    />
                  </FormControl>
                )}
                <FormControl id="newPassword" isRequired>
                  <FormLabel color={textColor}>New Password</FormLabel>
                  <Input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    bg="rgba(255, 255, 255, 0.3)"
                    color={textColor}
                    _placeholder={{ color: '#4A628A' }}
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
                  Reset Password
                </Button>
              </VStack>
            </form>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}

export default ResetPassword;
