sub init()
    m.top.functionName = "loadContent"
end sub

sub loadContent()
    appInfo = CreateObject("roAppInfo")
    baseUrl = appInfo.GetValue("API_BASE_URL")
    
    if baseUrl = "" then
        baseUrl = "https://api.hoopwithher.com" ' Fallback if manifest is missing
    end if
    
    feedUrl = baseUrl + "/api/roku/feed"
    
    req = CreateObject("roUrlTransfer")
    req.SetUrl(feedUrl)
    req.SetCertificatesFile("common:/certs/ca-bundle.crt")
    req.InitClientCertificates()
    
    responseString = req.GetToString()
    
    if responseString = "" then
        m.top.errorMsg = "Failed to load content from server."
        return
    end if
    
    json = ParseJson(responseString)
    
    if json = invalid or json.movies = invalid then
        m.top.errorMsg = "Invalid content format received."
        return
    end if
    
    rootContent = CreateObject("roSGNode", "ContentNode")
    categoriesMap = {}
    
    ' Iterate over the flat movies array
    for each item in json.movies
        ' Build the individual video node
        itemNode = CreateObject("roSGNode", "ContentNode")
        itemNode.title = item.title
        itemNode.description = item.shortDescription
        itemNode.HDPosterUrl = item.thumbnail
        
        ' Safely extract the HLS url
        if item.content <> invalid and item.content.videos <> invalid and item.content.videos.Count() > 0 then
            itemNode.url = item.content.videos[0].url
        end if
        
        ' Group by the first tag found, defaulting to "Featured"
        categoryName = "Featured"
        if item.tags <> invalid and item.tags.Count() > 0 then
            categoryName = item.tags[0]
        end if
        
        ' Fetch or Create the Parent Category Row Node
        rowNode = categoriesMap[categoryName]
        if rowNode = invalid then
            rowNode = CreateObject("roSGNode", "ContentNode")
            rowNode.title = categoryName
            categoriesMap[categoryName] = rowNode
            rootContent.appendChild(rowNode)
        end if
        
        rowNode.appendChild(itemNode)
    end for
    
    ' Assign parsed ContentNode tree to the interface
    m.top.content = rootContent
end sub
