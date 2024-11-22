import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./Router";
import { SupabaseUserProvider } from "./context/SupabaseUserContext";
import { Toaster } from "sonner";

function App() {
  return (
    <>
    <SupabaseUserProvider>
    <Toaster position="top-right" richColors />
      <RouterProvider router={router}></RouterProvider>
    </SupabaseUserProvider>
    </>
  );
}

export default App;
