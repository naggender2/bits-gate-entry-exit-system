// import React, { useState, useEffect } from 'react';
// import '../styles/ExitPage.css'; // Shared CSS for all exit pages

// const ExitByVehicle = () => {
//   const [vehicleNumber, setVehicleNumber] = useState('');
//   const [outTime, setOutTime] = useState(''); // State to hold manually entered out-time
//   const [message, setMessage] = useState(''); // State to hold success/error message

//   // Function to get the current date and time in the required format
//   const getCurrentTime = () => {
//     const current = new Date();
//     return current.toISOString().slice(0, 19).replace("T", " "); // Format as "YYYY-MM-DD HH:mm:ss"
//   };

//   // Set default outTime to the current time when the component mounts
//   useEffect(() => {
//     setOutTime(getCurrentTime());
//   }, []);

//   const handleExit = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/mark_exit", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ vehicle_no: vehicleNumber, out_time: outTime }), // Send vehicleNumber and outTime
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessage(result.message || 'Visitor exited successfully');
//       } else {
//         const errorData = await response.json();
//         setMessage(errorData.error || 'Failed to exit visitor');
//       }
//     } catch (error) {
//       console.error("Error exiting visitor:", error);
//       setMessage("An error occurred while exiting the visitor.");
//     }
//   };

//   return (
//     <div className="exit-page-container">
//       <div className="exit-card">
//         <h1 className="exit-page-title">Exit Visitor with Vehicle Number</h1>
//         <input
//           type="text"
//           className="exit-input"
//           placeholder="Enter Vehicle Number"
//           value={vehicleNumber}
//           onChange={(e) => setVehicleNumber(e.target.value)}
//         />
//         <input
//           type="text"
//           className="exit-input"
//           placeholder="Enter Out Time (e.g., 2024-11-09 17:30:00)"
//           value={outTime}
//           onChange={(e) => setOutTime(e.target.value)}
//         />
//         <button className="exit-button" onClick={handleExit}>
//           Exit
//         </button>
//         {message && <p className="exit-message">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default ExitByVehicle;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Input,
//   VStack,
//   Text,
//   Flex,
//   Heading,
//   IconButton,
// } from '@chakra-ui/react';
// import { ArrowBackIcon } from '@chakra-ui/icons';
// import { useNavigate } from 'react-router-dom';

// const ExitByVehicle = () => {
//   const [vehicleNumber, setVehicleNumber] = useState('');
//   const [outTime, setOutTime] = useState(''); // State to hold manually entered out-time
//   const [message, setMessage] = useState(''); // State to hold success/error message
//   const navigate = useNavigate();

//   // Function to get the current date and time in the required format
//   const getCurrentTime = () => {
//     const current = new Date();
//     return current.toISOString().slice(0, 19).replace('T', ' '); // Format as "YYYY-MM-DD HH:mm:ss"
//   };

//   // Set default outTime to the current time when the component mounts
//   useEffect(() => {
//     setOutTime(getCurrentTime());
//   }, []);

//   const handleExit = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/mark_exit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ vehicle_no: vehicleNumber, out_time: outTime }), // Send vehicleNumber and outTime
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessage(result.message || 'Visitor exited successfully');
//       } else {
//         const errorData = await response.json();
//         setMessage(errorData.error || 'Failed to exit visitor');
//       }
//     } catch (error) {
//       console.error('Error exiting visitor:', error);
//       setMessage('An error occurred while exiting the visitor.');
//     }
//   };

//   // Styling variables for the vintage theme
//   const containerBgGradient = 'linear-gradient(145deg, rgba(245, 235, 220, 0.9), rgba(225, 215, 200, 0.9))';
//   const buttonBg = '#6D9E9E'; // Muted teal color
//   const buttonHoverBg = '#5C8686'; // Darker teal for hover
//   const textColor = '#3E2723'; // Deep sepia for text
//   const inputBg = 'rgba(255, 255, 255, 0.5)'; // Transparent white for inputs

//   return (
//     <Flex
//       minH="100vh"
//       align="center"
//       justify="center"
//       bg="#EFE5D8"
//       px={4}
//       position="relative"
//       _before={{
//         content: '""',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         bg: '#EFE5D8',
//         filter: 'blur(8px)',
//         zIndex: -1,
//       }}
//     >
//       {/* Back button positioned at the top left */}
//       <IconButton
//         icon={<ArrowBackIcon />}
//         color="white"
//         bg={buttonBg}
//         position="absolute"
//         top={4}
//         left={4}
//         borderRadius="full"
//         onClick={() => navigate('/')} // Navigate back to home
//         _hover={{ bg: buttonHoverBg }}
//         aria-label="Back to Home"
//       />

//       <Box
//         bg={containerBgGradient}
//         w="full"
//         maxW="md"
//         p={8}
//         borderRadius="lg"
//         boxShadow="lg"
//         backdropFilter="blur(10px)"
//       >
//         <VStack spacing={6} w="full" textAlign="center">
//           <Heading size="lg" color={textColor} fontWeight="semibold">
//             Exit Visitor with Vehicle Number
//           </Heading>

//           <Input
//             placeholder="Enter Vehicle Number"
//             value={vehicleNumber}
//             onChange={(e) => setVehicleNumber(e.target.value)}
//             size="md"
//             variant="outline"
//             focusBorderColor={buttonBg}
//             bg={inputBg}
//             _hover={{ borderColor: buttonBg }}
//             borderRadius="full"
//           />
//           <Input
//             placeholder="Enter Out Time (e.g., 2024-11-09 17:30:00)"
//             value={outTime}
//             onChange={(e) => setOutTime(e.target.value)}
//             size="md"
//             variant="outline"
//             focusBorderColor={buttonBg}
//             bg={inputBg}
//             _hover={{ borderColor: buttonBg }}
//             borderRadius="full"
//           />
//           <Button
//             onClick={handleExit}
//             bg={buttonBg}
//             color="white"
//             w="full"
//             size="md"
//             borderRadius="full"
//             transition="background 0.3s ease"
//             _hover={{ bg: buttonHoverBg }}
//             _active={{ bg: buttonHoverBg }}
//             boxShadow="sm"
//           >
//             Exit
//           </Button>
//           {message && (
//             <Text color={textColor} fontSize="sm">
//               {message}
//             </Text>
//           )}
//         </VStack>
//       </Box>
//     </Flex>
//   );
// };

// export default ExitByVehicle;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  VStack,
  Flex,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const ExitByVehicle = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [outTime, setOutTime] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const getCurrentTime = () => {
    const current = new Date();
    return current.toISOString().slice(0, 19).replace('T', ' '); // Format as "YYYY-MM-DD HH:mm:ss"
  };

  useEffect(() => {
    setOutTime(getCurrentTime());
  }, []);

  const handleExit = async () => {
    try {
      const response = await fetch('http://localhost:5000/mark_exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle_no: vehicleNumber, out_time: outTime }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || 'Visitor exited successfully');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to exit visitor');
      }
    } catch (error) {
      console.error('Error exiting visitor:', error);
      setMessage('An error occurred while exiting the visitor.');
    }
  };

  // Updated colors and theme
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
      {/* Glassmorphism Panel */}
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
          {/* Back Button */}
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

          {/* Header */}
          <Heading
            color={textColor}
            fontSize="2xl"
            fontWeight="bold"
          >
            Exit Visitor with Vehicle Number
          </Heading>

          {/* Vehicle Number Input */}
          <Input
            placeholder="Enter Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            focusBorderColor={buttonBg}
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.3)"
            color={textColor}
            _placeholder={{ color: placeholderColor }}
            size="lg"
          />

          {/* Out Time Input */}
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

          {/* Exit Button */}
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
    </Flex>
  );
};

export default ExitByVehicle;

