import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { AuthProvider } from "../components/AuthContext"; // проверь путь!

const theme = createTheme(); // создаёт дефолтную тему MUI

export default function App({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </ThemeProvider>
    );
}
