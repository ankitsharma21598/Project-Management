
import { ApolloProvider } from "@apollo/client/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "@/store";
import { apolloClient } from "@/lib/apollo";
import Index from "./pages/index";
import Auth from "./pages/Auth";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';


const App = () => (
  <Provider store={store}>
    <ApolloProvider client={apolloClient}>
      <TooltipProvider>
          <ToastContainer />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
                
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetail />
                  </ProtectedRoute>
                
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
    </ApolloProvider>
  </Provider>
);

export default App;
