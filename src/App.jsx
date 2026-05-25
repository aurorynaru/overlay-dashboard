import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Play, Pause, Volume2, Database, Terminal, Settings, ChevronDown, ChevronRight } from 'lucide-react';

const commandInstructions = {
  '!playsound': 'Play an audio file. Usage: !playsound <sound_name>',
  '!showemote': 'Display an emote on the overlay. Usage: !showemote <emote>',
  '!betstart': 'Start a betting session. Usage: !betstart <time_in_seconds> <choice1,choice2> <Description>',
  '!betstop': 'Resolve a bet. Usage: !betstop <winning_choice>',
  '!betstatus': 'Check current bet info. Usage: !betstatus',
  '!points': 'Check your points. Usage: !points',
  '!gamble': 'Gamble your points. Usage: !gamble <amount>',
  '!chatwar': 'Start a chat war. Usage: !chatwar <emote1> <emote2>',
  '!chatwarcancel': 'Cancel the chat war. Usage: !chatwarcancel',
  '!global': 'Global command settings (cooldown).',
  '!commandlist': 'Show all commands.',
  '!addcommand': 'Add a custom command (Admin). Usage: !addcommand <cmd> <action>',
  '!removecommand': 'Remove a custom command (Admin). Usage: !removecommand <cmd>',
  '!editcommand': 'Edit custom command cost/cooldown (Admin). Usage: !editcommand <cmd> <setting> <value>',
  '!duel': 'Challenge another user for points! Usage: !duel @user <amount>',
  '!acceptduel': 'Accept a pending duel request.',
  '!declineduel': 'Decline a pending duel request.'
};

function App() {
  const [data, setData] = useState({ defaultCommands: [], customCommands: [], sounds: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL); 
  const [collapsed, setCollapsed] = useState({ builtIn: false, custom: false, sounds: false });
  const [copiedId, setCopiedId] = useState(null);
  const [volume, setVolume] = useState(0.2); // Default 20% volume
  const [soundSortBy, setSoundSortBy] = useState('date-desc');
  
  const [playingSound, setPlayingSound] = useState(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    fetchData(apiUrl);
    
    // Cleanup audio on unmount
    return () => {
      audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const fetchData = async (url) => {
    setLoading(true);
    setError('');
    try {
      // Remove trailing slash if any
      const cleanUrl = url.replace(/\/$/, '');
      const response = await axios.get(`${cleanUrl}/api/dashboard-data`);
      if (response.data.success) {
        setData(response.data);
      } else {
        setError('Failed to fetch data: ' + response.data.error);
      }
    } catch (err) {
      setError('Could not connect to the server. Make sure your server is running and CORS is enabled.');
    } finally {
      setLoading(false);
    }
  };

  const playSound = (soundName) => {
    const cleanUrl = apiUrl.replace(/\/$/, '');
    const soundUrl = `${cleanUrl}/playsounds/${soundName}`;
    
    if (playingSound === soundName) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        setPlayingSound(null);
      }
    } else {
      audioRef.current.src = soundUrl;
      audioRef.current.play();
      setPlayingSound(soundName);
      
      audioRef.current.onended = () => {
        setPlayingSound(null);
      };
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSection = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredDefaults = data.defaultCommands.filter(c => c.command.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCustoms = data.customCommands.filter(c => c.command.toLowerCase().includes(searchTerm.toLowerCase()) || c.action.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredSounds = data.sounds
    .filter(s => (s.filename || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (soundSortBy === 'name-asc') return (a.filename || '').localeCompare(b.filename || '');
      if (soundSortBy === 'name-desc') return (b.filename || '').localeCompare(a.filename || '');
      if (soundSortBy === 'date-asc') return (a.uploadedAt || 0) - (b.uploadedAt || 0);
      return (b.uploadedAt || 0) - (a.uploadedAt || 0); // default: date-desc
    });

  return (
    <div className="dashboard-container">
      <div className="sticky-header">
        <h1><Database size={40} /> Overlay Dashboard</h1>
        
        <div className="header-controls">
          <div className="volume-control">
            <Volume2 size={24} color="#bf94ff" />
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
            <span>{Math.round(volume * 100)}%</span>
          </div>

          <div className="search-bar">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search commands or sounds..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Connecting to server...</div>
      ) : (
        <>
          {/* Built-in Commands */}
          <div className="section">
            <h2 onClick={() => toggleSection('builtIn')}>
              {collapsed.builtIn ? <ChevronRight size={24} style={{marginRight: '8px'}} /> : <ChevronDown size={24} style={{marginRight: '8px'}} />}
              <Settings size={24} style={{marginRight: '8px'}}/> Built-in Commands
            </h2>
            <div className={`section-content ${collapsed.builtIn ? 'collapsed' : ''}`}>
              <div className="grid">
                {filteredDefaults.map(cmd => (
                  <div key={cmd.command} className="card" onClick={() => copyToClipboard(cmd.command, cmd.command)}>
                    {copiedId === cmd.command && <div className="copy-toast">Copied!</div>}
                    <div className="card-header">
                      <h3 className="card-title">{cmd.command}</h3>
                    </div>
                    {commandInstructions[cmd.command] && (
                      <div className="card-instruction">{commandInstructions[cmd.command]}</div>
                    )}
                    <div className="card-body">
                      {Object.entries(cmd.settings).map(([key, val]) => (
                        <div className="stat-row" key={key}>
                          <span className="stat-label">{key}:</span>
                          <span className="stat-value">{val !== undefined ? val : 'Default'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredDefaults.length === 0 && <p style={{color: 'var(--text-muted)'}}>No default commands found.</p>}
              </div>
            </div>
          </div>

          {/* Custom Commands */}
          <div className="section">
            <h2 onClick={() => toggleSection('custom')}>
              {collapsed.custom ? <ChevronRight size={24} style={{marginRight: '8px'}} /> : <ChevronDown size={24} style={{marginRight: '8px'}} />}
              <Terminal size={24} style={{marginRight: '8px'}}/> Custom Commands ({filteredCustoms.length})
            </h2>
            <div className={`section-content ${collapsed.custom ? 'collapsed' : ''}`}>
              <div className="grid">
                {filteredCustoms.map(cmd => (
                  <div key={cmd.command} className="card" onClick={() => copyToClipboard(cmd.command, cmd.command)}>
                    {copiedId === cmd.command && <div className="copy-toast">Copied!</div>}
                    <div className="card-header">
                      <h3 className="card-title">{cmd.command}</h3>
                      <span className="badge">{cmd.cost} pts</span>
                    </div>
                    <div className="card-body">
                      {cmd.action}
                    </div>
                  </div>
                ))}
                {filteredCustoms.length === 0 && <p style={{color: 'var(--text-muted)'}}>No custom commands found.</p>}
              </div>
            </div>
          </div>

          {/* Sounds Section */}
          <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleSection('sounds')}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                {collapsed.sounds ? <ChevronRight size={24} style={{marginRight: '8px'}} /> : <ChevronDown size={24} style={{marginRight: '8px'}} />}
                <Volume2 size={24} style={{marginRight: '8px'}}/> Available Playsounds ({filteredSounds.length})
              </h2>
              {!collapsed.sounds && (
                <div className="sort-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                  <label style={{ color: 'var(--text-muted)' }}>Sort by:</label>
                  <select 
                    value={soundSortBy} 
                    onChange={(e) => setSoundSortBy(e.target.value)}
                    style={{ background: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--border-color)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    <option value="date-desc">Date (Newest)</option>
                    <option value="date-asc">Date (Oldest)</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                  </select>
                </div>
              )}
            </div>
            <div className={`section-content ${collapsed.sounds ? 'collapsed' : ''}`}>
              <div className="grid">
                {filteredSounds.map(soundObj => {
                  const sound = soundObj.filename;
                  const soundName = sound.split('.').slice(0, -1).join('.');
                  const commandStr = `!playsound ${soundName}`;
                  return (
                    <div key={sound} className="card sound-card" onClick={() => copyToClipboard(commandStr, sound)}>
                      {copiedId === sound && <div className="copy-toast">Copied!</div>}
                      <button className="play-button" onClick={(e) => { e.stopPropagation(); playSound(sound); }}>
                        {playingSound === sound ? <Pause fill="white" /> : <Play fill="white" />}
                      </button>
                      <div className="sound-info">
                        <p className="sound-name" title={soundName}>{soundName}</p>
                        <p className="sound-command">{commandStr}</p>
                      </div>
                    </div>
                  )
                })}
                {filteredSounds.length === 0 && <p style={{color: 'var(--text-muted)'}}>No sounds found.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
