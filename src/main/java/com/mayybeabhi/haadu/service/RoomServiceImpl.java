package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.dto.RoomPlayerResponse;
import com.mayybeabhi.haadu.dto.UpdateRoomSettingsRequest;
import com.mayybeabhi.haadu.entity.*;
import com.mayybeabhi.haadu.exception.*;
import com.mayybeabhi.haadu.realtime.GameEvent;
import com.mayybeabhi.haadu.realtime.GameEventPublisher;
import com.mayybeabhi.haadu.realtime.GameEventType;
import com.mayybeabhi.haadu.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.mayybeabhi.haadu.dto.GameStateResponse;
import com.mayybeabhi.haadu.dto.GuessResponse;
import com.mayybeabhi.haadu.dto.PlayerGameStateDto;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class RoomServiceImpl implements RoomService{
    private final RoomRepository roomRepository;
    private final RoomPlayerRepository roomPlayerRepository;
    private final UserRepository userRepository;
    private final SongSubmissionRepository songSubmissionRepository;
    private final RoundRepository roundRepository;
    private final GuessRepository guessRepository;
    private final GameEventPublisher gameEventPublisher;

    public RoomServiceImpl(RoomRepository roomRepository, RoomPlayerRepository roomPlayerRepository,UserRepository userRepository,SongSubmissionRepository songSubmissionRepository,RoundRepository roundRepository,GuessRepository guessRepository,GameEventPublisher gameEventPublisher){
        this.roomRepository=roomRepository;
        this.roomPlayerRepository=roomPlayerRepository;
        this.userRepository=userRepository;
        this.songSubmissionRepository=songSubmissionRepository;
        this.roundRepository=roundRepository;
        this.guessRepository=guessRepository;
        this.gameEventPublisher=gameEventPublisher;
    }

    @Override
    @Transactional
    public Room createRoom(String adminUserId){

        if(!userRepository.existsById(UUID.fromString(adminUserId))){
            throw new UserNotFoundException("User not found!");
        }

        Room room = new Room();

        room.setRoomCode(generateRoomCode());
        room.setAdminUserId(UUID.fromString(adminUserId));
        room.setMaxPlayers(2);
        room.setSongCount(4);
        room.setStatus(RoomStatus.WAITING);
        room.setRoundTimerEnabled(false);
        room.setInBetweenRoundTimerEnabled(false);


        Room savedRoom = roomRepository.save(room);

        RoomPlayer adminPlayer=new RoomPlayer();
        adminPlayer.setRoomId(room.getId());
        adminPlayer.setUserId(UUID.fromString(adminUserId));
        adminPlayer.setScore(0);
        roomPlayerRepository.save(adminPlayer);
        return savedRoom;
    }

    @Override
    public Room getRoomByCode(String roomCode){
        return roomRepository.findByRoomCode(roomCode).orElseThrow(() -> new RoomNotFoundException("Room not found"));
    }

    private String generateRoomCode(){
        return UUID.randomUUID().toString().substring(0,5).toUpperCase();
    }

    @Override
    @Transactional
    public Room joinRoom(String roomCode,String userID){
      Room room = getRoomByCode(roomCode);
      UUID userUUID = UUID.fromString(userID);

      if(!userRepository.existsById(userUUID)){
            throw new UserNotFoundException("User not found!");
      }

      if(roomPlayerRepository.existsByRoomIdAndUserId(room.getId(),userUUID)){
          throw new UserAlreadyInRoomException("User already present in room");
      }
      if (roomPlayerRepository.countByRoomId(room.getId())>=room.getMaxPlayers()){
          throw new RoomFullException("Room full!");
      }

        if (room.getStatus() != RoomStatus.WAITING) {
            throw new IllegalStateException("Cannot join room after game has started");
        }


        RoomPlayer player=new RoomPlayer();
      player.setRoomId(room.getId());
      player.setUserId(userUUID);
      player.setScore(0);

      roomPlayerRepository.save(player);
      
    gameEventPublisher.sendToRoom(roomCode, GameEvent.of(GameEventType.PLAYER_JOINED, Map.of("userId", userID)));
    return room;
    }
    
    @Override
    @Transactional
    public Room updateRoomSettings(String roomCode, UpdateRoomSettingsRequest request){
        Room room= roomRepository.findByRoomCode(roomCode).orElseThrow(() -> new RoomNotFoundException("Invalid room code, room not found"));
        UUID adminUserUUID=UUID.fromString(request.getAdminUserId());

        if(!room.getAdminUserId().equals(adminUserUUID)){
            throw new UserNotAdminException("Only admin of the room can edit settings");
        }

        if (!room.getStatus().equals(RoomStatus.WAITING)){
            throw new InvalidGameStatusException("Cannot update settings after game has started");
        }

        room.setRoundTimerEnabled(request.getIsRoundTimerEnabled());
        if(request.getIsRoundTimerEnabled()){
            if (request.getRoundDuration()==null||request.getRoundDuration()<=0){
                throw new BusinessRuleException("Round duration must be greater than 0");
            }

            room.setRoundTimer(request.getRoundDuration());
        }
        else {
            room.setRoundTimer(0);
        }

        room.setInBetweenRoundTimerEnabled(request.getIsInBetweenRoundTimerEnabled());
        if(request.getIsInBetweenRoundTimerEnabled()){
            if (request.getInBetweenRoundDuration()==null||request.getInBetweenRoundDuration()<=0){
                throw new BusinessRuleException("In Between Round duration must be greater than 0");
            }

            room.setRoundTimer(request.getRoundDuration());
        }
        else {
            room.setRoundTimer(0);
        }

        room.setMaxPlayers(request.getMaxPlayers());
        room.setSongCount(request.getSongCount());



        return roomRepository.save(room);



    }

    @Override
    @Transactional
    public void startGame(String roomCode, String adminUserId){
        Room room=roomRepository.findByRoomCode(roomCode).orElseThrow(()->new RoomNotFoundException("Room not found"));
        UUID adminUUID=UUID.fromString(adminUserId);
        if (!room.getAdminUserId().equals(adminUUID)){
            throw new UserNotAdminException("Only admins can start the game!");
        }

        if(!room.getStatus().equals(RoomStatus.WAITING)){
            throw new InvalidGameStatusException("Invalid game status");
        }

        long roomPlayersCount=roomPlayerRepository.countByRoomId(room.getId());

        if (roomPlayersCount<2){
            throw new InvalidGameStatusException("Not enough players to start the game");
        }

        if(roomPlayersCount*room.getSongCount()!=songSubmissionRepository.countByRoomId(room.getId())){
            throw new InvalidGameStatusException("All users have not submitted the required number of songs");
        }

        room.setStatus(RoomStatus.PLAYING);
        roomRepository.save(room);

        gameEventPublisher.sendToRoom(roomCode,GameEvent.of(GameEventType.GAME_STARTED, Map.of()));
    }

    @Override
    @Transactional
    public void startRound(String roomCode,String adminUserId){
        Room room= roomRepository.findByRoomCode(roomCode).orElseThrow(()->new RoomNotFoundException("Room not found!"));
        UUID adminUUID=UUID.fromString(adminUserId);

        if (!room.getAdminUserId().equals(adminUUID)){
            throw new UserNotAdminException("Only admins can start a round");
        }

        if(!room.getStatus().equals(RoomStatus.PLAYING)){
            throw new InvalidGameStatusException("Game has not started");
        }

        if(roundRepository.existsByRoomIdAndStatus(room.getId(), RoundStatus.PLAYING)){
            throw new InvalidGameStatusException("A round is already active");
        }

        long countRounds=roundRepository.countByRoomId(room.getId());

        if (countRounds>=songSubmissionRepository.countByRoomId(room.getId())){
            throw new InvalidGameStatusException("All rounds have been completed");
        }

        List<SongSubmission> unusedSongs=songSubmissionRepository.findUnusedSongsByRoomId(room.getId());

        if(unusedSongs.isEmpty()){
            throw new InvalidGameStatusException("No songs available");
        }

        SongSubmission selectedSong= unusedSongs.get(new Random().nextInt(unusedSongs.size()));
        int roundNumber= (int)countRounds+1;

        Round round=new Round();

        round.setRoomId(room.getId());
        round.setRoundNumber(roundNumber);
        round.setStatus(RoundStatus.PLAYING);
        round.setSongSubmissionId(selectedSong.getId());
        round.setStartedAt(Instant.now());

        roundRepository.save(round);

        gameEventPublisher.sendToRoom(roomCode, GameEvent.of(
    GameEventType.ROUND_STARTED,
    Map.of(
        "roundNumber", roundNumber,
        "roundId", round.getId(),
        "songId", selectedSong.getId(),
        "youtubeUrl", selectedSong.getYoutubeUrl()
    )
));
  }

    @Override
    @Transactional
    public void endRound(String roomCode, String adminUserId, String roundId){

        Room room= roomRepository.findByRoomCode(roomCode).orElseThrow(()->new RoomNotFoundException("Room not found!"));
        UUID adminUUID=UUID.fromString(adminUserId);

        if (!room.getAdminUserId().equals(adminUUID)){
            throw new UserNotAdminException("Only admins can end a round");
        }

        if(!room.getStatus().equals(RoomStatus.PLAYING)){
            throw new InvalidGameStatusException("Game is not active");
        }

        Round round= roundRepository.findById(UUID.fromString(roundId)).orElseThrow(()-> new RoundNotFoundException("Round not found"));

        if(!round.getRoomId().equals(room.getId())){
            throw new InvalidGameStatusException("Round does not belong to the room");
        }

        if(!round.getStatus().equals(RoundStatus.PLAYING)){
            throw new InvalidGameStatusException("Round already closed");
        }

        if(roomPlayerRepository.countByRoomId(room.getId())!=guessRepository.countByRoundId(round.getId())){
            throw new BusinessRuleException("Everyone has not yet guessed");
        }

        SongSubmission song=songSubmissionRepository.findById(round.getSongSubmissionId()).orElseThrow(()->new InvalidGameStatusException("Song submission missing"));

        UUID rightUserId=song.getUserId();

        round.setStatus(RoundStatus.REVEALED);
        round.setEndedAt(Instant.now());
        roundRepository.save(round);

        gameEventPublisher.sendToRoom(roomCode, GameEvent.of(GameEventType.ROUND_CLOSED,Map.of("correctUserId",rightUserId)));
    }

    @Override
    @Transactional
    public void endGame(String roomCode, String adminUserId) {

        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("Room not found"));

        UUID adminUUID = UUID.fromString(adminUserId);

        if (!room.getAdminUserId().equals(adminUUID)) {
            throw new UserNotAdminException("Only admin can finish the game");
        }

        if (room.getStatus() != RoomStatus.PLAYING) {
            throw new InvalidGameStatusException("Game is not in progress");
        }


        boolean activeRoundExists =
                roundRepository.existsByRoomIdAndStatus(room.getId(), RoundStatus.PLAYING);

        if (activeRoundExists) {
            throw new InvalidGameStatusException("Cannot finish while a round is active");
        }

        long completedRounds = roundRepository.countByRoomId(room.getId());

        if (completedRounds < songSubmissionRepository.countByRoomId(room.getId())) {
            throw new InvalidGameStatusException("Not all rounds are completed");
        }

        room.setStatus(RoomStatus.FINISHED);
        roomRepository.save(room);
    }

    @Override
    public List<RoomPlayerResponse> getPlayers(String roomCode){

        Room room=roomRepository.findByRoomCode(roomCode).orElseThrow(()->new RoomNotFoundException("Room not found"));
        List<RoomPlayer> players= roomPlayerRepository.findByRoomId(room.getId());
        return players.stream().map(p->{
            User user= userRepository.findById(p.getUserId()).orElseThrow(()->new UserNotFoundException("User not found"));
            long songsSubmitted= songSubmissionRepository.countByRoomIdAndUserId(room.getId(), user.getId());
            return new RoomPlayerResponse(user.getId(),user.getUsername(),room.getAdminUserId().equals(user.getId()),songsSubmitted);

        }).toList();
    }

    @Override
@Transactional
public GameStateResponse getRoomState(String roomCode) {
    Room room = roomRepository.findByRoomCode(roomCode)
            .orElseThrow(() -> new RoomNotFoundException("Room not found"));

    UUID roomId = room.getId();

    List<RoomPlayer> roomPlayers = roomPlayerRepository.findByRoomId(roomId);

    Optional<Round> activeRoundOpt = roundRepository.findByRoomIdAndStatus(roomId, RoundStatus.PLAYING);
    Optional<Round> latestRoundOpt = roundRepository.findTopByRoomIdOrderByRoundNumberDesc(roomId);

    Optional<Round> currentRoundOpt = activeRoundOpt.isPresent() ? activeRoundOpt : latestRoundOpt;

Round currentRound = currentRoundOpt.orElse(null);

List<Guess> guesses = currentRoundOpt
        .map(round -> guessRepository.findByRoundId(round.getId()))
        .orElseGet(Collections::emptyList);

    Map<UUID, Guess> guessByUserId = new HashMap<>();
    for (Guess guess : guesses) {
        guessByUserId.put(guess.getGuessingUserId(), guess);
    }

    List<PlayerGameStateDto> playerDtos = roomPlayers.stream().map(rp -> {
        UUID userId = rp.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Guess guess = guessByUserId.get(userId);
        long songsSubmitted = songSubmissionRepository.countByRoomIdAndUserId(roomId, userId);

        return PlayerGameStateDto.builder()
                .userId(userId)
                .username(user.getUsername())
                .isAdmin(room.getAdminUserId().equals(userId))
                .songsSubmitted((int) songsSubmitted)
                .guessSubmitted(guess != null)
                .guessTargetUserId(guess != null ? guess.getGuessedUserId() : null)
                .build();
    }).toList();

    List<GuessResponse> guessDtos = guesses.stream().map(g ->
            new GuessResponse(g.getGuessingUserId(), g.getGuessedUserId())
    ).toList();

    return buildGameStateResponse(room, currentRound, playerDtos, guessDtos);
}

private GameStateResponse buildGameStateResponse(
        Room room,
        Round currentRound,
        List<PlayerGameStateDto> playerDtos,
        List<GuessResponse> guessDtos
) {
    String phase = determinePhase(room, currentRound);

    UUID songId = null;
    String currentSongUrl = null;
    UUID revealedOwnerId = null;
    Integer roundNumber = null;
    UUID currentRoundId = null;
    String roundStatus = null;

    if (currentRound != null) {
        roundNumber = currentRound.getRoundNumber();
        currentRoundId = currentRound.getId();
        roundStatus = currentRound.getStatus().name();

        if (currentRound.getSongSubmissionId() != null) {
            SongSubmission songSubmission = songSubmissionRepository
                    .findById(currentRound.getSongSubmissionId())
                    .orElse(null);

            if (songSubmission != null) {
                songId = songSubmission.getId();
                currentSongUrl = songSubmission.getYoutubeUrl();

                // anti-cheat: only reveal owner after round is revealed
                if (currentRound.getStatus() == RoundStatus.REVEALED) {
                    revealedOwnerId = songSubmission.getUserId();
                }
            }
        }
    }

    return GameStateResponse.builder()
            .roomCode(room.getRoomCode())
            .roomStatus(room.getStatus().name())
            .phase(phase)

            .roundNumber(roundNumber)
            .currentRoundId(currentRoundId)
            .roundStatus(roundStatus)

            .songId(songId)
            .currentSongUrl(currentSongUrl)
            .revealedOwnerId(revealedOwnerId)

            .maxPlayers(room.getMaxPlayers())
            .songCount(room.getSongCount())

            .breakTimeEnabled(room.isInBetweenRoundTimerEnabled())
            .breakTimeSeconds(room.getInBetweenRoundTimer())

            .roundTimeEnabled(room.isRoundTimerEnabled())
            .roundTimeSeconds(room.getRoundTimer())

            .players(playerDtos)
            .guesses(guessDtos)
            .build();
}

private String determinePhase(Room room, Round currentRound) {
    if (room.getStatus() == RoomStatus.FINISHED) {
        return "FINISHED";
    }

    if (room.getStatus() == RoomStatus.WAITING) {
        return "LOBBY";
    }

    if (currentRound == null) {
        return "WAITING_ROUND";
    }

    return switch (currentRound.getStatus()) {
        case SUBMISSION -> "WAITING_ROUND";
        case PLAYING -> "PLAYING";
        case GUESSING -> "PLAYING";
        case REVEALED -> "REVEALED";
    };
}

}
