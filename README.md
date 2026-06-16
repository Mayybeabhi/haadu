### Play now: [haadu.in](https://haadu.in)

# Haadu - Multiplayer Song Guessing Game

## The Story Behind Haadu

Haadu started from a game my friends and I used to play manually whenever we met online.

The idea was simple: everyone would submit a few songs, and the group would try to guess who submitted each one.

The process, however, was surprisingly complicated.

1. Everyone collected YouTube song links.
2. Songs were submitted through a Google Form.
3. One friend copied all submissions into an Excel sheet.
4. The links were pasted into a random wheel picker.
5. A song was selected randomly.
6. The selected YouTube link was opened in Chrome.
7. Everyone guessed who submitted it.
8. Scores were calculated manually in Excel.
9. The process was repeated for every round.

Although the game itself was fun, managing the game was not.

There was always someone acting as the game moderator, manually shuffling songs, opening links, tracking scores, checking answers, and maintaining fairness.

I wanted to remove all the manual work and make the entire experience feel like a real multiplayer game.

That became Haadu.

---

# What is Haadu?

Haadu is a real-time multiplayer song guessing game where players submit songs and try to identify who submitted each song.

The application automates everything that was previously handled manually:

* Song collection
* Random song selection
* Guess collection
* Score calculation
* Round history
* Result tracking
* Winner announcement

---

# How The Game Works

## Step 1 - Guest Login

Currently Haadu supports Guest Mode.

Players simply enter a username and immediately receive a JWT token.

No signup process is required.

The token is stored on the client and used to authenticate all future API requests.

This allows users to quickly join and play without creating accounts.

Future versions will support registered users, profiles, statistics, and friend systems.

---

## Step 2 - Create or Join a Room

A player can either:

* Create a room
* Join an existing room

When a room is created:

* A unique room code is generated
* The creator becomes the room administrator

The administrator can configure:

* Maximum number of players
* Number of songs each player must submit

Example:

If:

* Max Players = 5
* Songs Per Player = 3

The game will contain:

15 songs total

before gameplay can begin.

Friends join using the generated room code.

---

## Step 3 - Song Submission

Each player submits YouTube URLs.

The system validates submissions and prevents duplicate URLs from being submitted.

Players can also edit their songs before the game starts.

This ensures:

* No duplicate songs
* Fair gameplay
* Better user experience

The administrator cannot start the game until every player has submitted all required songs.

This guarantees that every player contributes equally.

---

## Step 4 - Starting The Game

Once all required songs are submitted:

The administrator starts the game.

The backend:

1. Collects all submitted songs
2. Randomizes the order
3. Creates game rounds
4. Stores round state in the database

This guarantees that song order is unpredictable and fair.

---

## Step 5 - Playing Songs

Instead of redirecting users to YouTube, Haadu embeds the video directly into the game interface.

The backend sends the selected YouTube URL to all connected players.

The frontend extracts the YouTube video ID and generates an embedded player.

Example:

Input:

https://www.youtube.com/watch?v=xyz

Embedded Player:

https://www.youtube.com/embed/xyz

This allows all players to stay inside the game without constantly switching tabs.

The video is displayed using an iframe and starts automatically when the round begins.

---

## Step 6 - Real-Time Multiplayer Using WebSockets

One of the biggest challenges was keeping every player synchronized.

Initially, users had to refresh their page to see updates.

This created a poor multiplayer experience.

To solve this problem I implemented WebSockets using:

* Spring WebSocket
* STOMP Protocol
* SockJS
* React Client

Whenever something important happens:

* Player joins room
* Song submitted
* Round started
* Guess submitted
* Round revealed
* Score updated

the backend publishes an event.

The event is immediately pushed to every connected client.

This means:

* No polling
* No page refreshes
* Instant updates

All players always see the same game state in real time.

---

# Guessing Phase

When a song is playing:

Every player sees a list of participants.

Players select the person they believe submitted the song.

The owner of the song remains hidden until the round is revealed.

All guesses are stored in the database.

Once every player has submitted a guess:

The administrator can reveal the answer.

---

# Scoring System

Haadu supports two scoring modes.

## Guesser Mode

Players earn points for correctly identifying the song owner.

This rewards musical knowledge and understanding of friends' tastes.

---

## Owner Mode

The song owner earns points whenever other players fail to identify them.

This rewards choosing songs that are difficult to associate with yourself.

This creates a completely different style of gameplay and strategy.

---

# Round History

Every completed round is recorded.

Players can review:

* Song played
* Actual owner
* Every player's guess
* Correct and incorrect answers

This creates transparency and allows players to analyze previous rounds.

---

# Excel Export

One feature inspired directly by our original manual process was Excel export.

Originally we tracked everything inside spreadsheets.

Haadu can now automatically generate an Excel file containing:

* Round information
* Song owner
* Player guesses
* Correctness of guesses

This provides a permanent record of every game session.

---

# Security

Haadu uses JWT authentication.

When a guest user is created:

1. Backend generates a JWT token
2. Token is returned to the frontend
3. Frontend stores the token
4. Token is attached to every API request

Spring Security validates the token before allowing access to protected endpoints.

This prevents unauthorized access to game rooms and actions.

---

# Backend Architecture

The backend follows a layered architecture:

Controller Layer
→ Handles HTTP Requests

Service Layer
→ Business Logic

Repository Layer
→ Database Access

Entity Layer
→ Persistence Models

DTO Layer
→ Request and Response Contracts

This separation keeps the application maintainable and scalable.

---

# Technology Stack

## Backend

* Java 17
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* PostgreSQL
* Spring WebSocket
* STOMP
* SockJS

## Frontend

* React
* Vite
* Axios
* React Router
* STOMP Client

## Database

* PostgreSQL (Supabase)

---
### Deployment

- Vercel (Frontend)
- Railway / Render / VPS (Backend)
- Supabase PostgreSQL

# Future Enhancements

* User Accounts
* Player Profiles
* Match History
* AI Insights

---

# Conclusion

Haadu transformed a game that required Google Forms, Excel sheets, browser tabs, and manual scorekeeping into a fully automated real-time multiplayer experience.

What began as a fun activity among friends became a full-stack application focused on real-time communication, scalable backend design, secure authentication, and multiplayer game synchronization.

## Try It Yourself

The application is currently live and publicly accessible.

### Live URL

https://haadu.in

### Quick Start

1. Open https://haadu.in
2. Enter a guest username
3. Create a room
4. Share the room code with friends
5. Submit songs
6. Start playing
