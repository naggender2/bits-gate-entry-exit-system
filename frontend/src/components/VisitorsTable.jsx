import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spinner,
  Heading,
  VStack,
  Text,
  Button,
  Tooltip
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';

const MotionBox = motion(Box);

const VisitorsTable = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // const fetchVisitors = async () => {
    //   try {
    //     const response = await fetch('http://localhost:5000/all_entries');
    //     const data = await response.json();
    //     setVisitors(data.error ? [] : data);
    //   } catch (error) {
    //     console.error('Error fetching visitors data:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchVisitors();
    fetch('http://localhost:5000/all_entries', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setVisitors(data.error ? [] : data);
      })
      .catch((error) => console.error('Error fetching visitor data:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (query, searchType) => {
    if (!query || !searchType) return;

    setLoading(true);
    fetch(`https://gate-backend-7x2j.onrender.com/search_entries?search_type=${searchType}&query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        setVisitors(data.error ? [] : data);
      })
      .catch((error) => console.error('Error searching visitor data:', error))
      .finally(() => setLoading(false));
  };

  // Theme variables
  const gradientBg = 'linear-gradient(135deg, #4A628A, #7AB2D3, #B9E5E8, #DFF2EB)';
  const containerBg = 'linear-gradient(135deg, rgba(223, 242, 235, 0.7), rgba(185, 229, 232, 0.6), rgba(122, 178, 211, 0.5), rgba(74, 98, 138, 0.4))';
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
          p={8} // Increased padding for larger panel size
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.15)"
          w="full" // Increased width to fit the page
          maxW="98%" // Increased max width for larger panels
        >
          <Flex
             align="center"
             position="relative"
             mb={6} // Add spacing below the header and button
           >
             {/* Back Button */}
             <Box position="absolute" left={0}>
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
             </Box>
         
             {/* Header */}
             <Heading
               size="lg"
               color={textColor}
               fontWeight="semibold"
               textAlign="center"
               w="full" // Ensures proper centering
             >
               All Visitors
             </Heading>
           </Flex>
         
          {/* Search Bar */}
          <Box
            display="flex"
            justifyContent="center"
            mb={6} // Add spacing below the search bar
          >
            <SearchBar onSearch={handleSearch} />
          </Box>
  
          {/* Visitor Data */}
          {visitors.length === 0 ? (
            <Text color={textColor}>No visitors found.</Text>
          ) : (
            <Box w="full" overflowX="hidden">
              <Table
                variant="simple"
                size="sm" // Retained compact size
                w="full"
                bg="rgba(255, 255, 255, 0.15)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="md"
                boxShadow="0 4px 15px rgba(0, 0, 0, 0.1)"
              >
                <Thead>
                  <Tr bg={tableHeaderBg}>
                    {[
                      'ID',
                      'Name',
                      'Contact',
                      'Vehicle Number',
                      'Location',
                      'Reason',
                      'In Time',
                      'Vehicle Type',
                      'Remarks',
                      'Out Time',
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
                  {visitors.map((visitor, index) => (
                    <Tooltip
                      key={visitor._id}
                      label={`Driver: ${visitor.no_driver || 0}, Students: ${visitor.no_student || 0}, Visitors: ${visitor.no_visitor || 0}, Total: ${visitor.no_person || 0}`}
                      fontSize="sm"
                      placement="top"
                      bg="gray.700"
                      color="white"
                      borderRadius="md"
                      px={4}
                      py={2}
                    >
                      <Tr
                        key={visitor._id}
                        bg={index % 2 === 0 ? tableRowEvenBg : tableRowOddBg}
                        _hover={{
                          backgroundColor: hoverBg,
                          boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
                          transform: 'scale(1.01)',
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {[
                          'entry_id',
                          'name',
                          'contact_no',
                          'vehicle_no',
                          'destination',
                          'reason',
                          'in_time',
                          'vehicle_type',
                          'remarks',
                          'out_time',
                        ].map((field) => (
                          <Td
                            key={field}
                            textAlign="center"
                            fontSize="xs"
                            px={2}
                            py={1}
                            whiteSpace="normal"
                            wordBreak="break-word"
                            minWidth={field === 'name' ? '20ch' : '15ch'} // Symmetry: Larger for "Name"
                            maxWidth="25ch" // Limit to avoid excessive width
                          >
                            {visitor[field] || 'N/A'}
                          </Td>
                        ))}
                      </Tr>
                    </Tooltip>
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

export default VisitorsTable;
