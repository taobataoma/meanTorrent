### USER SCORE rules detail - %(appConfig.name)s
---
%(appConfig.name)s provide a **user level** system, there are many ways for users to earn scores, and scores are also very useful. The user's scores are also the basis for calculating the user's level. Different user's levels correspond to different access rights. [Details of the user's level details can be viewed here](/about/manual/userLevelRules).

&emsp;

#### Score increase rules
* Check-in every day to get `%(scoreConfig.checkInEveryDay)d` scores, continuous check-in to get additional `%(scoreConfig.checkInConsday)d` scores per day.

&emsp;

#### Score deduction rules
* Reactivate a long unused user account, account status changed from **inactive** to **normal**, deducted `%(signConfig.activeIdleAccountScore)d` scores.
* Exchange an invitation, need to deduct `%(inviteConfig.scoreExchange)d` scores.
* Each time a user post a request, the system will automatically reclaim `%(requestsConfig.scoreForAddRequest)d` scores. If the request is answered and accepted by the requester, the system will automatically deduct the scores the requester rewards.
* Remove an H&R warning, need to deduct `%(hnrConfig.scoreToRemoveWarning)d` scores.

&emsp;

#### Prohibited behavior

&emsp;

#### Penalties for violation