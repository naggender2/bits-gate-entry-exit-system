// import React, { useState } from 'react';
// import {
//   Input,
//   InputGroup,
//   Flex,
//   Box,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   Icon,
// } from '@chakra-ui/react';
// import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

// const SearchBar = ({ onSearch }) => {
//   const [searchType, setSearchType] = useState('');
//   const [query, setQuery] = useState('');
//   const [isMenuOpen, setIsMenuOpen] = useState(false); // Tracks the dropdown state

//   const handleSearchTypeChange = (value) => {
//     setSearchType(value);
//     setQuery(''); // Clear the query when search type changes
//   };

//   const handleQueryChange = (e) => {
//     setQuery(e.target.value);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && searchType) {
//       onSearch(query, searchType); // Execute search only on Enter key press
//     }
//   };

//   const placeholderText = searchType
//     ? `Search by ${searchType}`
//     : 'Please select a field'; // Dynamic placeholder text

//   // Theme variables for consistency
//   const buttonBg = '#4A628A';
//   const buttonHoverBg = '#7AB2D3';
//   const placeholderColor = '#4A628A';
//   const borderColor = '#7AB2D3';
//   const inputBg = 'rgba(255, 255, 255, 0.3)';
//   const dropdownBg = '#4A628A';
//   const dropdownHoverBg = '#7AB2D3';
//   const textColor1 = '#000000';
//   const textColor = '#FFFFFF';

//   return (
//     <Flex align="center" justify="center" mb={6} w="full" maxW="600px">
//       <InputGroup size="md" boxShadow="none">
//         {/* Dropdown Button */}
//         <Box
//           as="span"
//           display="flex"
//           alignItems="center"
//           color={textColor}
//           fontWeight="bold"
//           borderTopLeftRadius="full"
//           borderBottomLeftRadius="full"
//           px={3}
//           borderRight={`1px solid ${borderColor}`}
//           bg={buttonBg}
//         >
//           <Menu
//             onOpen={() => setIsMenuOpen(true)}
//             onClose={() => setIsMenuOpen(false)}
//           >
//             <MenuButton
//               as={Box}
//               cursor="pointer"
//               minWidth="100px"
//               display="flex"
//               alignItems="center"
//               justifyContent="space-between"
//             >
//               {/* Text and Arrow */}
//               <Flex align="center" justifyContent="space-between" w="100%">
//                 <Box color={textColor} fontWeight="bold" size="sm">
//                   {searchType || 'Search by'}
//                 </Box>
//                 <Icon
//                   as={isMenuOpen ? ChevronUpIcon : ChevronDownIcon} // Changes based on dropdown state
//                   boxSize={4}
//                   color={textColor}
//                   ml={2} // Add margin to the left of the arrow
//                 />
//               </Flex>
//             </MenuButton>
//             <MenuList
//               bg={dropdownBg}
//               color={textColor}
//               border="none"
//               mt="-2px"
//               ml="-8px"
//               borderBottomLeftRadius="lg"
//               borderBottomRightRadius="lg"
//               p="0"
//               overflow="hidden"
//               w="120px"
//             >
//               {['ID', 'Name', 'Contact'].map((option) => (
//                 <MenuItem
//                   key={option}
//                   onClick={() => handleSearchTypeChange(option)}
//                   _hover={{ bg: dropdownHoverBg }}
//                   bg={dropdownBg}
//                   color={textColor}
//                   fontWeight="bold"
//                   _focus={{ bg: dropdownHoverBg }}
//                 >
//                   {option}
//                 </MenuItem>
//               ))}
//             </MenuList>
//           </Menu>
//         </Box>

//         {/* Search Input */}
//         <Input
//           placeholder={placeholderText} // Dynamic placeholder
//           value={query}
//           onChange={handleQueryChange}
//           onKeyDown={handleKeyDown}
//           borderTopRightRadius="full"
//           borderBottomRightRadius="full"
//           border={`1px solid ${borderColor}`}
//           borderLeft="none"
//           pl={4}
//           _focus={{ borderColor: borderColor }}
//           bg={inputBg}
//           color={textColor1}
//           _placeholder={{ color: placeholderColor }}
//           disabled={!searchType} // Disable input if no search type is selected
//         />
//       </InputGroup>
//     </Flex>
//   );
// };

// export default SearchBar;

import React, { useState } from 'react';
import {
  Input,
  InputGroup,
  Flex,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  InputRightElement,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, CalendarIcon, SearchIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('');
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
    setQuery('');
    setIsDatePickerOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setQuery(date?.toLocaleDateString() || '');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchType) {
      triggerSearch();
    }
  };

  const triggerSearch = () => {
    const searchValue = searchType === 'Date' ? query : query;
    if (searchType) {
      onSearch(searchValue, searchType);
    }
  };

  const placeholderText = searchType
    ? `Search by ${searchType}`
    : 'Please select a field';

  const buttonBg = '#4A628A';
  const buttonHoverBg = '#7AB2D3';
  const placeholderColor = '#4A628A';
  const borderColor = '#7AB2D3';
  const inputBg = 'rgba(255, 255, 255, 0.3)';
  const dropdownBg = '#4A628A';
  const dropdownHoverBg = '#7AB2D3';
  const textColor1 = '#000000';
  const textColor = '#FFFFFF';

  const calendarStyles = {
    '--react-datepicker-background-color': '#4A628A',
    '--react-datepicker-header-color': '#FFFFFF',
    '--react-datepicker-day-hover-background-color': '#7AB2D3',
    '--react-datepicker-selected-background-color': '#7AB2D3',
    '--react-datepicker-text-color': '#FFFFFF',
  };

  return (
    <Flex align="center" justify="center" mb={6} w="full" maxW="600px">
      <InputGroup size="md" boxShadow="none">
        <Box
          as="span"
          display="flex"
          alignItems="center"
          color={textColor}
          fontWeight="bold"
          borderTopLeftRadius="full"
          borderBottomLeftRadius="full"
          px={3}
          borderRight={`1px solid ${borderColor}`}
          bg={buttonBg}
        >
          <Menu
            onOpen={() => setIsMenuOpen(true)}
            onClose={() => setIsMenuOpen(false)}
          >
            <MenuButton
              as={Box}
              cursor="pointer"
              minWidth="100px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex align="center" justifyContent="space-between" w="100%">
                <Box color={textColor} fontWeight="bold" size="sm">
                  {searchType || 'Search by'}
                </Box>
                <Icon
                  as={isMenuOpen ? ChevronUpIcon : ChevronDownIcon}
                  boxSize={4}
                  color={textColor}
                  ml={2}
                />
              </Flex>
            </MenuButton>
            <MenuList
              bg={dropdownBg}
              color={textColor}
              border="none"
              mt="-2px"
              ml="-8px"
              borderBottomLeftRadius="lg"
              borderBottomRightRadius="lg"
              p="0"
              overflow="hidden"
              w="120px"
            >
              {['ID', 'Name', 'Contact', 'Date'].map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => handleSearchTypeChange(option)}
                  _hover={{ bg: dropdownHoverBg }}
                  bg={dropdownBg}
                  color={textColor}
                  fontWeight="bold"
                  _focus={{ bg: dropdownHoverBg }}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>

        <Box position="relative" w="full">
          <Input
            placeholder={placeholderText}
            value={query}
            readOnly={searchType === 'Date'}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            borderTopRightRadius="full"
            borderBottomRightRadius="full"
            border={`1px solid ${borderColor}`}
            borderLeft="none"
            pl={4}
            _focus={{ borderColor: borderColor }}
            bg={inputBg}
            color={textColor1}
            _placeholder={{ color: placeholderColor }}
            disabled={!searchType}
          />
          <InputRightElement
  pr={searchType === 'Date' ? 10 : 2} /* Add more padding only when the calendar icon is present */
>
  <Flex
    gap={searchType === 'Date' ? 3 : 0} /* Add spacing only when both icons are present */
    alignItems="center"
  >
    {searchType === 'Date' && (
      <Icon
        as={CalendarIcon}
        color="#2D3748"
        cursor="pointer"
        boxSize={5} /* Keep the calendar icon size consistent */
        onClick={() => setIsDatePickerOpen((prev) => !prev)}
      />
    )}
    <Icon
      as={SearchIcon}
      color="#2D3748"
      cursor="pointer"
      boxSize={5} /* Keep the search icon size consistent */
      onClick={triggerSearch}
    />
  </Flex>
</InputRightElement>

{isDatePickerOpen && searchType === 'Date' && (
  <Box
    position="absolute"
    top="45px" /* Positioned directly below the calendar icon */
    right="10px" /* Adjusted to align with the icon */
    zIndex="10"
    bg="white"
    boxShadow="0px 8px 20px rgba(0, 0, 0, 0.2)" /* Smooth shadow for a modern look */
    borderRadius="12px" /* Smooth rounded corners */
    overflow="hidden"
    transformOrigin="top right" /* Makes animation originate from the icon */
    animation="fadeIn 0.3s ease-in-out" /* Smooth fade-in animation */
  >
    <DatePicker
      inline
      selected={selectedDate}
      onChange={(date) => {
        handleDateChange(date); // Automatically close the calendar on selection
        setIsDatePickerOpen(false);
      }}
      dateFormat="dd/MM/yyyy"
      showYearDropdown
      showMonthDropdown
      dropdownMode="select" /* Enables modern dropdowns for year and month */
      calendarClassName="react-datepicker-modern" /* Modern custom class for styling */
    />
  </Box>
)}


        </Box>
      </InputGroup>
    </Flex>
  );
};

export default SearchBar;
