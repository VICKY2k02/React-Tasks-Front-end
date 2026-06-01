import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import {AuthProvider} from "../src/context/AuthContext";
import "./index.css";
import "./pages/styles.css"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
