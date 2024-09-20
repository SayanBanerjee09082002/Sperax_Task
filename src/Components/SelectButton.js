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
      whiteSpace="nowrap"
      width="fit-content"
      maxWidth="100%"
      overflow="hidden"
      textOverflow="ellipsis"
    >
      {children}
    </Button>
  );
};

export default SelectButton;
