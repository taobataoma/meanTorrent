### :orange_book: H&R Rules Detail - %(appConfig.name)s
---
**%(appConfig.name)s** provide a complete <mark>H&R</mark> system, The torrent with the <mark>H&R</mark> tag is also called the black torrent. When the user downloads the black torrent, it must follow certain special requirements. If the operation is improper, you will receive a warning or can not download and upload any resources. The rules of <mark>H&R</mark> are as follows:

&emsp;

1. The current <mark>H&R</mark> function enable status is：
```javascript
hnrConfig.enable = %(hnrConfig.enable)s
```
1. Administrators can add or cancel `H&R` attributes to any seed at any time.
1. Black torrent after the download is complete, you can't stop uploading immediately, must meet the following conditions can be either:
  * Upload time to `%(hnrConfig.condition.seedTime_str)s`.
  * Upload/Download ratio to `%(hnrConfig.condition.ratio).2f`.
1. The system refreshes the user's H&R warnings every `%(announceConfig.warningCheck.userHnrWarningCheckInterval_str)s` hours or when the user reports the data, and every downloading record that has not reached the above conditions will receive a warning and send a warning message to the user at the same time.
1. When you receive a warning, if the seed is still uploaded, you don't pay attention to it. When the above condition is reached, the warning will automatically disappear and send a warning message that the warning is disappearing at the same time. If you stop uploading, you can reopen and start uploading until the above conditions are fulfilled, and the warning will disappear automatically.
1. When you receive 3 warnings, you will not be able to download and upload any resources except the warning torrent itself. At this point, you can only wait for the warning to disappear before you can continue to download or upload.
1. You can also use your points to eliminate warnings. The current system setting requires `%(hnrConfig.scoreToRemoveWarning).2f` points to eliminate a warning.
1. The number of current warning statistics will be prompted in your account menu, while there is a more detailed warning list in the [account status](/status/account) page. Please pay more attention to it.