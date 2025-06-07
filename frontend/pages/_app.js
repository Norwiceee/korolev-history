// _app.js
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { AuthProvider, useAuth } from "../components/AuthContext";
import NavBar from "../components/NavBar";
import AdminNavBar from "../components/AdminNavBar";
import { useRouter } from "next/router";

const theme = createTheme();

function MyAppContainer({ Component, pageProps }) {
    const { user } = useAuth();
    const router = useRouter();
    // Покроет /admin, /admin-panel, /admin-quiz и т.д.
    const isAdminRoute = /^\/admin($|-)/.test(router.pathname);

    return (
        <>
            {!isAdminRoute && <NavBar />}
            {user && user.role === "admin" && isAdminRoute && <AdminNavBar />}
            <Component {...pageProps} />
        </>
    );
}

export default function App(props) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <MyAppContainer {...props} />
            </AuthProvider>
        </ThemeProvider>
    );
}