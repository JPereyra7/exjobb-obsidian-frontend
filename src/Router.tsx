import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { InactivePropertiesPage } from "./pages/InactivePropertiesPage";
import { Chat } from "./pages/Chat";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/inactive",
                element: <InactivePropertiesPage />,
            },
            {
                path: "/chat",
                element: <Chat />,
            }
        ]
    }
])