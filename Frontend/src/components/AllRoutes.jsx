import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import LiveSession from "./pages/LiveSession"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Signup from "./pages/Signup"
import Leaderboard from "./pages/Leaderboard"
import Bot from "./pages/Bot"
export default function AllRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
             <Route path="/livesession" element={<LiveSession/>}/>
               <Route path="/Login" element={<Login/>}/>
                <Route path="/notfound" element={<NotFound/>}/>
                 <Route path="*" element={<NotFound/>}/>
                 <Route path="/signup" element={<Signup/>}/>
                 <Route path="/lead" element={<Leaderboard/>}/>
                 <Route path="/bot" element={<Bot/>}/>
        </Routes>
    )
}