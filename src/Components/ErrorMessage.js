import { Box } from "@chakra-ui/react";

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="alert alert-error mt-5">
      <div className="flex-1">
        <Box marginTop={4}>
          <label>{message}</label>
        </Box>
      </div>
    </div>
  );
}
