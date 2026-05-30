import React from 'react';

const Leaderboards = ({ userStats, emoteStats, statsSort, setStatsSort }) => {

  const handleSort = (table, key) => {
    setStatsSort(prev => {
      const current = prev[table];
      if (current.key === key) {
        return { ...prev, [table]: { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } };
      }
      return { ...prev, [table]: { key, dir: 'desc' } };
    });
  };

  const getSortedData = (data, table) => {
    const sortConfig = statsSort[table];
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortConfig.key] || 0;
      const valB = b[sortConfig.key] || 0;
      if (valA < valB) return sortConfig.dir === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.dir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const SortIndicator = ({ table, column }) => {
    const config = statsSort[table];
    if (config?.key === column) {
      return <span>{config.dir === 'asc' ? ' ▲' : ' ▼'}</span>;
    }
    return null;
  };

  const sortedDuels = getSortedData(userStats, 'duels');
  const sortedRaffles = getSortedData(userStats, 'raffles');
  const sortedGamble = getSortedData(userStats, 'gamble');
  const sortedBets = getSortedData(userStats, 'bets');
  const sortedChatwar = getSortedData(userStats, 'chatwar');
  const sortedEmotes = getSortedData(emoteStats, 'emotes');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Duels Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="card-header"><h3 className="card-title">⚔️ Duels</h3></div>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Username</th>
              <th onClick={() => handleSort('duels', 'duels_played')}>Played <SortIndicator table="duels" column="duels_played"/></th>
              <th onClick={() => handleSort('duels', 'duels_won')}>Won <SortIndicator table="duels" column="duels_won"/></th>
              <th onClick={() => handleSort('duels', 'duels_lost')}>Lost <SortIndicator table="duels" column="duels_lost"/></th>
              <th onClick={() => handleSort('duels', 'duels_points_won')}>Pts Won <SortIndicator table="duels" column="duels_points_won"/></th>
              <th onClick={() => handleSort('duels', 'duels_points_lost')}>Pts Lost <SortIndicator table="duels" column="duels_points_lost"/></th>
            </tr>
          </thead>
          <tbody>
            {sortedDuels.slice(0, 10).map(u => (
              <tr key={u.username}>
                <td>{u.username}</td>
                <td>{u.duels_played}</td>
                <td>{u.duels_won}</td>
                <td>{u.duels_lost}</td>
                <td style={{ color: 'var(--success-color, #4ade80)' }}>+{u.duels_points_won}</td>
                <td style={{ color: 'var(--danger-color, #ef4444)' }}>-{u.duels_points_lost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Raffles Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="card-header"><h3 className="card-title">🎟️ Raffles</h3></div>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Username</th>
              <th onClick={() => handleSort('raffles', 'raffles_joined')}>Joined <SortIndicator table="raffles" column="raffles_joined"/></th>
              <th onClick={() => handleSort('raffles', 'raffles_won')}>Won <SortIndicator table="raffles" column="raffles_won"/></th>
              <th onClick={() => handleSort('raffles', 'raffles_points_won')}>Pts Won <SortIndicator table="raffles" column="raffles_points_won"/></th>
            </tr>
          </thead>
          <tbody>
            {sortedRaffles.slice(0, 10).map(u => (
              <tr key={u.username}>
                <td>{u.username}</td>
                <td>{u.raffles_joined}</td>
                <td>{u.raffles_won}</td>
                <td style={{ color: 'var(--success-color, #4ade80)' }}>+{u.raffles_points_won}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gamble Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="card-header"><h3 className="card-title">🎲 Gamble</h3></div>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Username</th>
              <th onClick={() => handleSort('gamble', 'gamble_played')}>Played <SortIndicator table="gamble" column="gamble_played"/></th>
              <th onClick={() => handleSort('gamble', 'gamble_won')}>Won <SortIndicator table="gamble" column="gamble_won"/></th>
              <th onClick={() => handleSort('gamble', 'gamble_lost')}>Lost <SortIndicator table="gamble" column="gamble_lost"/></th>
              <th onClick={() => handleSort('gamble', 'gamble_points_won')}>Pts Won <SortIndicator table="gamble" column="gamble_points_won"/></th>
              <th onClick={() => handleSort('gamble', 'gamble_points_lost')}>Pts Lost <SortIndicator table="gamble" column="gamble_points_lost"/></th>
            </tr>
          </thead>
          <tbody>
            {sortedGamble.slice(0, 10).map(u => (
              <tr key={u.username}>
                <td>{u.username}</td>
                <td>{u.gamble_played}</td>
                <td>{u.gamble_won}</td>
                <td>{u.gamble_lost}</td>
                <td style={{ color: 'var(--success-color, #4ade80)' }}>+{u.gamble_points_won}</td>
                <td style={{ color: 'var(--danger-color, #ef4444)' }}>-{u.gamble_points_lost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bets Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="card-header"><h3 className="card-title">📈 Bets</h3></div>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Username</th>
              <th onClick={() => handleSort('bets', 'bets_played')}>Played <SortIndicator table="bets" column="bets_played"/></th>
              <th onClick={() => handleSort('bets', 'bets_won')}>Won <SortIndicator table="bets" column="bets_won"/></th>
              <th onClick={() => handleSort('bets', 'bets_lost')}>Lost <SortIndicator table="bets" column="bets_lost"/></th>
              <th onClick={() => handleSort('bets', 'bets_points_bet')}>Pts Bet <SortIndicator table="bets" column="bets_points_bet"/></th>
              <th onClick={() => handleSort('bets', 'bets_points_won')}>Pts Won <SortIndicator table="bets" column="bets_points_won"/></th>
              <th onClick={() => handleSort('bets', 'bets_points_lost')}>Pts Lost <SortIndicator table="bets" column="bets_points_lost"/></th>
            </tr>
          </thead>
          <tbody>
            {sortedBets.slice(0, 10).map(u => (
              <tr key={u.username}>
                <td>{u.username}</td>
                <td>{u.bets_played}</td>
                <td>{u.bets_won}</td>
                <td>{u.bets_lost}</td>
                <td>{u.bets_points_bet}</td>
                <td style={{ color: 'var(--success-color, #4ade80)' }}>+{u.bets_points_won}</td>
                <td style={{ color: 'var(--danger-color, #ef4444)' }}>-{u.bets_points_lost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chatwar (Users) */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="card-header"><h3 className="card-title">⚔️ Chatwar (Users)</h3></div>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Username</th>
              <th onClick={() => handleSort('chatwar', 'chatwar_spent')}>Pts Spent <SortIndicator table="chatwar" column="chatwar_spent"/></th>
              <th onClick={() => handleSort('chatwar', 'chatwar_lost')}>Pts Lost <SortIndicator table="chatwar" column="chatwar_lost"/></th>
            </tr>
          </thead>
          <tbody>
            {sortedChatwar.slice(0, 10).map(u => (
              <tr key={u.username}>
                <td>{u.username}</td>
                <td>{u.chatwar_spent}</td>
                <td style={{ color: 'var(--danger-color, #ef4444)' }}>-{u.chatwar_lost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chatwar (Emotes) */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="card-header"><h3 className="card-title">🔥 Chatwar (Emote Ratios)</h3></div>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Emote</th>
              <th onClick={() => handleSort('emotes', 'chatwar_battles')}>Battles <SortIndicator table="emotes" column="chatwar_battles"/></th>
              <th onClick={() => handleSort('emotes', 'chatwar_wins')}>Wins <SortIndicator table="emotes" column="chatwar_wins"/></th>
              <th>Win %</th>
            </tr>
          </thead>
          <tbody>
            {sortedEmotes.slice(0, 10).map(e => {
              const winRatio = e.chatwar_battles > 0 ? ((e.chatwar_wins / e.chatwar_battles) * 100).toFixed(1) : 0;
              return (
                <tr key={e.emote}>
                  <td>{e.emote}</td>
                  <td>{e.chatwar_battles}</td>
                  <td>{e.chatwar_wins}</td>
                  <td>{winRatio}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Leaderboards;
