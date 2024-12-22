import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';

const DropdownMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); // Use navigate hook

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const redirectTo = (path) => {
    navigate(path); // Programmatically navigate to the path
    handleClose(); // Close the menu after navigating
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        style={{
          backgroundColor: '#b7b3ab',
          marginTop: '10px',
          marginLeft: '10px',
          color: '#1f0202',
        }}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => redirectTo('/askchefgpt')}>Ask ChefGPT</MenuItem>
        <MenuItem onClick={() => redirectTo('/recipebook')}>Recipe Book</MenuItem>
        <MenuItem onClick={() => redirectTo('/logout')}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default DropdownMenu;
