sub init()
    m.spinner = m.top.findNode("spinner")
    m.errorLabel = m.top.findNode("errorLabel")
    m.rowList = m.top.findNode("rowList")
    m.videoPlayer = m.top.findNode("videoPlayer")
    m.fetchTask = m.top.findNode("fetchTask")
    
    ' Listeners
    m.fetchTask.observeField("content", "onFeedLoaded")
    m.fetchTask.observeField("errorMsg", "onFeedError")
    m.rowList.observeField("itemSelected", "onAssetSelected")
    m.videoPlayer.observeField("state", "onVideoStateChange")
    
    ' Execute Task
    m.fetchTask.control = "RUN"
    m.spinner.poster.blendColor = "#fb6c1d" ' Brand orange spinner
end sub

sub onFeedLoaded()
    m.spinner.visible = false
    content = m.fetchTask.content
    
    if content <> invalid and content.getChildCount() > 0 then
        m.rowList.content = content
        m.rowList.visible = true
        m.rowList.setFocus(true)
    else
        m.errorLabel.text = "No media available at this time."
        m.errorLabel.visible = true
    end if
end sub

sub onFeedError()
    m.spinner.visible = false
    m.errorLabel.text = m.fetchTask.errorMsg
    m.errorLabel.visible = true
end sub

sub onAssetSelected()
    rowIdx = m.rowList.rowItemSelected[0]
    colIdx = m.rowList.rowItemSelected[1]
    selectedItem = m.rowList.content.getChild(rowIdx).getChild(colIdx)
    
    if selectedItem.url <> invalid and selectedItem.url <> "" then
        ' Switch to Video UI
        m.rowList.visible = false
        m.videoPlayer.visible = true
        m.videoPlayer.setFocus(true)
        
        ' Configure Video
        vidContent = CreateObject("roSGNode", "ContentNode")
        vidContent.url = selectedItem.url
        vidContent.streamFormat = "hls"
        
        m.videoPlayer.content = vidContent
        m.videoPlayer.control = "play"
    end if
end sub

sub onVideoStateChange()
    state = m.videoPlayer.state
    if state = "error" or state = "finished" then
        ' Graceful exit back to RowList
        m.videoPlayer.control = "stop"
        m.videoPlayer.visible = false
        m.rowList.visible = true
        m.rowList.setFocus(true)
        
        if state = "error" then
            ' Trigger standard Roku Error Dialog
            dialog = CreateObject("roSGNode", "Dialog")
            dialog.title = "Playback Error"
            dialog.message = "There was an issue streaming this video. Please try again."
            dialog.buttons = ["OK"]
            m.top.dialog = dialog
        end if
    end if
end sub

' Remote Control Intercept
function onKeyEvent(key as String, press as Boolean) as Boolean
    handled = false
    if press then
        if key = "back" and m.videoPlayer.visible then
            ' Stop video and return to RowList
            m.videoPlayer.control = "stop"
            m.videoPlayer.visible = false
            m.rowList.visible = true
            m.rowList.setFocus(true)
            handled = true
        end if
    end if
    return handled
end function
