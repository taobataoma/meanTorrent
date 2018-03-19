### :orange_book: User Level Rules Detail - %(appConfig.name)s
---
**%(appConfig.name)s** provide a <mark>user level</mark> system, user\`s level is calculation from <mark>user score</mark>, different level corresponding to different access rights, the only way to improve your level is to increase your score as much as possible.

&emsp;

#### :white_small_square: How to calculate the level?
1. User score level calculation formula is: `sqrt(score number / %(scoreConfig.levelStep)s)`.
1. Level`1` score is: `1 * 1 * %(scoreConfig.levelStep)s`.
1. Level`2` score is: `2 * 2 * %(scoreConfig.levelStep)s`.
1. Level`3` score is: `3 * 3 * %(scoreConfig.levelStep)s`.
1. Level`4` score is: `4 * 4 * %(scoreConfig.levelStep)s`.
1. Level`x` score is: `x * x * %(scoreConfig.levelStep)s`.

&emsp;

#### :white_small_square: How to use the level?
_The management group is making relevant level rights and interests, please keep the attention, thank you!_
