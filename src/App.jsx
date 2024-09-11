import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing";
import Error from "./Error";
import ProtectedRoute from "./ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";
import Journal from "./pages/Journal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <Error />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <Error />,
    children: [{ path: "/dashboard", element: <Journal />, index: true }],
  },
  {
    path: "*",
    element: <PageNotFound />,
    errorElement: <Error />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            paddings: "16px 24px",
            backgroundColor: "whitesmoke",
            color: "black",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
