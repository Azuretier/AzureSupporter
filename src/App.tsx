import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { RankCardPage } from '@/pages/RankCardPage';

export interface RuleProgress {
  ruleId: string
  read: boolean
  quizScore: number | null
  quizAttempts: number
  mastered: boolean
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guilds/:guild_id/rank-card/:user_discord_display_name" element={<RankCardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
