// client/src/TopBar.js
import { Box, Avatar, Typography , Tooltip} from '@mui/material';

export default function TopBar({ users }) {
  console.log("users in topbar",users)
  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "#1e1e1e",
      color: "white",
      px: 2,
      py: 1
    }}>
      <Typography sx={{ mr: 2 }}>👥 Users in room:</Typography>
      {users.map(user => (
        <Tooltip title={user.name} key={user._id} arrow>
          <Avatar sx={{ width: 32, height: 32, mx: 0.5 }}>
            {user?.name[0]?.toUpperCase()}
          </Avatar>
        </Tooltip>
      
      ))}
    </Box>
  );
}
