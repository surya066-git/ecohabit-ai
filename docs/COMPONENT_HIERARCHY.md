# Component Hierarchy

```text
RootLayout
└── AuthProvider
    ├── AuthForm
    └── AppShell
        ├── AuthGuard
        ├── DashboardClient
        │   ├── EcoScoreCard
        │   ├── CarbonTrendChart
        │   ├── CategoryBreakdownChart
        │   ├── GoalProgress
        │   ├── HabitSummary
        │   ├── RecommendationPanel
        │   └── BadgeShelf
        ├── CarbonCalculatorForm
        ├── HabitTracker
        ├── GoalTracker
        ├── ReportsClient
        └── AchievementsClient
```

## UI Primitives

ShadCN-style primitives live in `apps/web/src/components/ui`:

- `Button`
- `Card`
- `Input`
- `Label`
- `Select`
- `Textarea`
- `Badge`
- `Progress`
- `Skeleton`

These primitives keep spacing, focus states, border radius, and color behavior consistent across the product.
