import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  VStack,
  Text,
  Flex,
  Heading,
  Button,
  Select,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExitByContact = () => {
  const [contactNumber, setContactNumber] = useState('');
  const [outTime, setOutTime] = useState('');
  const [exitMethod, setExitMethod] = useState('contact_no');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const location = useLocation();
  const { entry_id } = location.state || {};

  const getCurrentTime = () => {
    const current = new Date();
    const day = String(current.getDate()).padStart(2, '0'); // Ensure day is 2 digits
    const month = String(current.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = current.getFullYear();
    const hours = String(current.getHours()).padStart(2, '0'); // 24-hour format
    const minutes = String(current.getMinutes()).padStart(2, '0');
    const seconds = String(current.getSeconds()).padStart(2, '0');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[current.getDay()]; // Get the day name
  
    return `${day}-${month}-${year} ${dayName} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    setOutTime(getCurrentTime());
    if (entry_id) {
      setExitMethod('entry_id');
      setContactNumber(entry_id); // Pre-fill the ID
    }
  }, [entry_id]);

  const handleExit = async () => {
    try {
      const response = await fetch('http://localhost:5000/mark_exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [exitMethod]: contactNumber, out_time: outTime }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || 'Visitor exited successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to exit visitor', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
      setOutTime(getCurrentTime());
      setContactNumber('');
    } catch (error) {
      console.error('Error exiting visitor:', error);
      toast.error('An error occurred while exiting the visitor.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const getPlaceholder = () => {
    switch (exitMethod) {
      case 'contact_no':
        return 'Enter Contact Number';
      case 'entry_id':
        return entry_id ? `ID: ${entry_id}` : 'Enter Visitor ID';
      case 'vehicle_no':
        return 'Enter Vehicle Number';
      default:
        return 'Enter Information';
    }
  };

  const gradientBg = 'linear-gradient(135deg, #4A628A, #7AB2D3, #B9E5E8, #DFF2EB)';
  const containerBg = 'linear-gradient(135deg, rgba(223, 242, 235, 0.7), rgba(185, 229, 232, 0.6), rgba(122, 178, 211, 0.5), rgba(74, 98, 138, 0.4))';
  const buttonBg = '#4A628A';
  const buttonHoverBg = '#7AB2D3';
  const textColor = '#1C2D3A';
  const placeholderColor = '#4A628A';
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
        <VStack spacing={6} w="full">
          <Button
            leftIcon={<ArrowBackIcon />}
            color="#FFFFFF"
            bg={buttonBg}
            onClick={() => navigate('/guard-panel')}
            borderRadius="full"
            _hover={{
              bg: buttonHoverBg,
              border: `2px solid ${buttonBorderHover}`,
            }}
            _active={{ bg: buttonHoverBg }}
          >
            Back
          </Button>

          <Heading
            color={textColor}
            fontSize="2xl"
            fontWeight="bold"
          >
            Exit Visitor
          </Heading>

          <Select
            value={exitMethod}
            onChange={(e) => setExitMethod(e.target.value)}
            focusBorderColor={buttonBg}
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.3)"
            color={textColor}
            _placeholder={{ color: placeholderColor }}
            size="lg"
          >
            <option value="contact_no">Exit by Contact Number</option>
            <option value="entry_id">Exit by ID</option>
            <option value="vehicle_no">Exit by Vehicle Number</option>
          </Select>

          <Input
            placeholder={getPlaceholder()}
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            focusBorderColor={buttonBg}
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.3)"
            color={textColor}
            _placeholder={{ color: placeholderColor }}
            size="lg"
          />

          <Input
            placeholder="Enter Out Time (e.g., 2024-11-09 17:30:00)"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
            focusBorderColor={buttonBg}
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.3)"
            color={textColor}
            _placeholder={{ color: placeholderColor }}
            size="lg"
          />

          <Button
            onClick={handleExit}
            bg={buttonBg}
            color="#FFFFFF"
            borderRadius="full"
            w="full"
            size="lg"
            _hover={{
              bg: buttonHoverBg,
              border: `2px solid ${buttonBorderHover}`,
            }}
            _active={{ bg: buttonHoverBg }}
          >
            Exit
          </Button>

          {/* Success/Error Message */}
          {message && (
            <Text color={textColor} fontSize="md">
              {message}
            </Text>
          )}
        </VStack>
      </Box>
      <ToastContainer />
    </Flex>
  );
};

export default ExitByContact;
