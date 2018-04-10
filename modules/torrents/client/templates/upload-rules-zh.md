1. 这是一个私有种子管理系统, 种子文件的Announce地址会自动设置为: `%(announceConfig.url)s`.
1. 当您创建一个种子文件时, 种子创建工具中的Announce地址则应该为: `%(announceConfig.url)s/%(user.passkey)s`, 请不要把这个地址分享其它用户以避免泄露您的passkey，每个用户都有自已的passkey.
1. 如果您选择的资源类型为`电影`或`电视剧`, 种子文件的 TMDB_ID 必须是 `TheMovieDB` 相对应的资源ID号, 您可以[从这里找到ID号](%(tmdbConfig.tmdbHome)s). 系统会自动载入资源的详细信息, 如无误可直接提交.
1. 请为资源选择匹配的一个或多个标签, 它会在您的搜索结果中发挥重大作用.
1. 种子文件提交后, 可能会由后台管理人员进行审批, 不符合规则的种子会被直接删除.
1. 如需其它帮助, 请向{{'%(supportConfig.supportGroupNameDesc)s' | translate}}发送 **[消息](/messages/send?to=%(supportConfig.supportGroupName)s)** 或 **[邮件](mailto: %(supportConfig.supportMailAddress)s)**.