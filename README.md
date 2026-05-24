# Twitch Bot Overlay Dashboard

This is a Single-Page Application (SPA) built with React and Vite. It serves as the public-facing command dashboard for my custom Twitch Overlay Bot.

## How It Works

The Twitch bot runs on a Node.js backend with an SQLite database and is hosted on **Railway**. It handles Twitch Chat events, custom commands, economy points, and real-time OBS overlays.

This dashboard connects directly to the Railway backend API to dynamically pull and display:
- **Built-in Commands:** Things like `!duel`, `!gamble`, `!chatwar`, etc. (along with their costs and cooldowns).
- **Custom Commands:** Viewer-created commands and chat text copypastas.
- **Playsounds:** A library of hundreds of audio files that viewers can trigger on the stream using `!playsound <sound_name>`. The dashboard includes a built-in audio player so users can preview these sounds directly in the browser!

## Deployment (Vercel)

This frontend is designed to be hosted on Vercel. 

**Environment Variables:**
In Vercel, make sure to add the following Environment Variable so it knows where to fetch the bot's data from:
- `VITE_API_URL` = `https://your-app.up.railway.app`

## Running Locally

To run this dashboard locally during development:
1. Ensure your local bot backend is running on `localhost:7777`.
2. Create a `.env` file in this directory with: `VITE_API_URL=http://localhost:7777`
3. Run `npm install`
4. Run `npm run dev`
