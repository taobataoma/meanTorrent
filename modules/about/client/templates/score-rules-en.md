### :orange_book: User Score Rules Detail - %(appConfig.name)s

%(appConfig.name)s provide a `user level` system, there are many ways for users to earn scores, and scores are also very useful. The user's scores are also the basis for calculating the user's level. Different user's levels correspond to different access rights. [Details of the user's level details can be viewed here](/about/manual/userLevelRules).

&emsp;

#### :white_small_square: Score increase rules
* Check-in every day to get `%(scoreConfig.action.checkInEveryDay.value)d` scores, continuous check-in to get additional `%(scoreConfig.action.checkInConsDay.value)d` scores per day.
* Upload a torrent resource to get `%(scoreConfig.action.uploadTorrent.value)d` scores.
* The uploaded torrent resource is set as a recommendation by the administrator to get `%(scoreConfig.action.uploadTorrentBeRecommend.value)d` scores.
* Upload a resource subtitle to get `%(scoreConfig.action.uploadSubtitle.value)d` scores.
* The uploaded resources receive every thumb up to get `%(scoreConfig.action.thumbsUpScoreOfTorrentTo.value)d` scores.
* The posted forum topic or reply receive every thumbs up to get `%(scoreConfig.action.thumbsUpScoreOfTopicTo.value)d` scores.

* Response to the user's request and accepted by the requester, to get the requester's reward points.

&emsp;

#### :white_small_square: Score deduction rules
* Reactivate a long unused user account, account status changed from **inactive** to **normal**, deducted `%(signConfig.activeIdleAccountScore)d` scores.
* Exchange an invitation, need to deduct `%(inviteConfig.scoreExchange)d` scores.
* Each time a user post a request, the system will automatically reclaim `%(requestsConfig.scoreForAddRequest)d` scores. If the request is answered and accepted by the requester, the system will automatically deduct the scores the requester rewards.
* Remove an H&R warning, need to deduct `%(hnrConfig.scoreToRemoveWarning)d` scores.
* Uploaded torrent resource was deleted to `%(scoreConfig.action.uploadTorrentBeDeleted.value)d` scores.
* Uploaded resource subtitle was deleted to `%(scoreConfig.action.uploadSubtitleBeDeleted.value)d` scores.
* Thumbs up for torrent resource to `%(scoreConfig.action.thumbsUpScoreOfTorrentFrom.value)d` scores.
* Thumbs up for forum topic or reply to `%(scoreConfig.action.thumbsUpScoreOfTopicFrom.value)d` scores.

&emsp;

#### :white_small_square: Prohibited behavior

&emsp;

#### :white_small_square: Penalties for violation