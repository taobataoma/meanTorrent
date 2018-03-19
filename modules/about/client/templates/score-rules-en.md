### :orange_book: User Score Rules Detail - %(appConfig.name)s

**%(appConfig.name)s** provide a <mark>user level</mark> system, there are many ways for users to earn scores, and scores are also very useful. The user's scores are also the basis for calculating the user's level. Different user's levels correspond to different access rights. [user level rules detail can be viewed here](/about/manual/userLevelRules).

&emsp;

#### :white_small_square: Score increase rules
* Check-in every day to get `%(scoreConfig.action.checkInEveryDay.value)d` scores, continuous check-in to get additional `%(scoreConfig.action.checkInConsDay.value)d` scores per day.
* Upload a torrent resource to get `%(scoreConfig.action.uploadTorrent.value)d` scores.
* The uploaded torrent resource is set as a recommendation by the administrator to get `%(scoreConfig.action.uploadTorrentBeRecommend.value)d` scores.
* Upload a resource subtitle to get `%(scoreConfig.action.uploadSubtitle.value)d` scores.
* The uploaded resources receive every thumb up to get `%(scoreConfig.action.thumbsUpScoreOfTorrentTo.value)d` scores.
* The posted forum topic or reply receive every thumbs up to get `%(scoreConfig.action.thumbsUpScoreOfTopicTo.value)d` scores.
* Response to the user's request and accepted by the requester, to get the requester's reward points.
* When the client software announce the upload or download amount, it will get the corresponding scores. <mark>and the bigger the torrent size, the more the scores will be, Torrent size less than %(scoreConfig.action.seedUpDownload.additionSize_str)s no extra addition</mark>.
  <span class="text-danger">**NOTE: The system calculates the points based on the actual upload and download amount.**</span>
```javascript
  Torrent size addition ratio: sqrt(torrent_size / %(scoreConfig.action.seedUpDownload.additionSize_str)s).
  Uploaded per %(scoreConfig.action.seedUpDownload.perlSize_str)s: %(scoreConfig.action.seedUpDownload.uploadValue)d scores.
  Downloaded per %(scoreConfig.action.seedUpDownload.perlSize_str)s: %(scoreConfig.action.seedUpDownload.downloadValue)d scores.
  Vip user extra adition: ratio of %(scoreConfig.action.seedUpDownload.vipRatio).2f

  Examples: 
    for 40G torrent, the size addition ratio is 2, announce uploaded 10G and downloaded 15G,
    none vip user get uploaded scores: 2 * 2 * 10 = 40, downloaded scores: 2 * 1 * 15 = 30. 
    vip user get uploaded scores: 40 * 1.5 = 60, downloaded scores: 30 * 1.5 = 45.
```
* In the seeding state, the seeding scores will be get from the seeding time. 
For every seed, `%(scoreConfig.action.seedTimed.timedValue)d` scores per `%(scoreConfig.action.seedTimed.additionTime_str)s`, vip user extra addition ratio is `%(scoreConfig.action.seedTimed.vipRatio).2f`.
* Scores got for the above two items, will get extra addition based on the seed life and seeding users, <mark>And two kinds of addition are available at the same time</mark>.
```javascript
  With seeding user:
  ==================
  Coefficient is: %(scoreConfig.action.seedSeederAndLife.seederCoefficient).2f
  Seecer count less than: %(scoreConfig.action.seedSeederAndLife.seederCount)d
  
  For 1 seeding user, the extra addition ratio is: 6, [for 2 is 5.5], [for 3 is 5], [for 4 is 4.5], [for 5 is 4], [for 6 is 3.5], [for 7 is 3], [for 8 is 2.5], [for 9 is 2], [for 10 is 1.5], [more than 10 is 1, same as no extra addition].
```
```javascript
  With seed life:
  ===============
  Coefficient is: %(scoreConfig.action.seedSeederAndLife.lifeCoefficientOfDay).3f
  Max ratio is: %(scoreConfig.action.seedSeederAndLife.lifeMaxRatio).2f
  
  The basic ratio is 1, increase %(scoreConfig.action.seedSeederAndLife.lifeCoefficientOfDay).3f every day.
  For 10 days life ratio is 1.05, [100 days is 1.5], [200 days is 2.0] etc, the max ratio is %(scoreConfig.action.seedSeederAndLife.lifeMaxRatio).2f.
```

&emsp;

#### :white_small_square: Score deduction rules
* Reactivate a long unused user account, account status changed from <mark>inactive</mark> to <mark>normal</mark>, deducted `%(signConfig.activeIdleAccountScore)d` scores.
* Exchange an invitation, need to deduct `%(inviteConfig.scoreExchange)d` scores.
* Each time a user post a request, the system will automatically reclaim `%(requestsConfig.scoreForAddRequest)d` scores. If the request is answered and accepted by the requester, the system will automatically deduct the scores the requester rewards.
* Remove an H&R warning, need to deduct `%(hnrConfig.scoreToRemoveWarning)d` scores.
* Uploaded torrent resource was deleted to `%(scoreConfig.action.uploadTorrentBeDeleted.value)d` scores.
* Uploaded resource subtitle was deleted to `%(scoreConfig.action.uploadSubtitleBeDeleted.value)d` scores.
* Thumbs up for torrent resource to `%(scoreConfig.action.thumbsUpScoreOfTorrentFrom.value)d` scores.
* Thumbs up for forum topic or reply to `%(scoreConfig.action.thumbsUpScoreOfTopicFrom.value)d` scores.