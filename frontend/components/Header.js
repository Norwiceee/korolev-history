import Link from "next/link";
import { Box, Typography, Grid, Button } from "@mui/material";

export default function Header() {
    return (
        <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h3" gutterBottom>
                Сергей Павлович Королёв
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
                Основатель советской космонавтики, главный конструктор.
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Button variant="contained" component={Link} href="/biography">БИОГРАФИЯ</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" component={Link} href="/timeline">ХРОНОЛОГИЯ</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" component={Link} href="/gallery">ГАЛЕРЕЯ</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" component={Link} href="/achievements">ДОСТИЖЕНИЯ</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" component={Link} href="/documents">ДОКУМЕНТЫ</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" component={Link} href="/quiz">ВИКТОРИНА</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" component={Link} href="/feedback">ОБРАТНАЯ СВЯЗЬ</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
