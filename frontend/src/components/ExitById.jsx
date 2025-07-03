// import React, { useState, useEffect } from 'react';
// import '../styles/ExitPage.css'; // Shared CSS for all exit pages

// const ExitById = () => {
//   const [visitorId, setVisitorId] = useState('');
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
//         body: JSON.stringify({ entry_id: visitorId, out_time: outTime }), // Send visitorId and outTime
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
//         <h1 className="exit-page-title">Exit Visitor with ID</h1>
//         <input
//           type="text"
//           className="exit-input"
//           placeholder="Enter Visitor ID"
//           value={visitorId}
//           onChange={(e) => setVisitorId(e.target.value)}
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

// export default ExitById;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Heading,
//   Input,
//   VStack,
//   Text,
//   Flex,
//   IconButton,
// } from '@chakra-ui/react';
// import { ArrowBackIcon } from '@chakra-ui/icons';
// import { useNavigate } from 'react-router-dom';

// const ExitById = () => {
//   const [visitorId, setVisitorId] = useState('');
//   const [outTime, setOutTime] = useState(''); // State to hold manually entered out-time
//   const [message, setMessage] = useState(''); // State to hold success/error message
//   const navigate = useNavigate();

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
//         body: JSON.stringify({ entry_id: visitorId, out_time: outTime }), // Send visitorId and outTime
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

//   // Color scheme for a vintage, professional look
//   const containerBgGradient = 'linear-gradient(145deg, rgba(245, 235, 220, 0.9), rgba(225, 215, 200, 0.9))';
//   const buttonBg = '#6D9E9E'; // Muted teal color matching the homepage
//   const buttonHoverBg = '#5C8686'; // Darker teal for hover, same as homepage
//   const textColor = '#3E2723'; // Deep sepia for text, same as homepage
//   const inputBg = 'rgba(255, 255, 255, 0.5)'; // Slightly transparent white for inputs

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
//         filter: 'blur(8px)', // Blurs the background
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
//         backdropFilter="blur(10px)" // Gives a frosted glass effect
//       >
//         <VStack spacing={6} w="full" textAlign="center">
//           <Heading size="lg" color={textColor} fontWeight="semibold">
//             Exit Visitor with ID
//           </Heading>

//           <Input
//             placeholder="Enter Visitor ID"
//             value={visitorId}
//             onChange={(e) => setVisitorId(e.target.value)}
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
//           {message && <Text color={textColor}>{message}</Text>}
//         </VStack>
//       </Box>
//     </Flex>
//   );
// };

// export default ExitById;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Input,
//   VStack,
//   Text,
//   Flex,
//   Heading,
//   Button,
// } from '@chakra-ui/react';
// import { ArrowBackIcon } from '@chakra-ui/icons';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const MotionBox = motion(Box);
// const MotionButton = motion(Button);

// const ExitById = () => {
//   const [visitorId, setVisitorId] = useState('');
//   const [outTime, setOutTime] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const getCurrentTime = () => {
//     const current = new Date();
//     return current.toISOString().slice(0, 19).replace('T', ' '); // Format as "YYYY-MM-DD HH:mm:ss"
//   };

//   useEffect(() => {
//     setOutTime(getCurrentTime());
//   }, []);

//   const handleExit = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/mark_exit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ entry_id: visitorId, out_time: outTime }), // Send visitorId and outTime
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

//   const containerBg = 'rgba(245, 245, 245, 0.1)';
//   const buttonBgGradient = 'linear-gradient(135deg, #6D9E9E, #5C8686)';
//   const hoverGlowColor = 'rgba(108, 158, 158, 0.8)';
//   const textColor = '#3E2723';
//   const boxShadow = '0px 4px 30px rgba(0, 0, 0, 0.2)';
//   const inputBg = 'rgba(255, 255, 255, 0.3)';

//   return (
//     <Flex
//       minH="100vh"
//       align="center"
//       justify="center"
//       position="relative"
//       overflow="hidden"
//     >
//       {/* Background Layer */}
//       <Box
//         position="absolute"
//         top={0}
//         left={0}
//         w="full"
//         h="full"
//         bg="#EFE5D8"
//         bgImage="url('BitsPilaniBg.jpg')"
//         bgSize="cover"
//         bgPosition="center"
//         bgRepeat="no-repeat"
//         style={{
//           filter: 'blur(0px)',
//         }}
//         zIndex={0}
//       />

//       {/* Redesigned Back Button */}
//       <MotionBox
//         as="button"
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//         position="absolute"
//         top={4}
//         left={4}
//         w="45px"
//         h="45px"
//         borderRadius="full"
//         bg={buttonBgGradient}
//         whileHover={{
//           scale: 1.2,
//           boxShadow: `0 0 20px ${hoverGlowColor}`, // Glowing effect on hover
//         }}
//         whileTap={{ scale: 0.9 }}
//         initial={{ opacity: 0, x: -50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{
//           type: 'spring',
//           stiffness: 150,
//           damping: 10,
//         }}
//         zIndex={1}
//         onClick={() => navigate('/')}
//         aria-label="Back to Home"
//       >
//         <MotionBox
//           as={ArrowBackIcon}
//           boxSize={5}
//           color="white"
//           whileHover={{
//             scale: 1.3, // Arrow scales slightly on hover
//             filter: 'brightness(1.5)', // Arrow glows brighter
//           }}
//           transition={{
//             type: 'spring',
//             stiffness: 200,
//             damping: 10,
//           }}
//         />
//       </MotionBox>

//       {/* Glassmorphism Panel */}
//       <MotionBox
//         bg={containerBg}
//         backdropFilter="blur(20px)"
//         w="full"
//         maxW="md"
//         p={8}
//         borderRadius="xl"
//         boxShadow={boxShadow}
//         textAlign="center"
//         zIndex={1}
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8, ease: 'easeOut' }}
//       >
//         <VStack spacing={6} w="full">
//           {/* Header */}
//           <MotionBox
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//           >
//             <Heading size="lg" color={textColor} fontWeight="semibold">
//               Exit Visitor with ID
//             </Heading>
//           </MotionBox>

//           {/* Visitor ID Input */}
//           <MotionBox
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.4, duration: 0.6 }}
//             w="full"
//           >
//             <Input
//               placeholder="Enter Visitor ID"
//               value={visitorId}
//               onChange={(e) => setVisitorId(e.target.value)}
//               size="md"
//               variant="outline"
//               focusBorderColor="#6D9E9E"
//               bg={inputBg}
//               color={textColor}
//               _hover={{ borderColor: '#6D9E9E' }}
//               borderRadius="full"
//             />
//           </MotionBox>

//           {/* Out Time Input */}
//           <MotionBox
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//             w="full"
//           >
//             <Input
//               placeholder="Enter Out Time (e.g., 2024-11-09 17:30:00)"
//               value={outTime}
//               onChange={(e) => setOutTime(e.target.value)}
//               size="md"
//               variant="outline"
//               focusBorderColor="#6D9E9E"
//               bg={inputBg}
//               color={textColor}
//               _hover={{ borderColor: '#6D9E9E' }}
//               borderRadius="full"
//             />
//           </MotionBox>

//           {/* Exit Button */}
//           <MotionButton
//             onClick={handleExit}
//             bg="#6D9E9E"
//             color="white"
//             w="full"
//             size="md"
//             borderRadius="full"
//             whileHover={{ scale: 1.05 }}
//             transition="0.3s"
//             _hover={{ bg: '#5C8686' }}
//             _active={{ bg: '#5C8686' }}
//             boxShadow="sm"
//           >
//             Exit
//           </MotionButton>

//           {/* Success/Error Message */}
//           {message && (
//             <Text color={textColor} fontSize="sm">
//               {message}
//             </Text>
//           )}
//         </VStack>
//       </MotionBox>
//     </Flex>
//   );
// };

// export default ExitById;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  VStack,
  Text,
  Flex,
  Heading,
  Button,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const ExitById = () => {
  const [visitorId, setVisitorId] = useState('');
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
        body: JSON.stringify({ entry_id: visitorId, out_time: outTime }), // Send visitorId and outTime
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
  const textColor = '#1C2D3A'; // Consistent with the theme
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
            Exit Visitor by ID
          </Heading>

          {/* Visitor ID Input */}
          <Input
            placeholder="Enter Visitor ID"
            value={visitorId}
            onChange={(e) => setVisitorId(e.target.value)}
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

export default ExitById;

