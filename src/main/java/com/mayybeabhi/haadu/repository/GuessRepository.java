package com.mayybeabhi.haadu.repository;

import com.mayybeabhi.haadu.entity.Guess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GuessRepository extends JpaRepository<Guess, UUID> {
    boolean existsByRoundIdAndGuessingUserId(UUID roundId,UUID guessingUserId);
    long countByRoundId(UUID roundId);
}
