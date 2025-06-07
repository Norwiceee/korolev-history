import Link from "next/link";
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem
} from "@mui/material";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import { useRouter } from "next/router";

export default function NavBar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);

    // Для выпадающего меню профиля
    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <AppBar
            position="static"
            sx={{
                mb: 0,
                boxShadow: "none",
                border: "none",
                background: "linear-gradient(90deg,#1882d5,#283593)"
            }}
        >
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} href="/">Главная</Button>
                    <Button color="inherit" component={Link} href="/biography">Биография</Button>
                    <Button color="inherit" component={Link} href="/timeline">Хронология</Button>
                    <Button color="inherit" component={Link} href="/gallery">Галерея</Button>
                    <Button color="inherit" component={Link} href="/achievements">Достижения</Button>
                    <Button color="inherit" component={Link} href="/documents">Документы</Button>
                    <Button color="inherit" component={Link} href="/quiz">Викторина</Button>
                    <Button color="inherit" component={Link} href="/feedback">Обратная связь</Button>
                    <Button color="inherit" component={Link} href="/bookings">Билеты</Button>
                    {user?.role === "admin" && (
                        <Button color="secondary" variant="outlined" component={Link} href="/admin" sx={{ ml: 2 }}>
                            Админ-панель
                        </Button>
                    )}
                </Box>
                {!user ? (
                    <>
                        <Button color="inherit" component={Link} href="/login">
                            Войти
                        </Button>
                        <Button color="inherit" component={Link} href="/register">
                            Регистрация
                        </Button>
                    </>
                ) : (
                    <>
                        <IconButton color="inherit" onClick={handleMenu} size="large">
                            <Avatar sx={{ bgcolor: "#3949ab" }}>
                                {user.name ? user.name.charAt(0).toUpperCase() : "П"}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {user.role === "admin" && (
                                <MenuItem onClick={() => { router.push("/admin"); handleClose(); }}>
                                    Админ-панель
                                </MenuItem>
                            )}
                            <MenuItem onClick={() => { router.push("/profile"); handleClose(); }}>
                                Профиль
                            </MenuItem>
                            <MenuItem onClick={() => { logout(); router.push("/"); handleClose(); }}>
                                Выйти
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}