# Ultimate Flight — Flappy Bird-style browser game

## Run it
1. Extract the ZIP file.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in a modern browser (Chrome is recommended).

## Replace your images
- General/default profile: replace `assets/default-character.png` with your image.
- In `script.js`, update `DEFAULT_PROFILE_IMAGE_URL` if your image has a different name/path.
- Players can also choose Custom Profile and upload their own photo. That photo is used locally in the browser only; it is not sent to a server or permanently stored by this game.

## Replace the six audio files
Create an `assets/audio/` folder and place your audio files there:
- `intro-theme.mp3`
- `profile-selection.mp3`
- `near-miss.mp3`
- `pillar-crossed.mp3`
- `victory.mp3`
- `game-over.mp3`

Alternatively, change the six clearly labelled `*_AUDIO_URL` values near the top of `script.js`.

## Features
- Intro screen and profile selection
- Custom uploaded photo or replaceable default profile image
- 10 pillars to win
- Near-miss, pillar-crossed, victory, and game-over sound events
- Easy, Medium (default), and Hard difficulty
- Pause/resume and mute/unmute
- Circular player avatar crop during gameplay
- Responsive layout for phones and desktop

## Notes
- Browser audio usually starts only after a user gesture. The intro audio is therefore started after the player taps the Start button.
- The six audio URLs are placeholders. Add your own audio files to hear them.
- This is a front-end-only game. No account, server, or database is used.
