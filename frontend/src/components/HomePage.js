import React from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    "Real-time collaborative coding using Socket.IO",
    "Monaco editor with syntax highlighting",
    "Dynamic code execution with live output",
    "Integrated chat for communication",
    "Multi-user presence display",
    "Create or join sessions instantly",
    "HTML/CSS/JS project support",
    "JWT-based authentication and secure sessions",
  ];

  const enhancements = [
    "Multi-language code support (Python, Java, C++)",
    "GitHub integration for version control",
    "Support for project folders and file trees",
    "Voice & video chat for collaboration",
    "Mobile responsive layout for all devices",
    "Interview mode with timer and question panel",
  ];

  return (
    <Box
      sx={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        py: 8,
        px: 2,
        color: "#fff",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 4,
            color: "#ffffff",
            textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
          }}
        >
          🚀 Collaborative Code Editor
        </Typography>

        <Box textAlign="center" mb={6}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              m: 1,
              px: 4,
              backgroundColor: "#00e676",
              "&:hover": { backgroundColor: "#00c853" },
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            sx={{
              m: 1,
              px: 4,
              color: "#fff",
              borderColor: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: 4,
                color: "#e0f7fa",
              }}
            >
              <Typography variant="h5" gutterBottom color="#00e5ff">
                🌟 Features
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: "#00e5ff" }} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: 4,
                color: "#fff3e0",
              }}
            >
              <Typography variant="h5" gutterBottom color="#ffc107">
                🚀 Future Enhancements
              </Typography>
              <List>
                {enhancements.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <LightbulbIcon sx={{ color: "#ffc107" }} />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Box mt={6} textAlign="center">
          <Typography
            variant="body2"
            sx={{
              backgroundColor: "rgba(0,0,0,0.6)",
              py: 2,
              borderRadius: 2,
              fontSize: "0.95rem",
            }}
          >
            © 2025 Collaborative Code Editor | Built with ❤️ using React, Node.js, and Socket.IO
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
