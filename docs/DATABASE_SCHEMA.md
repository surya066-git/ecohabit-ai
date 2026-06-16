# Database Schema

MongoDB Atlas stores user-owned documents keyed by `firebaseUid`. Each collection has user-scoped indexes to keep reads fast and prevent cross-user access.

## UserProfile

- `firebaseUid` unique indexed string
- `email`, `displayName`, `photoUrl`
- `ecoScore` number 0-100
- `longestStreakDays`
- `preferences.householdSize`
- `preferences.monthlyCarbonBudgetKg`
- `preferences.primaryMotivation`
- `preferences.city`, `preferences.country`
- `onboardingCompletedAt`

## FootprintEntry

- `firebaseUid`
- `periodStart`, `periodEnd`
- `input`: original calculator input
- `breakdown.transportation`
- `breakdown.homeEnergy`
- `breakdown.food`
- `breakdown.shopping`
- `breakdown.waste`
- `breakdown.totalKgCo2e`

Indexes: `{ firebaseUid: 1, periodStart: -1 }`

## Habit

- `firebaseUid`
- `title`, `description`
- `category`: transportation, homeEnergy, food, shopping, waste
- `frequency`: daily, weekly
- `targetCount`
- `estimatedImpactKgCo2e`
- `archivedAt`
- `logs[]`: `completedAt`, `count`, `impactKgCo2e`, `notes`

Indexes: `{ firebaseUid: 1, archivedAt: 1 }`

## Goal

- `firebaseUid`
- `title`, `category`
- `baselineKgCo2e`
- `currentKgCo2e`
- `targetKgCo2e`
- `status`: active, completed, paused, missed
- `startDate`, `targetDate`

Indexes: `{ firebaseUid: 1, status: 1 }`

## Recommendation

- `firebaseUid`
- `title`, `rationale`
- `actionSteps[]`
- `category`
- `expectedImpactKgCo2e`
- `difficulty`: easy, medium, hard
- `source`: ai, system
- `acceptedAt`, `dismissedAt`

Indexes: `{ firebaseUid: 1, createdAt: -1 }`

## Report

- `firebaseUid`
- `period`: weekly, monthly
- `periodStart`, `periodEnd`
- `totalKgCo2e`
- `avoidedKgCo2e`
- `categoryBreakdown`
- `insight`
- `ecoScore`

Indexes: `{ firebaseUid: 1, period: 1, periodStart: -1 }`

## Achievement

- `firebaseUid`
- `key`
- `title`
- `description`
- `tier`: bronze, silver, gold, platinum
- `unlockedAt`

Indexes: unique `{ firebaseUid: 1, key: 1 }`
