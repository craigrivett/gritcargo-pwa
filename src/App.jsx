import { Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav.jsx'
import Chat from './pages/Chat.jsx'
import Shipments from './pages/Shipments.jsx'
import AgentControl from './pages/AgentControl.jsx'
import Hire from './pages/Hire.jsx'
import Toast from './components/Toast.jsx'

export default function App() {
  return (
    <div className="flex flex-col h-full bg-bg text-white overflow-hidden">
      <div className="flex-1 overflow-hidden relative">
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/agents" element={<AgentControl />} />
          <Route path="/hire" element={<Hire />} />
        </Routes>
      </div>
      <BottomNav />
      <Toast />
    </div>
  )
}
