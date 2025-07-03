import { Select } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { HStack } from '@chakra-ui/react';


import {
  Box,
  Button,
  Heading,
  Input,
  Textarea,
  VStack,
  Text,
  Flex,
  Spinner,
  Spacer,
  Divider,
  Fade,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Grid,
} from '@chakra-ui/react';

function VisitorForm() {
  const location = useLocation();
  const [isFocused, setIsFocused] = useState(false);
  const [focusedField, setFocusedField] = React.useState(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (fieldName) => {
    if (!formData[fieldName]?.trim()) {
      setIsFocused(false);
    }
  };

  const navigate = useNavigate();
  const { mobileNumber } = location.state || {};

  const destinationOptions = [
    'Other',
    'IPC',
    'LTC',
    'FD1',
    'FD2',
    'FD3',
    'ANC',
    'New Academic Block',
    'Library',
    'Medical Center',
    'V-FAST',
    'Cannot Place',
    'Ashok Bhawan',
    'Budh Bhawan',
    'CVR Bhawan',
    'Gandhi Bhawan',
    'Krishna Bhawan',
    'Meera Bhawan',
    'Ram Bhawan',
    'RP Bhawan',
    'Shankar Bhawan',
    'SR Bhawan',
    'VK Bhawan',
    'Vyas Bhawan',
  ];
  const vehicleTypeOptions = ['Car', 'Bike', 'Scooty', 'Rickshaw', 'Tractor', 'Bus', 'Truck', 'Cycle', 'Walk'];

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    contact_no: mobileNumber || '',
    vehicle_no: '',
    destination: '',
    reason: '',
    in_time: new Date().toLocaleString(),
    vehicle_type: '',
    remarks: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [slipData, setSlipData] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null); // QR code as an image for printing
  const { isOpen, onOpen, onClose } = useDisclosure();
  const qrCodeRef = useRef();
  const printRef = useRef();

  useEffect(() => {
    const fetchVisitorData = async () => {
      if (mobileNumber) {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:5000/get_visitor_details?contact_no=${mobileNumber}`
          );
          const result = await response.json();

          if (response.ok) {
            setFormData((prevData) => ({
              ...prevData,
              name: result.name || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching visitor data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchLastEntries = async () => {
      if (mobileNumber) {
        try {
          setIsLoadingEntries(true);
          const response = await fetch(
            `http://localhost:5000/last_entries?contact_no=${mobileNumber}`
          );
          const result = await response.json();

          if (response.ok) {
            setEntries(result);
          } else {
            setEntries([]);
          }
        } catch (error) {
          console.error('Error fetching last entries:', error);
        } finally {
          setIsLoadingEntries(false);
        }
      }
    };

    fetchVisitorData();
    fetchLastEntries();
  }, [mobileNumber]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation for the name field to allow only letters and spaces
    if (name === 'name' && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = true;
    if (!formData.contact_no) newErrors.contact_no = true;
    if (!formData.destination) newErrors.destination = true;
    if (formData.destination === "Other" && !formData.custom_destination) {
      errors.custom_destination = "Custom destination is required";
    }
    if (!formData.vehicle_type) newErrors.vehicle_type = true;
    if (!formData.remarks) newErrors.remarks = true;
    if (!formData.reason) newErrors.reason = true;
    if (formData.vehicle_type !== 'Walk' && !formData.vehicle_no)
      newErrors.vehicle_no = true;

    // if (formData.no_driver < 0 || isNaN(formData.no_driver)) {
    //   newErrors.no_driver = "Number of drivers must be a non-negative integer";
    // }
    // if (formData.no_student < 0 || isNaN(formData.no_student)) {
    //   newErrors.no_student = "Number of students must be a non-negative integer";
    // }
    // if (formData.no_visitor < 0 || isNaN(formData.no_visitor)) {
    //   newErrors.no_visitor = "Number of visitors must be a non-negative integer";
    // }
  
    // // Validate total
    // const calculatedTotal =
    //   Number(formData.no_driver || 0) +
    //   Number(formData.no_student || 0) +
    //   Number(formData.no_visitor || 0);
  
    // if (calculatedTotal !== Number(formData.total)) {
    //   newErrors.total = "Total number of persons must match the sum of drivers, students, and visitors";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSave = async () => {
  //   // Validation for required fields
  //   if (!validateForm()) {
  //     return;
  //   }
  //   const payload = {
  //     ...formData,
  //     destination:
  //       formData.custom_destination && formData.destination === "Other"
  //         ? formData.custom_destination
  //         : formData.destination,
  //   };

  //   try {
  //     const response = await fetch('http://localhost:5000/add_entry', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData),
  //     });
  //     const result = await response.json();
  //     if (response.ok) {
  //       setSlipData({ ...formData, entry_id: result.entry_id });

  //       // Generate QR code image after slipData is set
  //       setTimeout(() => {
  //         if (qrCodeRef.current) {
  //           const canvas = qrCodeRef.current.querySelector('canvas');
  //           if (canvas) {
  //             const qrImage = canvas.toDataURL('image/png');
  //             setQrCodeImage(qrImage);
  //           }
  //         }
  //       }, 0);

  //       onOpen();
  //     } else {
  //       console.error('API Error:', result.error);
  //       alert('Error saving the data: ' + result.error);
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     alert('An error occurred. Please try again.');
  //   }
  // };

  const handleSave = async () => {
    // Validate the form fields
    if (!validateForm()) {
      return;
    }
  
    const payload = {
      ...formData,
      destination:
        formData.destination === "Other" && formData.custom_destination
          ? `Other - ${formData.custom_destination}` // Replace with custom destination
          : formData.destination, // Use the original destination otherwise
    };
  
    try {
      const response = await fetch('http://localhost:5000/add_entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send the updated payload
      });
  
      const result = await response.json();
      if (response.ok) {
        setSlipData({ ...formData, entry_id: result.entry_id });
  
        // Generate QR code image after slipData is set
        setTimeout(() => {
          if (qrCodeRef.current) {
            const canvas = qrCodeRef.current.querySelector('canvas');
            if (canvas) {
              const qrImage = canvas.toDataURL('image/png');
              setQrCodeImage(qrImage);
            }
          }
        }, 0);
  
        onOpen();
      } else {
        console.error('API Error:', result.error);
        alert('Error saving the data: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  
  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;

    if (!printContent) {
      console.error("Print content is empty or undefined.");
      return;
    }

    console.log(printContent); // Log the content to ensure it is not empty
    sendPrintCommand(printContent);
    // const originalContent = document.body.innerHTML;

    // document.body.innerHTML = printContent;
    // window.print();
    // document.body.innerHTML = originalContent;
    // // Navigate to "guard-panel" after printing
    // window.location.href = "/guard-panel";
  };

  const sendPrintCommand = async (printData) => {
    try {
      const response = await fetch("http://localhost:9999", {
        method: "POST",
        headers: {
          "Content-Type": "text/html", // Sending the data as HTML
        },
        body: printData, // Directly pass the printContent (HTML string)
      });
      const result = await response.text();
      console.log(result); // "Print success" or "Print failed"
    } catch (error) {
      console.error("Error sending print command:",error);
  }
  };
  
  // const handlePrint = () => {
  //   const printData = {
  //     id: "123",
  //     name: "John Doe",
  //     contact: "1234567890",
  //     vehicle_no: "WALK_1",
  //     destination: "Admin Block",
  //     purpose: "Meeting",
  //     no_driver: "0",
  //     no_student: "0",
  //     no_visitor: "1",
  //     no_person: "1",
  //     in_time: "10:00 AM",
  //     remarks: "NA",
  //   };
  //   sendPrintCommand(printData);
  // };

  const handleCancel = async () => {
    try {
      const response = await fetch("http://localhost:5000/handle_cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry_id: slipData.entry_id }),
      });

      if (!response.ok) {
        console.error("Failed to send cancel request:", response.statusText);
        alert("Error canceling the entry. Please try again.");

      } else {
        console.log("Cancel request successfully sent.");
        onClose(); // Close the modal
        window.location.href = "/guard-panel";
      }
    } catch (error) {
      console.error("Error during cancel request:", error);
      alert("An error occurred while canceling. Please try again.");
      window.location.href = "/guard-panel";
    }
  };



  const gradientBg = 'linear-gradient(135deg, #4A628A, #7AB2D3, #B9E5E8, #DFF2EB)';
  const containerBg = 'linear-gradient(135deg, rgba(223, 242, 235, 0.7), rgba(185, 229, 232, 0.6), rgba(122, 178, 211, 0.5), rgba(74, 98, 138, 0.4))';
  const buttonBg = '#4A628A';
  const buttonHoverBg = '#7AB2D3';
  const buttonBorderHover = '#DFF2EB';
  const textColor = '#1C2D3A';
  const placeholderColor = '#4A628A';
  const inputBg = 'rgba(255, 255, 255, 0.3)';
  const spinnerColor = '#4A628A';
  const errorBorderColor = 'red';

  // Inline styles for placeholder animation
  const placeholderStyle = {
    position: 'absolute',
    top: isFocused || formData.name ? '0' : '50%',
    left: '16px',
    fontSize: '14px',
    color: isFocused || formData.name ? '#FFFFFF' : placeholderColor,
    fontWeight: 'normal',
    background: isFocused || formData.name ? buttonBg : 'transparent',
    borderRadius: '8px',
    padding: isFocused || formData.name ? '2px 6px' : '0',
    transform: isFocused || formData.name
      ? 'translateY(-50%)'
      : 'translateY(-50%)',
    lineHeight: '1',
    opacity: 1,
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
  };

  const getPlaceholderStyle = (value, isFocused) => ({
    position: 'absolute',
    top: isFocused || value ? '0' : '50%',
    left: '16px',
    fontSize: '14px',
    color: isFocused || value ? '#FFFFFF' : placeholderColor,
    fontWeight: 'normal',
    background: isFocused || value ? buttonBg : 'transparent',
    borderRadius: '8px',
    padding: isFocused || value ? '2px 6px' : '0',
    transform: 'translateY(-50%)',
    lineHeight: '1',
    opacity: 1,
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
  });  

  // Input container styling
  const inputContainerStyle = {
    position: 'relative',
    width: '100%',
    border: `2px solid ${isFocused ? buttonBg : placeholderColor}`,
    borderRadius: '25px',
    background: 'rgba(255, 255, 255, 0.3)',
    padding: '6px 16px',
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
      <Flex
        w="full"
        maxW="5xl"
        gap={4}
        align="flex-start"
        justify="center"
      >
        <Box
          bg={containerBg}
          backdropFilter="blur(15px)"
          w="full"
          maxW="lg"
          p={8}
          borderRadius="xl"
          boxShadow="0px 8px 24px rgba(0, 0, 0, 0.15)"
        >
          <VStack spacing={5} w="full">
            <Button
              leftIcon={<ArrowBackIcon />}
              color="#FFFFFF"
              bg={buttonBg}
              onClick={() => navigate('/guard-panel')}
              borderRadius="full"
              alignSelf="start"
              _hover={{
                bg: buttonHoverBg,
                border: `2px solid ${buttonBorderHover}`,
              }}
              _active={{ bg: buttonHoverBg }}
            >
              Back
            </Button>
            <Heading size="lg" color={textColor} fontWeight="semibold">
              Visitor Form
            </Heading>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              <VStack as="form" spacing={3} w="full">
                {/* Name Field */}
                <Box style={inputContainerStyle}>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    size="md"
                    focusBorderColor={buttonBg}
                    borderRadius="full"
                    bg={inputBg}
                    color={textColor}
                    _placeholder={{ color: placeholderColor }}
                    _hover={{ borderColor: buttonBg }}
                    borderColor={errors.name ? errorBorderColor : 'inherit'}
                    style={inputStyle}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <span style={getPlaceholderStyle(formData.name, focusedField === "name")}>
                    Name
                  </span>
                </Box>

                {/* Contact Number Field */}
                <Box style={{
                  ...inputContainerStyle,
                  opacity: 0.6, // Makes the entire field (input and container) appear faded
                  pointerEvents: "none", // Ensures the field is not interactable
                }}>
                  <input
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={handleInputChange}
                    size="md"
                    focusBorderColor={buttonBg}
                    borderRadius="full"
                    bg={inputBg}
                    color={textColor}
                    disabled
                    cursor="not-allowed"
                    style={inputStyle}
                    onFocus={() => setFocusedField("contact_no")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <span
                    style={getPlaceholderStyle(
                      formData.contact_no,
                      focusedField === "contact_no"
                    )}
                  >
                    Contact Number
                  </span>
                </Box>

                {/* Destination Select */}
                <Box style={inputContainerStyle}>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    size="md"
                    focusBorderColor={buttonBg}
                    borderRadius="full"
                    bg={inputBg}
                    color={textColor}
                    borderColor={errors.destination ? errorBorderColor : "inherit"}
                    style={inputStyle}
                    onFocus={() => setFocusedField("destination")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <option value="" disabled>
                      
                    </option>
                    {destinationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span
                    style={getPlaceholderStyle(
                      formData.destination,
                      focusedField === "destination"
                    )}
                  >
                    Destination
                  </span>
                </Box>

                {/* Custom Destination Field (if applicable) */}
                {formData.destination === "Other" && (
                  <Box style={inputContainerStyle}>
                    <input
                      name="custom_destination"
                      value={formData.custom_destination || ""}
                      onChange={handleInputChange}
                      size="md"
                      focusBorderColor={buttonBg}
                      borderRadius="full"
                      bg={inputBg}
                      color={textColor}
                      _placeholder={{ color: placeholderColor }}
                      _hover={{ borderColor: buttonBg }}
                      borderColor={
                        errors.custom_destination ? errorBorderColor : "inherit"
                      }
                      style={inputStyle}
                      onFocus={() => setFocusedField("custom_destination")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <span
                      style={getPlaceholderStyle(
                        formData.custom_destination,
                        focusedField === "custom_destination"
                      )}
                    >
                      Custom Destination
                    </span>
                  </Box>
                )}

                {/* Number of Persons */}
                <Flex w="full" justify="space-between" gap={4}>
                  {/* Drivers */}
                  <Box style={inputContainerStyle} flex="1">
                    <input
                      name="no_driver"
                      type="number"
                      value={formData.no_driver}
                      onChange={(e) =>
                        setFormData({ ...formData, no_driver: parseInt(e.target.value) || 0 })
                      }
                      size="md"
                      focusBorderColor={buttonBg}
                      borderRadius="full"
                      bg={inputBg}
                      color={textColor}
                      _placeholder={{ color: placeholderColor }}
                      _hover={{ borderColor: buttonBg }}
                      borderColor={errors.no_driver ? errorBorderColor : "inherit"}
                      style={inputStyle}
                      onFocus={() => setFocusedField("no_driver")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <span style={getPlaceholderStyle(formData.no_driver, focusedField === "no_driver")}>
                      Dvr
                    </span>
                  </Box>

                  {/* Students */}
                  <Box style={inputContainerStyle} flex="1">
                    <input
                      name="no_student"
                      type="number"
                      value={formData.no_student}
                      onChange={(e) =>
                        setFormData({ ...formData, no_student: parseInt(e.target.value) || 0 })
                      }
                      size="md"
                      focusBorderColor={buttonBg}
                      borderRadius="full"
                      bg={inputBg}
                      color={textColor}
                      _placeholder={{ color: placeholderColor }}
                      _hover={{ borderColor: buttonBg }}
                      borderColor={errors.no_student ? errorBorderColor : "inherit"}
                      style={inputStyle}
                      onFocus={() => setFocusedField("no_student")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <span style={getPlaceholderStyle(formData.no_student, focusedField === "no_student")}>
                      ST
                    </span>
                  </Box>

                  {/* Visitors */}
                  <Box style={inputContainerStyle} flex="1">
                    <input
                      name="no_visitor"
                      type="number"
                      value={formData.no_visitor}
                      onChange={(e) =>
                        setFormData({ ...formData, no_visitor: parseInt(e.target.value) || 0 })
                      }
                      size="md"
                      focusBorderColor={buttonBg}
                      borderRadius="full"
                      bg={inputBg}
                      color={textColor}
                      _placeholder={{ color: placeholderColor }}
                      _hover={{ borderColor: buttonBg }}
                      borderColor={errors.no_visitor ? errorBorderColor : "inherit"}
                      style={inputStyle}
                      onFocus={() => setFocusedField("no_visitor")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <span style={getPlaceholderStyle(formData.no_visitor, focusedField === "no_visitor")}>
                      VT
                    </span>
                  </Box>

                  {/* Total */}
                  <Box
                    style={{
                      ...inputContainerStyle,
                      opacity: 0.6,
                      pointerEvents: "none",
                    }}
                    flex="1"
                  >
                    <input
                      name="total"
                      type="number"
                      value={
                        Number(formData.no_driver) +
                        Number(formData.no_student) +
                        Number(formData.no_visitor)
                      }
                      onChange={handleInputChange}
                      size="md"
                      focusBorderColor={buttonBg}
                      borderRadius="full"
                      bg={inputBg}
                      color={textColor}
                      disabled
                      _placeholder={{ color: placeholderColor }}
                      style={inputStyle}
                      cursor="not-allowed"
                      onFocus={() => setFocusedField("total")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <span style={getPlaceholderStyle(formData.total, focusedField === "total")}>
                      Total
                    </span>
                  </Box>
                </Flex>

                {/* Vehicle Type Select */}
                <Box style={inputContainerStyle}>
                  <select
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleInputChange}
                    size="md"
                    focusBorderColor={buttonBg}
                    borderRadius="full"
                    bg={inputBg}
                    color={textColor}
                    borderColor={errors.vehicle_type ? errorBorderColor : "inherit"}
                    style={inputStyle}
                    onFocus={() => setFocusedField("vehicle_type")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <option value="" disabled>
                      
                    </option>
                    {vehicleTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span
                    style={getPlaceholderStyle(
                      formData.vehicle_type,
                      focusedField === "vehicle_type"
                    )}
                  >
                    Vehicle Type
                  </span>
                </Box>

                {/* Vehicle Number */}
                <Box style={inputContainerStyle}>
                  <input
                    name="vehicle_no"
                    value={formData.vehicle_no}
                    onChange={handleInputChange}
                    size="md"
                    focusBorderColor={buttonBg}
                    borderRadius="full"
                    bg={inputBg}
                    color={textColor}
                    _placeholder={{ color: placeholderColor }}
                    _hover={{ borderColor: buttonBg }}
                    borderColor={errors.vehicle_no ? errorBorderColor : "inherit"}
                    isDisabled={formData.vehicle_type === "Walk"}
                    style={inputStyle}
                    onFocus={() => setFocusedField("vehicle_no")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <span
                    style={getPlaceholderStyle(
                      formData.vehicle_no,
                      focusedField === "vehicle_no"
                    )}
                  >
                    Vehicle Number
                  </span>
                </Box>

                {/* Reason */}
                <Box style={inputContainerStyle}>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    size="md"
                    focusBorderColor={buttonBg}
                    borderRadius="2xl"
                    bg={inputBg}
                    color={textColor}
                    _placeholder={{ color: placeholderColor }}
                    _hover={{ borderColor: buttonBg }}
                    borderColor={errors.reason ? errorBorderColor : "inherit"}
                    style={inputStyle}
                    onFocus={() => setFocusedField("reason")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <span
                    style={getPlaceholderStyle(
                      formData.reason,
                      focusedField === "reason"
                    )}
                  >
                    Reason
                  </span>
                </Box>

                {/* Remarks */}
                <Box style={inputContainerStyle}>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    size="md"
                    focusBorderColor={buttonBg}
                    borderRadius="2xl"
                    bg={inputBg}
                    color={textColor}
                    _placeholder={{ color: placeholderColor }}
                    _hover={{ borderColor: buttonBg }}
                    borderColor={errors.remarks ? errorBorderColor : "inherit"}
                    style={inputStyle}
                    onFocus={() => setFocusedField("remarks")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <span
                    style={getPlaceholderStyle(
                      formData.remarks,
                      focusedField === "remarks"
                    )}
                  >
                    Remarks
                  </span>
                </Box>
                <Button
                  onClick={handleSave}
                  bg={buttonBg}
                  color="#FFFFFF"
                  w="full"
                  size="md"
                  borderRadius="full"
                  _hover={{
                    bg: buttonHoverBg,
                    border: `2px solid ${buttonBorderHover}`,
                  }}
                  _active={{ bg: buttonHoverBg }}
                >
                  Save
                </Button>
              </VStack>
            )}
          </VStack>
        </Box>
        {/* Right Panel: Previous Entries */}
        <Box
          bg={containerBg}
          backdropFilter="blur(15px)"
          w="full"
          maxW="sm" // Set a reasonable width for the "Previous Entries" panel
          p={6}
          borderRadius="xl"
          boxShadow="0px 8px 24px rgba(0, 0, 0, 0.15)"
        >
          <VStack spacing={4} align="stretch" w="full">
            <Heading size="md" color={textColor} fontWeight="semibold">
              Previous Entries
            </Heading>

        {/* Visitor Info */}
        {formData.name && (
          <>
            <HStack spacing={1} align="start">
              <Text fontWeight="medium" color={textColor} mb={0}>
                Visitor:
              </Text>
              <Text fontWeight="medium" color={textColor}>
                {formData.name}
              </Text>
            </HStack>
            <HStack spacing={1} align="start" mt={-5}>
              <Text fontWeight="medium" color={textColor}>
                Contact Number:
              </Text>
              <Text fontWeight="medium" color={textColor}>
                {formData.contact_no}
              </Text>
            </HStack>
          </>
        )}
    
        <Divider borderColor={buttonBg} />

       {/* Previous Entries Section */}
       {isLoadingEntries ? (
         <Spinner size="lg" color={spinnerColor} />
       ) : entries.length > 0 ? (
         <VStack spacing={4} align="stretch">
           {entries.map((entry) => (
             <Fade in key={entry.id}>
               <Box
                 p={4}
                 bg="rgba(255, 255, 255, 0.8)"
                 borderRadius="lg"
                 boxShadow="md"
                 _hover={{ bg: buttonHoverBg, cursor: 'pointer' }}
                 transition="0.3s ease"
                 onClick={() => {
                   setFormData((prevData) => ({
                     ...prevData,
                     destination: entry.destination || '',
                     reason: entry.reason || '',
                     vehicle_type: entry.vehicle_type || '',
                     vehicle_no: entry.vehicle_no || '',
                   }));
                 }}
               >
                 <Text fontWeight="medium" color={textColor}>
                   Destination: {entry.destination || 'N/A'}
                 </Text>
                 <Text fontWeight="medium" color={textColor}>
                   Reason: {entry.reason || 'N/A'}
                 </Text>
                 <Text fontWeight="medium" color={textColor}>
                   Vehicle Type: {entry.vehicle_type || 'N/A'}
                 </Text>
                 <Text fontWeight="medium" color={textColor}>
                   Vehicle Number: {entry.vehicle_no || 'N/A'}
                 </Text>
                 <Text fontWeight="medium" color={textColor}>
                   Date: {entry.in_time || 'N/A'}
                 </Text>
               </Box>
             </Fade>
           ))}
         </VStack>
       ) : (
         <Text fontWeight="medium" color={textColor}>
           First-time visitor
         </Text>
       )}
     </VStack>
   </Box>

        
        {/* Slip Modal */}
        {slipData && (
          <>
            {/* Modal Section */}
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size="sm">
              <ModalOverlay />
              <ModalContent>
                <ModalBody>
                  <Box textAlign="center" p={6} borderWidth="1px" boxShadow="md">
                    <Box bg="black" color="white" py={2} mb={4}>
                      <Text fontSize="lg" fontWeight="bold">BITS ENTRY-EXIT PASS</Text>
                    </Box>
                    <Box bg="gray.50" p={4} textAlign="left" mb={4}>
                      <Text><strong>ID:</strong> {slipData.entry_id}</Text>
                      <Text><strong>Name:</strong> {slipData.name}</Text>
                      <Text><strong>Contact No.:</strong> {slipData.contact_no}</Text>
                      <Text><strong>Vehicle No.:</strong> {slipData.vehicle_no}</Text>
                      <Text>
                        <strong>Where To Go:</strong>{" "}
                        {slipData.destination === "Other"
                          ? `Other - ${slipData.custom_destination}`
                          : slipData.destination}
                      </Text>
                      <Text><strong>Reason:</strong> {slipData.reason}</Text>
                      <Text><strong>In Time:</strong> {slipData.in_time}</Text>
                      <Text><strong>Vehicle Type:</strong> {slipData.vehicle_type}</Text>
                      <Text><strong>Remarks:</strong> {slipData.remarks}</Text>
                      <Box mt={4}>
                        <Text fontWeight="bold" mb={2}>Number of Persons:</Text>
                        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                          <Text><strong>Driver:</strong> {slipData.no_driver}</Text>
                          <Text><strong>Students:</strong> {slipData.no_student}</Text>
                          <Text><strong>Visitors:</strong> {slipData.no_visitor}</Text>
                          <Text><strong>Total:</strong> {slipData.no_driver+slipData.no_student+slipData.no_visitor}</Text>
                        </Grid>
                      </Box>
                    </Box>
                    <Box ref={qrCodeRef} display="flex" justifyContent="center" mt={4}>
                      <QRCodeCanvas value={slipData.entry_id} size={128} />
                    </Box>
                  </Box>
                </ModalBody>
                <ModalFooter display="flex" alignItems="center">
                  <Button colorScheme="red" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Spacer />
                  <Button colorScheme="blue" onClick={handlePrint}>
                    Print
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
        
            {/* Print Section */}
            <div id="print-section" ref={printRef} style={{ display: 'none' }}>
              <Box
                width="58mm"
                textAlign="center"
                p={2}
                borderWidth="1px"
                fontSize="12px"
                fontFamily="monospace"
              >
                <Box
                  className="title-box"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "8px",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  <Text fontSize="lg" fontWeight="bold">BITS ENTRY-EXIT PASS</Text>
                </Box>
                <Box textAlign="left" mb={2}>
                  <Text><strong>______________________________</strong></Text>
                  <Text><strong>ID:</strong> {slipData.entry_id}</Text>
                  <Text><strong>Name:</strong> {slipData.name}</Text>
                  <Text><strong>Contact No.:</strong> {slipData.contact_no}</Text>
                  <Text><strong>Vehicle No.:</strong> {slipData.vehicle_no}</Text>
                  <Text>
                    <strong>Where To Go:</strong>{" "}
                    {slipData.destination === "Other"
                      ? `Other - ${slipData.custom_destination}`
                      : slipData.destination}
                  </Text>
                  <Text><strong>Reason:</strong> {slipData.reason}</Text>
                  <Text><strong>In Time:</strong> {slipData.in_time}</Text>
                  <Text><strong>Vehicle Type:</strong> {slipData.vehicle_type}</Text>
                  <Text><strong>Remarks:</strong> {slipData.remarks}</Text>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Text><strong>Driver:</strong> {slipData.no_driver}</Text>
                    <Text><strong>Student:</strong> {slipData.no_student}</Text>
                    <Text><strong>Visitor:</strong> {slipData.no_visitor}</Text>
                    <Text><strong>Total:</strong> {slipData.total}</Text>
                  </Box>
                  <Text><strong>Please Return this Pass at BITS Main Gate</strong></Text>
                  <Text><strong>______________________________</strong></Text>
                </Box>
                <Box display="flex" justifyContent="center" mt={2}>
                  {qrCodeImage ? (
                    <img src={qrCodeImage} alt="QR Code" style={{ width: "80px", height: "80px" }} />
                  ) : (
                    <Text>Loading QR Code...</Text>
                  )}
                </Box>
              </Box>
            </div>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default VisitorForm;

// import { Select } from '@chakra-ui/react';
// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { QRCodeCanvas } from 'qrcode.react';
// import { ArrowBackIcon } from '@chakra-ui/icons';
// import { HStack } from '@chakra-ui/react';


// import {
//   Box,
//   Button,
//   Heading,
//   Input,
//   Textarea,
//   VStack,
//   Text,
//   Flex,
//   Spinner,
//   Spacer,
//   Divider,
//   Fade,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalBody,
//   ModalFooter,
// } from '@chakra-ui/react';

// function VisitorForm() {
//   const location = useLocation();
//   const [isFocused, setIsFocused] = useState(false);

//   const handleFocus = () => setIsFocused(true);
//   const handleBlur = (fieldName) => {
//     if (!formData[fieldName]?.trim()) {
//       setIsFocused(false);
//     }
//   };

//   const navigate = useNavigate();
//   const { mobileNumber } = location.state || {};

//   const destinationOptions = [
//     'Other',
//     'IPC',
//     'LTC',
//     'FD1',
//     'FD2',
//     'FD3',
//     'ANC',
//     'New Academic Block',
//     'Library',
//     'Medical Center',
//     'V-FAST',
//     'Cannot Place',
//     'Ashok Bhawan',
//     'Budh Bhawan',
//     'CVR Bhawan',
//     'Gandhi Bhawan',
//     'Krishna Bhawan',
//     'Meera Bhawan',
//     'Ram Bhawan',
//     'RP Bhawan',
//     'Shankar Bhawan',
//     'SR Bhawan',
//     'VK Bhawan',
//     'Vyas Bhawan',
//   ];
//   const vehicleTypeOptions = ['Car', 'Bike', 'Scooty', 'Rickshaw', 'Tractor', 'Bus', 'Truck', 'Cycle', 'Walk'];

//   const [formData, setFormData] = useState({
//     id: '',
//     name: '',
//     contact_no: mobileNumber || '',
//     vehicle_no: '',
//     destination: '',
//     reason: '',
//     in_time: new Date().toLocaleString(),
//     vehicle_type: '',
//     remarks: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [entries, setEntries] = useState([]);
//   const [isLoadingEntries, setIsLoadingEntries] = useState(false);
//   const [slipData, setSlipData] = useState(null);
//   const [qrCodeImage, setQrCodeImage] = useState(null); // QR code as an image for printing
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const qrCodeRef = useRef();
//   const printRef = useRef();

//   useEffect(() => {
//     const fetchVisitorData = async () => {
//       if (mobileNumber) {
//         try {
//           setLoading(true);
//           const response = await fetch(
//             `http://localhost:5000/get_visitor_details?contact_no=${mobileNumber}`
//           );
//           const result = await response.json();

//           if (response.ok) {
//             setFormData((prevData) => ({
//               ...prevData,
//               name: result.name || '',
//             }));
//           }
//         } catch (error) {
//           console.error('Error fetching visitor data:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     const fetchLastEntries = async () => {
//       if (mobileNumber) {
//         try {
//           setIsLoadingEntries(true);
//           const response = await fetch(
//             `http://localhost:5000/last_entries?contact_no=${mobileNumber}`
//           );
//           const result = await response.json();

//           if (response.ok) {
//             setEntries(result);
//           } else {
//             setEntries([]);
//           }
//         } catch (error) {
//           console.error('Error fetching last entries:', error);
//         } finally {
//           setIsLoadingEntries(false);
//         }
//       }
//     };

//     fetchVisitorData();
//     fetchLastEntries();
//   }, [mobileNumber]);


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Validation for the name field to allow only letters and spaces
//     if (name === 'name' && !/^[a-zA-Z\s]*$/.test(value)) {
//       return;
//     }

//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: false });
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name) newErrors.name = true;
//     if (!formData.contact_no) newErrors.contact_no = true;
//     if (!formData.destination) newErrors.destination = true;
//     if (formData.destination === "Other" && !formData.custom_destination) {
//       errors.custom_destination = "Custom destination is required";
//     }
//     if (!formData.vehicle_type) newErrors.vehicle_type = true;
//     if (!formData.remarks) newErrors.remarks = true;
//     if (!formData.reason) newErrors.reason = true;
//     if (formData.vehicle_type !== 'Walk' && !formData.vehicle_no)
//       newErrors.vehicle_no = true;

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // const handleSave = async () => {
//   //   // Validation for required fields
//   //   if (!validateForm()) {
//   //     return;
//   //   }
//   //   const payload = {
//   //     ...formData,
//   //     destination:
//   //       formData.custom_destination && formData.destination === "Other"
//   //         ? formData.custom_destination
//   //         : formData.destination,
//   //   };

//   //   try {
//   //     const response = await fetch('http://localhost:5000/add_entry', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify(formData),
//   //     });
//   //     const result = await response.json();
//   //     if (response.ok) {
//   //       setSlipData({ ...formData, entry_id: result.entry_id });

//   //       // Generate QR code image after slipData is set
//   //       setTimeout(() => {
//   //         if (qrCodeRef.current) {
//   //           const canvas = qrCodeRef.current.querySelector('canvas');
//   //           if (canvas) {
//   //             const qrImage = canvas.toDataURL('image/png');
//   //             setQrCodeImage(qrImage);
//   //           }
//   //         }
//   //       }, 0);

//   //       onOpen();
//   //     } else {
//   //       console.error('API Error:', result.error);
//   //       alert('Error saving the data: ' + result.error);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error submitting form:', error);
//   //     alert('An error occurred. Please try again.');
//   //   }
//   // };

//   const handleSave = async () => {
//     // Validate the form fields
//     if (!validateForm()) {
//       return;
//     }
  
//     const payload = {
//       ...formData,
//       destination:
//         formData.destination === "Other" && formData.custom_destination
//           ? `Other - ${formData.custom_destination}` // Replace with custom destination
//           : formData.destination, // Use the original destination otherwise
//     };
  
//     try {
//       const response = await fetch('http://localhost:5000/add_entry', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload), // Send the updated payload
//       });
  
//       const result = await response.json();
//       if (response.ok) {
//         setSlipData({ ...formData, entry_id: result.entry_id });
  
//         // Generate QR code image after slipData is set
//         setTimeout(() => {
//           if (qrCodeRef.current) {
//             const canvas = qrCodeRef.current.querySelector('canvas');
//             if (canvas) {
//               const qrImage = canvas.toDataURL('image/png');
//               setQrCodeImage(qrImage);
//             }
//           }
//         }, 0);
  
//         onOpen();
//       } else {
//         console.error('API Error:', result.error);
//         alert('Error saving the data: ' + result.error);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('An error occurred. Please try again.');
//     }
//   };

  
//   const handlePrint = () => {
//     const printContent = printRef.current?.innerHTML;

//     if (!printContent) {
//       console.error("Print content is empty or undefined.");
//       return;
//     }

//     console.log(printContent); // Log the content to ensure it is not empty
//     const originalContent = document.body.innerHTML;

//     document.body.innerHTML = printContent;
//     window.print();
//     document.body.innerHTML = originalContent;
//     // Navigate to "guard-panel" after printing
//     window.location.href = "/guard-panel";
//   };
//   const handleCancel = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/handle_cancel", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ entry_id: slipData.entry_id }),
//       });

//       if (!response.ok) {
//         console.error("Failed to send cancel request:", response.statusText);
//         alert("Error canceling the entry. Please try again.");

//       } else {
//         console.log("Cancel request successfully sent.");
//         onClose(); // Close the modal
//         window.location.href = "/guard-panel";
//       }
//     } catch (error) {
//       console.error("Error during cancel request:", error);
//       alert("An error occurred while canceling. Please try again.");
//       window.location.href = "/guard-panel";
//     }
//   };



//   const gradientBg = 'linear-gradient(135deg, #4A628A, #7AB2D3, #B9E5E8, #DFF2EB)';
//   const containerBg = 'linear-gradient(135deg, rgba(223, 242, 235, 0.7), rgba(185, 229, 232, 0.6), rgba(122, 178, 211, 0.5), rgba(74, 98, 138, 0.4))';
//   const buttonBg = '#4A628A';
//   const buttonHoverBg = '#7AB2D3';
//   const buttonBorderHover = '#DFF2EB';
//   const textColor = '#1C2D3A';
//   const placeholderColor = '#4A628A';
//   const inputBg = 'rgba(255, 255, 255, 0.3)';
//   const spinnerColor = '#4A628A';
//   const errorBorderColor = 'red';

//   const placeholderStyle = {
//     position: 'absolute',
//     top: isFocused ? '0' : '50%',
//     left: '16px',
//     fontSize: '14px',
//     color: isFocused ? '#FFFFFF' : placeholderColor,
//     fontWeight: 'normal',
//     background: isFocused ? buttonBg : 'transparent',
//     borderRadius: '8px',
//     padding: isFocused ? '2px 6px' : '0',
//     transform: isFocused ? 'translateY(-50%)' : 'translateY(-50%)',
//     lineHeight: '1',
//     opacity: 1,
//     transition: 'all 0.3s ease',
//     pointerEvents: 'none',
//   };
  
//   const inputContainerStyle = {
//     position: 'relative',
//     width: '100%',
//     border: `2px solid ${isFocused ? buttonBg : placeholderColor}`,
//     borderRadius: '25px',
//     background: 'rgba(255, 255, 255, 0.3)',
//     padding: '12px 16px',
//     transition: 'border-color 0.3s ease, padding 0.3s ease',
//   };
  
//   const inputStyle = {
//     width: '100%',
//     border: 'none',
//     outline: 'none',
//     fontSize: '16px',
//     background: 'transparent',
//     color: textColor,
//   };
  
//   return (
//     <Flex minH="100vh" align="center" justify="center" bg={gradientBg} p={8}>
//       <Flex
//         w="full"
//         maxW="5xl"
//         gap={4}
//         align="flex-start"
//         justify="center"
//       >
//         <Box
//   bg={containerBg}
//   backdropFilter="blur(15px)"
//   w="full"
//   maxW="lg"
//   p={8}
//   borderRadius="xl"
//   boxShadow="0px 8px 24px rgba(0, 0, 0, 0.15)"
// >
//   <VStack spacing={6} w="full">
//     {/* Back Button and Heading */}
//     <Button
//       leftIcon={<ArrowBackIcon />}
//       color="#FFFFFF"
//       bg={buttonBg}
//       onClick={() => navigate('/guard-panel')}
//       borderRadius="full"
//       alignSelf="start"
//       _hover={{
//         bg: buttonHoverBg,
//         border: `2px solid ${buttonBorderHover}`,
//       }}
//       _active={{ bg: buttonHoverBg }}
//     >
//       Back
//     </Button>
//     <Heading size="lg" color={textColor} fontWeight="semibold">
//       Visitor Form
//     </Heading>

//     {/* Form Content */}
//     {loading ? (
//       <Spinner size="lg" />
//     ) : (
//       <VStack as="form" spacing={4} w="full">
//         {/* Input Fields with Animated Placeholder */}
//         {[
//           { name: 'name', value: formData.name, placeholder: 'Enter Name' },
//           {
//             name: 'contact_no',
//             value: formData.contact_no,
//             placeholder: 'Enter Contact Number',
//             isDisabled: true,
//           },
//           {
//             name: 'vehicle_no',
//             value: formData.vehicle_no,
//             placeholder: 'Enter Vehicle Number',
//             isDisabled: formData.vehicle_type === 'Walk',
//           },
//         ].map(({ name, value, placeholder, isDisabled }) => (
//           <Box
//             key={name}
//             position="relative"
//             w="full"
//             border={`2px solid ${isFocused[name] ? buttonBg : placeholderColor}`}
//             borderRadius="full"
//             bg="rgba(255, 255, 255, 0.3)"
//             px={4}
//             py={2}
//             transition="border-color 0.3s ease"
//             onFocus={() => setIsFocused({ ...isFocused, [name]: true })}
//             onBlur={() =>
//               setIsFocused({
//                 ...isFocused,
//                 [name]: value.trim() ? true : false,
//               })
//             }
//           >
//             <input
//               type="text"
//               name={name}
//               value={value}
//               onChange={handleInputChange}
//               maxLength={name === 'contact_no' ? 10 : undefined}
//               disabled={isDisabled}
//               style={{
//                 width: '100%',
//                 border: 'none',
//                 outline: 'none',
//                 background: 'transparent',
//                 fontSize: '16px',
//                 color: textColor,
//               }}
//             />
//             <span
//               style={{
//                 position: 'absolute',
//                 top: isFocused[name] || value ? '0' : '50%',
//                 left: '16px',
//                 fontSize: '14px',
//                 color: isFocused[name] || value ? buttonBg : placeholderColor,
//                 background: isFocused[name] || value ? 'rgba(255,255,255,0.8)' : 'transparent',
//                 padding: isFocused[name] || value ? '2px 6px' : '0',
//                 borderRadius: '8px',
//                 transform: 'translateY(-50%)',
//                 pointerEvents: 'none',
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               {placeholder}
//             </span>
//           </Box>
//         ))}

//         {/* Select Fields with Animated Placeholder */}
//         {[
//           {
//             name: 'destination',
//             value: formData.destination,
//             placeholder: 'Select Destination',
//             options: destinationOptions,
//           },
//           {
//             name: 'vehicle_type',
//             value: formData.vehicle_type,
//             placeholder: 'Select Vehicle Type',
//             options: vehicleTypeOptions,
//           },
//         ].map(({ name, value, placeholder, options }) => (
//           <Box
//             key={name}
//             position="relative"
//             w="full"
//             border={`2px solid ${isFocused[name] ? buttonBg : placeholderColor}`}
//             borderRadius="full"
//             bg="rgba(255, 255, 255, 0.3)"
//             px={4}
//             py={2}
//             transition="border-color 0.3s ease"
//             onFocus={() => setIsFocused({ ...isFocused, [name]: true })}
//             onBlur={() =>
//               setIsFocused({
//                 ...isFocused,
//                 [name]: value ? true : false,
//               })
//             }
//           >
//             <select
//               name={name}
//               value={value}
//               onChange={handleInputChange}
//               style={{
//                 width: '100%',
//                 border: 'none',
//                 outline: 'none',
//                 background: 'transparent',
//                 fontSize: '16px',
//                 color: textColor,
//                 padding: '10px',
//                 appearance: 'none',
//               }}
//             >
//               <option value="" disabled hidden></option> {/* Hidden empty option */}
//               {options.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//             <span
//               style={{
//                 position: 'absolute',
//                 top: isFocused[name] || value ? '0' : '50%',
//                 left: '16px',
//                 fontSize: '14px',
//                 color: isFocused[name] || value ? buttonBg : placeholderColor,
//                 background: isFocused[name] || value ? 'rgba(255,255,255,0.8)' : 'transparent',
//                 padding: isFocused[name] || value ? '2px 6px' : '0',
//                 borderRadius: '8px',
//                 transform: 'translateY(-50%)',
//                 pointerEvents: 'none',
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               {placeholder}
//             </span>
//             {/* Custom Arrow Icon */}
//             <Box
//               position="absolute"
//               top="50%"
//               right="12px"
//               transform="translateY(-50%)"
//               pointerEvents="none"
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill={isFocused[name] ? buttonBg : placeholderColor}
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path d="M7 10l5 5 5-5H7z" />
//               </svg>
//             </Box>
//           </Box>
//         ))}
        

//         {/* Textareas */}
//         {[
//           { name: 'reason', value: formData.reason, placeholder: 'Enter Reason' },
//           { name: 'remarks', value: formData.remarks, placeholder: 'Remarks' },
//         ].map(({ name, value, placeholder }) => (
//           <Box
//             key={name}
//             position="relative"
//             w="full"
//             border={`2px solid ${isFocused[name] ? buttonBg : placeholderColor}`}
//             borderRadius="2xl"
//             bg="rgba(255, 255, 255, 0.3)"
//             px={4}
//             py={2}
//             transition="border-color 0.3s ease"
//             onFocus={() => setIsFocused({ ...isFocused, [name]: true })}
//             onBlur={() =>
//               setIsFocused({
//                 ...isFocused,
//                 [name]: value.trim() ? true : false,
//               })
//             }
//           >
//             <textarea
//               name={name}
//               value={value}
//               onChange={handleInputChange}
//               style={{
//                 width: '100%',
//                 border: 'none',
//                 outline: 'none',
//                 background: 'transparent',
//                 fontSize: '16px',
//                 color: textColor,
//                 resize: 'none',
//                 minHeight: '80px',
//               }}
//             />
//             <span
//               style={{
//                 position: 'absolute',
//                 top: isFocused[name] || value ? '0' : '50%',
//                 left: '16px',
//                 fontSize: '14px',
//                 color: isFocused[name] || value ? buttonBg : placeholderColor,
//                 background: isFocused[name] || value ? 'rgba(255,255,255,0.8)' : 'transparent',
//                 padding: isFocused[name] || value ? '2px 6px' : '0',
//                 borderRadius: '8px',
//                 transform: 'translateY(-50%)',
//                 pointerEvents: 'none',
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               {placeholder}
//             </span>
//           </Box>
//         ))}

//         {/* Save Button */}
//         <Button
//           onClick={handleSave}
//           bg={buttonBg}
//           color="#FFFFFF"
//           w="full"
//           size="md"
//           borderRadius="full"
//           _hover={{
//             bg: buttonHoverBg,
//             border: `2px solid ${buttonBorderHover}`,
//           }}
//           _active={{ bg: buttonHoverBg }}
//         >
//           Save
//         </Button>
//       </VStack>
//     )}
//   </VStack>
// </Box>

        
//         {/* Right Panel: Previous Entries */}
//         <Box
//           bg={containerBg}
//           backdropFilter="blur(15px)"
//           w="full"
//           maxW="sm" // Set a reasonable width for the "Previous Entries" panel
//           p={6}
//           borderRadius="xl"
//           boxShadow="0px 8px 24px rgba(0, 0, 0, 0.15)"
//         >
//           <VStack spacing={4} align="stretch" w="full">
//             <Heading size="md" color={textColor} fontWeight="semibold">
//               Previous Entries
//             </Heading>

//         {/* Visitor Info */}
//         {formData.name && (
//           <>
//             <HStack spacing={1} align="start">
//               <Text fontWeight="medium" color={textColor} mb={0}>
//                 Visitor:
//               </Text>
//               <Text fontWeight="medium" color={textColor}>
//                 {formData.name}
//               </Text>
//             </HStack>
//             <HStack spacing={1} align="start" mt={-5}>
//               <Text fontWeight="medium" color={textColor}>
//                 Contact Number:
//               </Text>
//               <Text fontWeight="medium" color={textColor}>
//                 {formData.contact_no}
//               </Text>
//             </HStack>
//           </>
//         )}
    
//         <Divider borderColor={buttonBg} />

//        {/* Previous Entries Section */}
//        {isLoadingEntries ? (
//          <Spinner size="lg" color={spinnerColor} />
//        ) : entries.length > 0 ? (
//          <VStack spacing={4} align="stretch">
//            {entries.map((entry) => (
//              <Fade in key={entry.id}>
//                <Box
//                  p={4}
//                  bg="rgba(255, 255, 255, 0.8)"
//                  borderRadius="lg"
//                  boxShadow="md"
//                  _hover={{ bg: buttonHoverBg, cursor: 'pointer' }}
//                  transition="0.3s ease"
//                  onClick={() => {
//                    setFormData((prevData) => ({
//                      ...prevData,
//                      destination: entry.destination || '',
//                      reason: entry.reason || '',
//                      vehicle_type: entry.vehicle_type || '',
//                      vehicle_no: entry.vehicle_no || '',
//                    }));
//                  }}
//                >
//                  <Text fontWeight="medium" color={textColor}>
//                    Destination: {entry.destination || 'N/A'}
//                  </Text>
//                  <Text fontWeight="medium" color={textColor}>
//                    Reason: {entry.reason || 'N/A'}
//                  </Text>
//                  <Text fontWeight="medium" color={textColor}>
//                    Vehicle Type: {entry.vehicle_type || 'N/A'}
//                  </Text>
//                  <Text fontWeight="medium" color={textColor}>
//                    Vehicle Number: {entry.vehicle_no || 'N/A'}
//                  </Text>
//                  <Text fontWeight="medium" color={textColor}>
//                    Date: {entry.in_time || 'N/A'}
//                  </Text>
//                </Box>
//              </Fade>
//            ))}
//          </VStack>
//        ) : (
//          <Text fontWeight="medium" color={textColor}>
//            First-time visitor
//          </Text>
//        )}
//      </VStack>
//    </Box>

        
//         {/* Slip Modal */}
//         {slipData && (
//           <>
//             {/* Modal Section */}
//             <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size="sm">
//               <ModalOverlay />
//               <ModalContent>
//                 <ModalBody>
//                   <Box
//                     textAlign="center"
//                     p={6}
//                     borderWidth="1px"
//                     boxShadow="md"
//                   >
//                     <Box bg="black" color="white" py={2} mb={4}>
//                       <Text fontSize="lg" fontWeight="bold">BITS ENTRY-EXIT PASS</Text>
//                     </Box>
//                     <Box
//                       bg="gray.50"
//                       p={4}
//                       textAlign="left"
//                       mb={4}
//                     >
//                       <Text><strong>ID:</strong> {slipData.entry_id}</Text>
//                       <Text><strong>Name:</strong> {slipData.name}</Text>
//                       <Text><strong>Contact No.:</strong> {slipData.contact_no}</Text>
//                       <Text><strong>Vehicle No.:</strong> {slipData.vehicle_no}</Text>
//                       <Text>
//                         <strong>Where To Go:</strong>{" "}
//                         {slipData.destination === "Other"
//                           ? `Other - ${slipData.custom_destination}`
//                           : slipData.destination}
//                       </Text>
//                       <Text><strong>Reason:</strong> {slipData.reason}</Text>
//                       <Text><strong>In Time:</strong> {slipData.in_time}</Text>
//                       <Text><strong>Vehicle Type:</strong> {slipData.vehicle_type}</Text>
//                       <Text><strong>Remarks:</strong> {slipData.remarks}</Text>
//                     </Box>
//                     <Box ref={qrCodeRef} display="flex" justifyContent="center" mt={4}>
//                       <QRCodeCanvas value={slipData.entry_id} size={128} />
//                     </Box>
//                   </Box>
//                 </ModalBody>
//                 <ModalFooter display="flex" alignItems="center">
//                   <Button colorScheme="red" onClick={handleCancel}>
//                     Cancel
//                   </Button>
//                   <Spacer />
//                   <Button colorScheme="blue" onClick={handlePrint}>
//                     Print
//                   </Button>
//                 </ModalFooter>
//               </ModalContent>
//             </Modal>
        
//             {/* Print Section */}
//             <div id="print-section" ref={printRef} style={{ display: 'none' }}>
//               <Box
//                 width="58mm"
//                 textAlign="center"
//                 p={2}
//                 borderWidth="1px"
//                 fontSize="12px"
//                 fontFamily="monospace"
//               >
//                 <Box
//                   className="title-box"
//                   style={{
//                     backgroundColor: "black",
//                     color: "white",
//                     padding: "8px",
//                     marginBottom: "16px",
//                     textAlign: "center",
//                   }}
//                 >
//                   <Text fontSize="lg" fontWeight="bold">BITS ENTRY-EXIT PASS</Text>
//                 </Box>
//                 <Box textAlign="left" mb={2}>
//                   <Text><strong>______________________________</strong></Text>
//                   <Text><strong>ID:</strong> {slipData.entry_id}</Text>
//                   <Text><strong>Name:</strong> {slipData.name}</Text>
//                   <Text><strong>Contact No.:</strong> {slipData.contact_no}</Text>
//                   <Text><strong>Vehicle No.:</strong> {slipData.vehicle_no}</Text>
//                   <Text>
//                     <strong>Where To Go:</strong>{" "}
//                     {slipData.destination === "Other"
//                       ? `Other - ${slipData.custom_destination}`
//                       : slipData.destination}
//                   </Text>
//                   <Text><strong>Reason:</strong> {slipData.reason}</Text>
//                   <Text><strong>In Time:</strong> {slipData.in_time}</Text>
//                   <Text><strong>Vehicle Type:</strong> {slipData.vehicle_type}</Text>
//                   <Text><strong>Remarks:</strong> {slipData.remarks}</Text>
//                   <Text><strong>Please Return this Pass at BITS Main Gate</strong></Text>
//                   <Text><strong>______________________________</strong></Text>
//                 </Box>
//                 <Box display="flex" justifyContent="center" mt={2}>
//                   {qrCodeImage ? (
//                     <img src={qrCodeImage} alt="QR Code" style={{ width: "80px", height: "80px" }} />
//                   ) : (
//                     <Text>Loading QR Code...</Text>
//                   )}
//                 </Box>
//               </Box>
//             </div>
//           </>
//         )}
//       </Flex>
//     </Flex>
//   );
// }

// export default VisitorForm;

