### :orange_book: User Level Rules Detail - %(appConfig.name)s
---
%(appConfig.name)s provide a `user level` system, use\`s level is calculation from user\`s score, different level corresponding to different access rights, the only way to improve your level is to increase your score as much as possible.

&emsp;

#### How to calculate the level?
1. User score level calculation formula is: `sqrt(score number / %(scoreConfig.levelStep)s)`.
1. Level`1` score is: `1 * 1 * %(scoreConfig.levelStep)s`.
1. Level`2` score is: `2 * 2 * %(scoreConfig.levelStep)s`.
1. Level`3` score is: `3 * 3 * %(scoreConfig.levelStep)s`.
1. Level`4` score is: `4 * 4 * %(scoreConfig.levelStep)s`.
1. Level`x` score is: `x * x * %(scoreConfig.levelStep)s`.

&emsp;

#### How to use the level?
_The management group is making relevant level rights and interests, please keep the attention, thank you!_
