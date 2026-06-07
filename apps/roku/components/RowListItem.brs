sub init()
    m.itemPoster = m.top.findNode("itemPoster")
    m.itemTitle = m.top.findNode("itemTitle")
    m.focusRing = m.top.findNode("focusRing")
end sub

sub onContentChange()
    itemData = m.top.itemContent
    if itemData <> invalid then
        m.itemPoster.uri = itemData.HDPosterUrl
        m.itemTitle.text = itemData.title
    end if
end sub

sub onFocusChange()
    if m.top.itemHasFocus then
        m.focusRing.opacity = 1.0
        m.itemTitle.color = "#fb6c1d"
    else
        m.focusRing.opacity = 0.0
        m.itemTitle.color = "#ffffff"
    end if
end sub
