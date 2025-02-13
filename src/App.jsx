import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material';
import './App.css';
import { isValidEmail } from './shared/validators/email-validator.js';
import MainMenu from './shared/components/MainMenu';

const LOCAL_STORAGE_KEY = 'users';
const SAVE_MESSAGE = 'User has been saved!';
const ERROR_MESSAGE = 'An error occurred while trying to fetch users...';

const App = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);
    const [view, setView] = useState('home');
    const [localStorageError, setLocalStorageError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');

    //load users from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                if (Array.isArray(parsedData)) {
                    setUsers(parsedData);
                }
            } catch (error) {
                console.error('Error when parsing users from localStorage:', error);
                setLocalStorageError(ERROR_MESSAGE);
            }
        }
    }, []);

    // validation
    const isFormValid = username.trim() !== '' && isValidEmail(email);

    // add a new user, first it checks if already exists
    const onSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid)  {
            return;
        }
        const newUser = {
            username: username.trim(),
            email: email.trim(),
        };

        const existingUser = users.find((user) => user.username === newUser.username);
        if (existingUser) {
            setPendingUser(newUser);
            setOpenConfirm(true);
        } else {
            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            setSaveSuccess(SAVE_MESSAGE);
            setUsername('');
            setEmail('');
        }
    };

    // confirmation modal
    const modalConfirmOverwrite = () => {
        const updatedUsers = users.map((user) =>
            user.username === pendingUser.username ? pendingUser : user
        );
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setSaveSuccess(SAVE_MESSAGE);
        setPendingUser(null);
        setUsername('');
        setEmail('');
        setOpenConfirm(false);
    };

    const modalCancelOverwrite = () => {
        setPendingUser(null);
        setOpenConfirm(false);
    };

    return (
        <>
            <MainMenu
                  onHomeClick={() => {
                    setView('home');
                    setSaveSuccess('');
                  }}
                onAddUserClick={() => { 
                    setView('addUser');
                    setSaveSuccess('');
                }}
            />
            <Container maxWidth="sm" sx={{ mt: 4, backgroundColor: 'white', p: 2 }}>
                {localStorageError &&
                    <Typography variant="body1" className="message error">
                        {localStorageError}
                    </Typography>}

                {saveSuccess &&
                    <Typography variant="body1" className="message success">
                        {saveSuccess}
                    </Typography>}

                {/* HOME PAGE */}
                {view === 'home' ? (
                    <>
                        <Typography variant="h4" gutterBottom>
                            <img src="src/assets/images/users.png" width="30" alt="" /> Users:
                        </Typography>
                        {users.length === 0 ? (
                            <Typography>No users found.</Typography>
                        ) : (
                            <Box display="flex" flexDirection="column" gap={1} className="users-container">
                                {users.map((user, index) => (
                                    <Box
                                        className="list-users"
                                        key={index}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        p={1}
                                    >
                                        <Typography variant="h6">{user.username}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.email}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </>
                ) : (

                    <>
                    {/* ADD USER PAGE */}
                        <Typography variant="h4" gutterBottom>
                            <img src="/src/assets/images/add-user.png" width="30" alt="" /> Add New User
                        </Typography>
                        <form onSubmit={onSubmit}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={email !== '' && !isValidEmail(email)}
                                helperText={
                                    email !== '' && !isValidEmail(email)
                                        ? 'Please enter a valid email address.'
                                        : ''
                                }
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!isFormValid}
                                sx={{ mt: 2 }}
                            >
                                Submit
                            </Button>
                        </form>
                    </>
                )}

                {/* MODAL */}
                <Dialog open={openConfirm} onClose={modalCancelOverwrite}>
                    <DialogTitle>Confirm Overwrite</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            A user with the username "{pendingUser?.username}" already exists.
                            Do you want to overwrite it?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={modalCancelOverwrite} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={modalConfirmOverwrite} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default App;
