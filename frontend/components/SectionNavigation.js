// components/SectionNavigation.js
import Link from "next/link";
import { Box, Button } from "@mui/material";

export function SectionNavigation({ prev, next }) {
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 5,
            gap: 2
        }}>
            {/* Левая кнопка */}
            {prev ? (
                <Link href={prev.href} passHref legacyBehavior>
                    <Button variant="outlined" color="primary">
                        ← {prev.label}
                    </Button>
                </Link>
            ) : <Box width={140} />} {/* Фиксированная ширина для симметрии */}

            {/* Кнопка "В меню" */}
            <Link href="/" passHref legacyBehavior>
                <Button variant="text" color="secondary" sx={{
                    fontWeight: "bold",
                    px: 4
                }}>
                    В меню
                </Button>
            </Link>

            {/* Правая кнопка */}
            {next ? (
                <Link href={next.href} passHref legacyBehavior>
                    <Button variant="contained" color="primary">
                        {next.label} →
                    </Button>
                </Link>
            ) : <Box width={140} />} {/* Фиксированная ширина для симметрии */}
        </Box>
    );
}
