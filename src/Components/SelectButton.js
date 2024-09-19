import { Button } from "@chakra-ui/react";

const SelectButton = ({ children, selected, onClick }) => {
  return (
    <Button
      onClick={onClick}
      bg={selected ? "gold" : "transparent"}
      color={selected ? "black" : "inherit"}
      fontWeight={selected ? "bold" : "medium"}
      border="1px solid"
      borderColor="gold"
      borderRadius="md"
      px={5}
      py={2}
      _hover={{
        bg: "gold",
        color: "black",
      }}
      whiteSpace="nowrap"  // Prevent text from wrapping
      width="fit-content"  // Let the button adjust to content width
      maxWidth="100%"      // Ensure the button doesn’t overflow its container
      overflow="hidden"    // Hide overflow in case of too much text
      textOverflow="ellipsis" // Add ellipsis if text is too long
    >
      {children}
    </Button>
  );
};

export default SelectButton;
