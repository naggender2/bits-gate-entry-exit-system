import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useRef } from 'react';
import { Tooltip } from '@chakra-ui/react';
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
  VStack, Text,
  Button,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import {  DownloadIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

const InsideVisitors = () => {
  const [insideVisitors, setInsideVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null); // Track expanded row
  const navigate = useNavigate();
  const qrCodeRef = useRef(null); // Ref for QR code
  const [qrCodeImage, setQrCodeImage] = useState(null); // State for QR code image
  const { isOpen, onOpen, onClose } = useDisclosure(); // For the modal
  const [selectedVisitor, setSelectedVisitor] = useState(null); // Visitor data for the modal

  useEffect(() => {
      fetch('http://localhost:5000/entries_with_blank_out_time', {
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
          setInsideVisitors(data.message ? [] : data);
        })
        .catch((error) => console.error('Error fetching visitor data:', error))
        .finally(() => setLoading(false));
    }, []);

  const handleSearch = (query, searchType) => {
    if (!query || !searchType) return;

    setLoading(true);
    fetch(
      `http://localhost:5000/search_inside_entries?search_type=${searchType}&query=${query}`
    )
      .then((response) => response.json())
      .then((data) => {
        setInsideVisitors(data.error ? [] : data);
      })
      .catch((error) => console.error('Error searching visitor data:', error))
      .finally(() => setLoading(false));
  };

  const handleRowClick = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id)); // Toggle expanded row
  };

  const handleExit = (id) => {
    navigate('/exit-contact', { state: { entry_id: id } });
  };


  const printRef = useRef(); // Ref to capture print content


  // Generate QR code image


  // const handlePrint = (id) => {
  //   const visitor = insideVisitors.find((v) => v._id === id);

  //   if (!visitor) {
  //     console.error("Visitor not found for printing.");
  //     return;
  //   }

  //   // Create printable HTML content
  //   const printContent = `
  //     <html>
  //       <head>
  //         <title>Visitor Entry Slip</title>
  //         <style>
  //           body {
  //             font-family: Arial, sans-serif;
  //             text-align: center;
  //             padding: 20px;
  //           }
  //           h2 {
  //             margin-bottom: 20px;
  //           }
  //           .visitor-info {
  //             margin-bottom: 20px;
  //           }
  //           .qr-code {
  //             margin-top: 20px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <h2>Visitor Entry Slip</h2>
  //         <div class="visitor-info">
  //           <p><strong>ID:</strong> ${visitor.entry_id}</p>
  //           <p><strong>Name:</strong> ${visitor.name}</p>
  //           <p><strong>Contact:</strong> ${visitor.contact_no}</p>
  //           <p><strong>Vehicle No:</strong> ${visitor.vehicle_no || "N/A"}</p>
  //           <p><strong>Destination:</strong> ${visitor.destination}</p>
  //           <p><strong>Reason:</strong> ${visitor.reason}</p>
  //           <p><strong>In Time:</strong> ${visitor.in_time}</p>
  //           <p><strong>Vehicle Type:</strong> ${visitor.vehicle_type}</p>
  //           <p><strong>Remarks:</strong> ${visitor.remarks || "N/A"}</p>
  //         </div>
  //         <div class="qr-code">
  //           <canvas id="qr-code"></canvas>
  //         </div>
  //         <script>
  //           // Generate QR Code dynamically
  //           const canvas = document.getElementById("qr-code");
  //           const context = canvas.getContext("2d");
  //           const qrCodeValue = "${visitor.entry_id}";
  //           const QRCode = window.QRCode;
  //           new QRCode(canvas, { text: qrCodeValue, width: 128, height: 128 });
  //         </script>
  //       </body>
  //     </html>
  //   `;

  //   // Open in a new window for printing
  //   const printWindow = window.open("", "_blank");
  //   printWindow.document.open();
  //   printWindow.document.write(printContent);
  //   printWindow.document.close();
  //   printWindow.onload = () => printWindow.print();
  // };
  // const handlePrint = (visitor) => {
  //   setSelectedVisitor(visitor); // Store the selected visitor's info
  //   onOpen(); // Open the modal to show the slip
  // };

  // const printSlip = () => {
  //   // Trigger the print functionality without altering the DOM structure
  //   window.print();
  // };
  // // Theme variables

  const handlePrint = (visitor) => {
    setSelectedVisitor(visitor); // Set the visitor details to display in the modal
    onOpen(); // Open the modal
  };

  const printSlip = () => {
    const printContent = printRef.current.innerHTML; // Get the modal content

    if (!printContent) {
      console.error("Print content is empty or undefined.");
      return;
    }

    console.log(printContent); // Log the content to ensure it is not empty
    sendPrintCommand(printContent);

    // const printWindow = window.open("", "_blank"); // Open a blank new tab/window
    // printWindow.document.open();
    // printWindow.document.write(`
    //   <html>
    //     <head>
    //       <title>Visitor Entry Slip</title>
    //       <style>
    //         body {
    //           font-family: Arial, sans-serif;
    //           text-align: center;
    //           padding: 20px;
    //         }
    //         h2 {
    //           margin-bottom: 20px;
    //         }
    //         .visitor-info {
    //           margin-bottom: 20px;
    //         }
    //         .qr-code {
    //           margin-top: 20px;
    //         }
    //       </style>
    //     </head>
    //     <body>${printContent}</body>
    //   </html>
    // `);
    // printWindow.document.close();
    // printWindow.onload = () => printWindow.print(); // Trigger the print dialog
  };



  const sendPrintCommand = async (printData) => {
    try {
      const response = await fetch("http://localhost:9999", {
        method: "POST",
        headers: {
          "Content-Type": "text/html",
        },
        body: printData,
      });
      const result = await response.text();
      console.log(result); // "Print success" or "Print failed"
    } catch (error) {
      console.error("Error sending print command:", error);
    }
  };

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
      <Box position="fixed" top={0} left={0} w="full" h="full" bg={gradientBg} zIndex={-1} />

      <Flex align="center" justify="center" minH="100vh" px={4} position="relative">
        <MotionBox
          bg={containerBg}
          backdropFilter="blur(15px)"
          borderRadius="xl"
          p={6}
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.15)"
          w="full"
          maxW="98%"
          minH="80vh"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          position="relative"
        >
          <Flex align="center" position="relative" mb={6}>
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
            <Heading
              size="lg"
              color={textColor}
              fontWeight="semibold"
              textAlign="center"
              w="full"
            >
              Visitors Inside
            </Heading>
          </Flex>

          <Box display="flex" justifyContent="center" mb={6}>
            <SearchBar onSearch={handleSearch} />
          </Box>

          {insideVisitors.length === 0 ? (
            <Text color={textColor}>No visitors are currently inside.</Text>
          ) : (
            <Box overflowX="hidden" w="full">
              <Table variant="simple" size="md" w="full" bg="rgba(255, 255, 255, 0.15)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="md"
                boxShadow="0 4px 15px rgba(0, 0, 0, 0.1)">
                <Thead>
                  <Tr bg={tableHeaderBg}>
                    {['ID', 'Name', 'Contact', 'Vehicle Number', 'Location', 'Reason', 'In Time', 'Vehicle Type', 'Remarks'].map(
                      (heading) => (
                        <Th
                          key={heading}
                          color="white"
                          textAlign="center"
                          fontSize="sm"
                          whiteSpace="nowrap"
                        >
                          {heading}
                        </Th>
                      )
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {insideVisitors.map((visitor, index) => (
                    <React.Fragment key={visitor._id}>
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
                          onClick={() => handleRowClick(visitor._id)}
                          bg={index % 2 === 0 ? tableRowEvenBg : tableRowOddBg}
                          _hover={{
                            backgroundColor: hoverBg,
                            cursor: 'pointer',
                            boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
                            transform: 'scale(1.02)',
                            transition: 'all 0.2s ease-in-out',

                          }}
                        >
                          {['entry_id', 'name', 'contact_no', 'vehicle_no', 'destination', 'reason', 'in_time', 'vehicle_type', 'remarks'].map(
                            (field) => (
                              <Td
                                key={field}
                                textAlign="center"
                                fontSize="sm"
                                whiteSpace={
                                  field === 'entry_id' || field === 'contact_no'
                                    ? 'nowrap'
                                    : 'normal'
                                }
                                wordBreak="break-word"
                                overflowWrap="break-word"
                              >
                                {visitor[field] || 'N/A'}
                              </Td>
                            )
                          )}
                        </Tr>
                      </Tooltip>
                      {expandedRow === visitor._id && (
                        <Tr>
                          <Td colSpan={9} textAlign="center">
                            <Flex justify="center" gap={4}>
                              <Button
                                leftIcon={<ArrowBackIcon />}
                                bg={buttonBg}
                                color="#FFFFFF"
                                borderRadius="full"
                                px={6}
                                py={3}
                                fontSize="sm"
                                fontWeight="semibold"
                                boxShadow="0 4px 15px rgba(0, 0, 0, 0.1)"
                                _hover={{
                                  bg: buttonHoverBg,
                                  border: `2px solid ${buttonBorderHover}`,
                                }}
                                _active={{
                                  bg: buttonHoverBg,
                                  transform: "scale(0.95)",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row toggle
                                  handleExit(visitor.entry_id); // Pass the entry_id
                                }}
                              >
                                Exit
                              </Button>

                              <Button
                                leftIcon={<DownloadIcon />}
                                bg={buttonBg}
                                color="#FFFFFF"
                                borderRadius="full"
                                px={6}
                                py={3}
                                fontSize="sm"
                                fontWeight="semibold"
                                boxShadow="0 4px 15px rgba(0, 0, 0, 0.1)"
                                _hover={{
                                  bg: buttonHoverBg,
                                  border: `2px solid ${buttonBorderHover}`,
                                }}
                                _active={{
                                  bg: buttonHoverBg,
                                  transform: "scale(0.95)",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row toggle
                                  handlePrint(visitor);
                                }}
                              >
                                Print
                              </Button>
                            </Flex>

                          </Td>
                        </Tr>
                      )}
                    </React.Fragment>
                  ))}
                </Tbody>
              </Table>
              {selectedVisitor && (
                <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                  <ModalOverlay />
                  <ModalContent ref={printRef}>
                    <ModalHeader>Visitor Entry Slip</ModalHeader>
                    <ModalBody>
                      <VStack align="start" spacing={4}>
                        <Text><strong>ID:</strong> {selectedVisitor.entry_id}</Text>
                        <Text><strong>Name:</strong> {selectedVisitor.name}</Text>
                        <Text><strong>Contact:</strong> {selectedVisitor.contact_no}</Text>
                        <Text><strong>Vehicle No:</strong> {selectedVisitor.vehicle_no || "N/A"}</Text>
                        <Text><strong>Destination:</strong> {selectedVisitor.destination}</Text>
                        <Text><strong>Reason:</strong> {selectedVisitor.reason}</Text>
                        <Text><strong>In Time:</strong> {selectedVisitor.in_time}</Text>
                        <Text><strong>Vehicle Type:</strong> {selectedVisitor.vehicle_type}</Text>
                        <Text><strong>Remarks:</strong> {selectedVisitor.remarks || "N/A"}</Text>
                        <Text>
                         <strong>Driver:</strong> {selectedVisitor.no_driver || "N/A"} | 
                         <strong> Student:</strong> {selectedVisitor.no_student || "N/A"} | 
                         <strong> Visitor:</strong> {selectedVisitor.no_visitor || "N/A"} | 
                         <strong> Total:</strong> {selectedVisitor.no_person || "N/A"}
                        </Text>

                        <QRCodeCanvas
                          value={JSON.stringify({
                            id: selectedVisitor.entry_id,
                            contact: selectedVisitor.contact_no,
                          })}
                          size={128}
                        />
                      </VStack>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" onClick={printSlip}>
                        Print
                      </Button>
                      <Button ml={3} onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              )}

            </Box>

          )}
        </MotionBox>
      </Flex>
    </Box>
  );
};

export default InsideVisitors;

