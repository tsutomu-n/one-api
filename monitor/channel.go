package monitor

import (
	"fmt"
	"github.com/songquanpeng/one-api/common/config"
	"github.com/songquanpeng/one-api/common/logger"
	"github.com/songquanpeng/one-api/common/message"
	"github.com/songquanpeng/one-api/model"
)

func notifyRootUser(subject string, content string) {
	if config.MessagePusherAddress != "" {
		err := message.SendMessage(subject, content, content)
		if err != nil {
			logger.SysError(fmt.Sprintf("failed to send message: %s", err.Error()))
		} else {
			return
		}
	}
	if config.RootUserEmail == "" {
		config.RootUserEmail = model.GetRootUserEmail()
	}
	err := message.SendEmail(subject, config.RootUserEmail, content)
	if err != nil {
		logger.SysError(fmt.Sprintf("failed to send email: %s", err.Error()))
	}
}

// DisableChannel disable & notify
func DisableChannel(channelId int, channelName string, reason string) {
	model.UpdateChannelStatusById(channelId, model.ChannelStatusAutoDisabled)
	logger.SysLog(fmt.Sprintf("channel #%d has been disabled: %s", channelId, reason))
	subject := fmt.Sprintf("チャネル「%s」（#%d）が無効化されました", channelName, channelId)
	content := fmt.Sprintf("チャネル「%s」（#%d）が無効化されました。理由：%s", channelName, channelId, reason)
	notifyRootUser(subject, content)
}

func MetricDisableChannel(channelId int, successRate float64) {
	model.UpdateChannelStatusById(channelId, model.ChannelStatusAutoDisabled)
	logger.SysLog(fmt.Sprintf("channel #%d has been disabled due to low success rate: %.2f", channelId, successRate*100))
	subject := fmt.Sprintf("チャネル #%d 已被無効化", channelId)
	content := fmt.Sprintf("该チャネル（#%d）在最近 %d 次调用中成功率为 %.2f%%，低于阈值 %.2f%%，因此被系统自动無効化。",
		channelId, config.MetricQueueSize, successRate*100, config.MetricSuccessRateThreshold*100)
	notifyRootUser(subject, content)
}

// EnableChannel enable & notify
func EnableChannel(channelId int, channelName string) {
	model.UpdateChannelStatusById(channelId, model.ChannelStatusEnabled)
	logger.SysLog(fmt.Sprintf("channel #%d has been enabled", channelId))
	subject := fmt.Sprintf("チャネル「%s」（#%d）已被有効化", channelName, channelId)
	content := fmt.Sprintf("チャネル「%s」（#%d）已被有効化", channelName, channelId)
	notifyRootUser(subject, content)
}
