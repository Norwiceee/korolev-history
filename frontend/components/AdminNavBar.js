// components/AdminNavBar.js

import { AppBar, Toolbar, Button, Box } from "@mui/material";
import Link from "next/link";

const adminNav = [
    { href: "/admin", label: "Главная админки" },
    { href: "/admin-quiz", label: "Квизы" },
    { href: "/admin-gallery", label: "Галерея" },
    { href: "/admin-documents", label: "Документы" },
    { href: "/admin-booking", label: "Билеты" },
    { href: "/admin-feedback", label: "Обратная связь" },
];

export default function AdminNavBar() {
    return (
        <AppBar position="static" color="secondary" sx={{ mb: 4 }}>
            <Toolbar variant="dense">
                <Box sx={{ flexGrow: 1 }}>
                    {adminNav.map(nav => (
                        <Button
                            key={nav.href}
                            color="inherit"
                            component={Link}
                            href={nav.href}
                            sx={{ mr: 1 }}
                        >
                            {nav.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}