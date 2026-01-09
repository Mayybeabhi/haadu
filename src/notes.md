1.PostgreSQL ENUM persistence failure

    Problem:
    Room creation failed due to enum persistence error.

    Root Cause:
    Hibernate binds Java enums as VARCHAR by default, while PostgreSQL requires explicit enum type binding.

    Resolution:
    Used @JdbcType(PostgreSQLEnumJdbcType.class) along with @Enumerated(EnumType.STRING).

    Outcome:
    Enabled type-safe enum persistence without compromising database constraints.
