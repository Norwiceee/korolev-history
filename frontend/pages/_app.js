// pages/_app.js
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#283593" },
        secondary: { main: "#ff6f00" }
    },
    typography: {
        fontFamily: "Montserrat, Roboto, Arial, sans-serif"
    }
});

export default function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
