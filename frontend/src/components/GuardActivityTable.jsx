import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
  Flex,
  VStack,
  Button,
  Text,
} from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const GuardActivityTable = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Get the token from localStorage
        if (!token) {
          console.error('No token found. Please log in again.');
          setSessions([]); // Reset sessions
          setLoading(false);
          return;
        }
  
        const response = await fetch('http://localhost:5000/all_sessions_guards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
  
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setSessions(data); // Set sessions if the data is valid
        } else {
          console.error('Unexpected data format:', data);
          setSessions([]);
        }
      } catch (error) {
        console.error('Error fetching guard activity data:', error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sessions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Guard Activity Data');
    XLSX.writeFile(workbook, 'guard_activity_data.xlsx');
  };

  // Theme variables
  const gradientBg =
    'linear-gradient(135deg, #4A628A, #7AB2D3, #B9E5E8, #DFF2EB)';
  const containerBg =
    'linear-gradient(135deg, rgba(223, 242, 235, 0.7), rgba(185, 229, 232, 0.6), rgba(122, 178, 211, 0.5), rgba(74, 98, 138, 0.4))';
  const tableHeaderBg = '#4A628A';
  const tableRowEvenBg = 'rgba(185, 229, 232, 0.5)';
  const tableRowOddBg = 'rgba(223, 242, 235, 0.5)';
  const hoverBg = 'rgba(255, 255, 255, 0.8)';
  const textColor = '#1C2D3A';
  const spinnerColor = '#4A628A';
  const buttonBg = '#4A628A';
  const buttonHoverBg = '#7AB2D3';
  const buttonBorderHover = '#DFF2EB';

  if (loading) {
    return (
      <Flex align="center" justify="center" minH="100vh" bg={gradientBg}>
        <Spinner size="xl" color={spinnerColor} />
      </Flex>
    );
  }

  return (
    <Box position="relative" minH="100vh">
      {/* Background */}
      <Box
        position="fixed"
        top={0}
        left={0}
        w="full"
        h="full"
        bg={gradientBg}
        zIndex={-1}
      />

      {/* Main Content */}
      <Flex align="center" justify="center" minH="100vh" px={4} position="relative">
        {/* Glass Panel */}
        <MotionBox
          bg={containerBg}
          backdropFilter="blur(15px)"
          borderRadius="xl"
          p={8}
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.15)"
          w="full"
          maxW="98%"
        >
          <Flex align="center" position="relative" mb={6}>
            {/* Back Button */}
            <Box position="absolute" left={0}>
              <Button
                leftIcon={<ArrowBackIcon />}
                color="#FFFFFF"
                bg={buttonBg}
                onClick={() => navigate('/admin-panel')}
                borderRadius="full"
                _hover={{
                  bg: buttonHoverBg,
                  border: `2px solid ${buttonBorderHover}`,
                }}
                _active={{ bg: buttonHoverBg }}
              >
                Back
              </Button>
            </Box>

            {/* Header */}
            <Heading
              size="lg"
              color={textColor}
              fontWeight="semibold"
              textAlign="center"
              w="full"
            >
              Guard Activity
            </Heading>
          </Flex>

          {/* Download Button */}
          <Flex w="full" justify="flex-end" align="center" mt={4}>
            <Button
              onClick={downloadExcel}
              bg={buttonBg}
              color="white"
              borderRadius="md"
              px={6}
              py={4}
              _hover={{
                bg: buttonHoverBg,
                border: `2px solid ${buttonBorderHover}`,
              }}
              _active={{ bg: buttonHoverBg }}
            >
              Download Excel
            </Button>
          </Flex>

          {/* Guard Activity Data */}
          {sessions.length === 0 ? (
            <Text color={textColor}>No guard activity records found.</Text>
          ) : (
            <Box w="full" overflowX="hidden">
              <Table
                variant="simple"
                size="sm"
                w="full"
                bg="rgba(255, 255, 255, 0.15)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="md"
                boxShadow="0 4px 15px rgba(0, 0, 0, 0.1)"
              >
                <Thead>
                  <Tr bg={tableHeaderBg}>
                    {[
                      'Username',
                      'IP Address',
                      'Session Login Time',
                      'Session Logout Time',
                    ].map((heading) => (
                      <Th
                        key={heading}
                        color="white"
                        textAlign="center"
                        fontSize="xs"
                        px={2}
                        py={1}
                      >
                        {heading}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {sessions.map((session, index) => (
                    <Tr
                      key={session._id}
                      bg={index % 2 === 0 ? tableRowEvenBg : tableRowOddBg}
                      _hover={{
                        backgroundColor: hoverBg,
                        boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
                        transform: 'scale(1.01)',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {[
                        'username',
                        'ip_address',
                        'session_login_time',
                        'session_logout_time',
                      ].map((field) => (
                        <Td
                          key={field}
                          textAlign="center"
                          fontSize="sm"
                          px={3}
                          py={2}
                          whiteSpace="normal"
                          wordBreak="break-word"
                          minWidth={field === 'username' ? '20ch' : '15ch'}
                          maxWidth="25ch"
                        >
                          {session[field] || 'N/A'}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </MotionBox>
      </Flex>
    </Box>
  );
};

export default GuardActivityTable;
