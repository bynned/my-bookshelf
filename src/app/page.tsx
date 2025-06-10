'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Grid,
} from "@mui/material";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const CORRECT_PIN = "1234";

  const handleSubmit = () => {
    if (pin === CORRECT_PIN) {
      router.push("/home");
    } else {
      setError("Incorrect PIN");
      setPin("");
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
      setError(""); // clear error if typing again
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError("");
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Enter PIN
        </Typography>

        <Box
          sx={{
            textAlign: "center",
            fontSize: "2rem",
            letterSpacing: "0.8rem",
            my: 2,
            height: "3rem",
            userSelect: "none",
          }}
        >
          {pin.padEnd(4, "•")}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "Del", "0", "OK"].map((key, index) => {
            let onClick;
            let color: "primary" | "error" | "success" = "primary";
            let disabled = false;

            if (key === "Del") {
              onClick = handleDelete;
              color = "error";
            } else if (key === "OK") {
              onClick = handleSubmit;
              color = "success";
              disabled = pin.length !== 4;
            } else {
              onClick = () => handleDigitClick(key);
            }

            return (
              <Grid key={index} size={{ xs: 4}}>
                <Button
                  variant="contained"
                  color={color}
                  fullWidth
                  sx={{ height: 60 }}
                  onClick={onClick}
                  disabled={disabled}
                >
                  {key}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Container>
  );
}
