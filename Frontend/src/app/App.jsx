import { RouterProvider } from "react-router"
import { router } from "./app.routes"

function App() {

  console.log(import.meta.env.VITE_BACKEND_URL);
  return (
    <RouterProvider router={router} />
  )
}

export default App
