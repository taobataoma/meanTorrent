### :orange_book: Download Rules Detail - %(appConfig.name)s
---
**%(appConfig.name)s** is a platform for free sharing of resources. Please adhere to the following rules in the process of uploading or downloading. Otherwise, it may be severely punished by the management team and even the account is prohibited.

&emsp;

#### :white_small_square: Upload and download

1. The system has a share rate requirement for all download behaviors. The current requirement is `%(announceConfig.downloadCheck.ratio).2f`, so after you publish, extend the time for seeding as much as possible to earn as much upload volume and scores.
1. The system does not check the sharing rate for users who have newly registered `%(announceConfig.downloadCheck.checkAfterSignupDays)d` days. Therefore, new users should increase their sharing rate as much as possible during this time.
1. Don’t stop seeding without anyone finished download. If you have special circumstances, please leave a message under the relevant torrent detail page.
1. If you are downloading H&R torrent，please read the [H&R rules detail](/about/manual/hnrRules) carefully and deal with the H&R warning in time.
1. Each user can simultaneously upload at most `%(announceConfig.announceCheck.maxLeechNumberPerUserPerTorrent)d` downloads and `%(announceConfig.announceCheck.maxSeedNumberPerUserPerTorrent)d` uploads for per torrent.
1. The system may be turned on at some time to do a kind of qualification check, that is, it is not allowed to preserve seeds that are not downloaded by this station. The current setting values are:
```javascript
  announce.seedingInFinishedCheck = %(announceConfig.seedingInFinishedCheck)s
```
1. To reduce the occurrence of errors and ensure that the data is counted correctly, stop all seed uploads or downloads when exiting the client.

&emsp;

#### :white_small_square: Data calculation and scores count

1. Seed uploaders calculate the upload volume of `* %(salesGlobalConfig.uploader.value.Ur).2f`, and calculate the upload scores of `* %(scoreConfig.action.seedUpDownload.uploaderRatio).2f`.
1. Other users calculate the normal upload and download amount.
1. All users of all the seed upload and download volume enjoy promotion bonus, in case of global promotion, they enjoy the overall promotion bonus.
1. VIP users can enjoy additional bonuses for uploading and downloading as well as seeding scores. For details, please refer to [VIP Rights Rules Detail](/about/manual/vipRules)。
1. For seeding with fewer users ( < `%(scoreConfig.action.seedSeederAndLife.seederCount)d` users ）, additional bonus scores are awarded.
1. More scores bonuses are available for seeding that have been published for longer.
1. More scores bonuses are available for seeding that larger size torrent resources.
1. More scores rules please refer to [User Score Rules Detail](/about/manual/scoreRules)。

&emsp;

#### :white_small_square: Auto download

1. %(appConfig.name)s supports RSS subscription downloads. On the torrents list page, the system has automatically generated an RSS subscription address based on your search criteria. You can copy this address and use it directly on the client.
1. If you need to subscribe to more than one type of resource, you need to copy more than one address to your client.
1. %(appConfig.name)s support IRC subscription download, if your client supports IRC subscription, please set it yourself according to the following configuration：
```javascript
  ircAnnounce.server = %(ircAnnounceConfig.server)s
  ircAnnounce.port = %(ircAnnounceConfig.port)s
  ircAnnounce.channel = %(ircAnnounceConfig.channel)s
  ircAnnounce.anncounceNick = %(ircAnnounceConfig.nick)s
```

&emsp;

#### :white_small_square: Client limit

* %(appConfig.name)s prohibits specific client software access, click here to view [Client black list](/about/black)。

&emsp;

#### :white_small_square: Malicious behavior and punishment

1. Use disallowed clients or use disallowed access methods for uploading or downloading.
1. Use third-party tools to tamper with reporting data.
1. Other abnormal behaviors upload or download.

&emsp;

<span class="text-danger">** NOTE: Once your behavior is defined as malicious behavior, you may be subject to very severe penalties. Please visit the [Forbid And Punish Rules Detail](/about/manual/forbidRules)**</span>