import Link from "next/link";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

export default function NavBar() {
    return (
        <AppBar position="static">
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
                </Box>
            </Toolbar>
        </AppBar>
    );
}
