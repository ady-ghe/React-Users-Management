import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';

const MainMenu = ({ onHomeClick, onAddUserClick }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Button color="inherit" onClick={onHomeClick}>
                    Home
                </Button>
                <Button color="inherit" onClick={onAddUserClick}>
                    Add User
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default MainMenu;
