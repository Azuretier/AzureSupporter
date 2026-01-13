import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HomePage } from '@/pages/HomePage';
import { RankCardPage } from '@/pages/RankCardPage';
import { DonatePage } from '@/pages/DonatePage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guilds/:guildId/rank-card/:userDiscordDisplayName" element={<RankCardPage />} />
        <Route path="/donate" element={<DonatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
