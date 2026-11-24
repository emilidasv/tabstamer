// Bookmark all tabs
function bookmarkAllTabs(tabs,userFolder,activeTab){
	
	// Cancel conditions
	if(tabs.length == 0){
		return
	}

	// If folder Tabs Tamer doesn't exist  create it
	if(userFolder == 0 ){
		// Create new bookmarks folder and store bookmarks, happens first time. 
		chrome.bookmarks.create(
			{'parentId': "1", 'title': nameFolder},
			function(newFolder){
				
						chrome.bookmarks.create(
							{'parentId': newFolder.id, 'title': namebookmarkFolder()},
							function(newFolder){
								bookmarkTabs(tabs,newFolder,activeTab)
						})

						
					
			}
		)

	}else{
			// if todays' date already exists create bookmark within that folder
			var folder_for_this_day_exists = false
			var all_children = userFolder.children
			//console.log('all_children')
			//console.log(all_children)
			//console.log(all_children.length)
			var amountofchildren = all_children.length
			//console.log(amountofchildren)
			
			// get mont/day/year for the name of the folder
			var g = new Date()
			var shortnameofnewfolder = g.toLocaleString([], {year:'2-digit', month:'2-digit', day:'2-digit'})
			var continue_search = true
			var tabs_toBookmark = []
			var newIndex = 0
			//console.log('shortnameofnewfolder')
			//console.log(shortnameofnewfolder)
			

			for (let j=0;j< amountofchildren; j++){

				if (continue_search) {
					//console.log(userFolder.children[j].dateAdded)
					var f = new Date(userFolder.children[j].dateAdded)
					var tmpnamefolder = f.toLocaleString([], {year:'2-digit', month:'2-digit', day:'2-digit'})
					//console.log(f)
					//console.log('tmpnamefolder')
					//console.log(tmpnamefolder)
					//console.log('userFolder.children[j]')
					//console.log(userFolder.children[j])
					var children_folder = userFolder.children[j]

					if (tmpnamefolder == shortnameofnewfolder) {
						folder_for_this_day_exists = true
						continue_search= false;  // jump out of loop
						//bookmark all tabs into this folder

						console.log('children_folder')
						//console.log(children_folder.id)
						console.log(children_folder.title)
						var grandchildren = children_folder.children
						console.log(grandchildren.length)
						console.log(tabs.length)
						var list_of_url =[]
						//construc an array of url from the bookmarks
						for (let k=0;k<grandchildren.length; k++){
							list_of_url[k]=  grandchildren[k].url
						}
						console.log(list_of_url)

						for (let j=0;j<tabs.length; j++){

						
							if (list_of_url.includes(tabs[j].url))
							{
								console.log('yup')
								console.log(j)
							}
							else {
								console.log('nope')
								tabs_toBookmark[newIndex]=tabs[j]
								newIndex++

							}
							console.log(tabs_toBookmark.length)
						}
						
						
					//  update the bookmark that are new, if there are any.
						if(tabs_toBookmark.length!=0){
						bookmarkTabs(tabs_toBookmark,children_folder,activeTab)}
					}
				}

			}
	
			//console.log('tmpnamefolder')
			//console.log(tmpnamefolder)
			//console.log('userFolder.children[0].title')
			//console.log(userFolder.children[0].title)	
			//console.log('userFolder.children[0].title')

			//if(!folder_for_this_day_exists){  //if there is not a folder for this date create one
			if(!folder_for_this_day_exists){  //if there is not a folder for this date create one
				chrome.bookmarks.create(
					{'parentId':userFolder.id,
					 'title':namebookmarkFolder()},
					function(newFolder){
						bookmarkTabs(tabs,newFolder,activeTab)
				})

				//console.log('folderdontexist')
				
			}
			////else{ // use the folder that is already created today. 
			////	bookmarkTabs(tabs,children_folder,activeTab)
				
			////}
			console.log('after')
			

		
	}
	
}


// Bookmark all tabs
function bookmarkTabs(tabs,folder,activeTab){


		for (let i=0; i < tabs.length; i++){
				
			
			
			chrome.bookmarks.create(
				{'parentId': folder.id,
			 	'url' : tabs[i].url,
			 	'title' : tabs[i].title}
			 
			)
		
		
		}
		

}


// Name of folder will be todays date, plus time
function namebookmarkFolder(){
	
// Get date and time
let d = new Date()
	

let time = d.toLocaleString([],     {hour:'2-digit', minute:'2-digit'})
let date = d.toDateString()
let bookmName = ''


	//bookmName = date+' '+time
	bookmName = date
	return bookmName
}


// Get bookmarks folder using bookmarks and folder name
// Populate bookmarks parameter with chrome.bookmarks.getTree
function getBookmarksFolder(bookmarks,folderName){
	let bmFolder = 0
	//console.log('getbookmarksfolder - ')

	function loopNest(bookmarks,folderName){
		if(typeof bookmarks === 'object'){

			if(bookmarks.url == undefined && bookmarks.title == folderName){
				bmFolder = bookmarks
			}
			
			if(bmFolder == 0){
				let key
				for (key in bookmarks){loopNest(bookmarks[key],folderName)}
			}
		}
	}	
	//console.log(bookmarks)
	//console.log(folderName)

	
	loopNest(bookmarks,folderName)
	return bmFolder
}


//--Folder name
var nameFolder = 'Tabs Tamer'

// Activate extension
chrome.action.onClicked.addListener(function(tab){
					
			// Get and store current open tabs
			var tabs
			chrome.tabs.query(
				{currentWindow: true},
				function(arrayOfTabs){
					tabs = arrayOfTabs
				}
			)

			
			
			chrome.bookmarks.getTree(function(bookmarks){
				
				// Get ID of bookmark folder matching user input
				let userFolder = getBookmarksFolder(bookmarks,nameFolder)
					
				// Find active tab
				chrome.tabs.query({
					active:true,   //Active tab
					lastFocusedWindow:true // In current window
				},
					function(array_of_tabs){
						
						let activeTab = array_of_tabs[0]
						// if the folder Tabs Tamer doesn;t exitst yet create it.		
						if(userFolder == 0){
							bookmarkAllTabs(tabs,userFolder,activeTab)
						
						}else{						
							
						
								bookmarkAllTabs(tabs,userFolder,activeTab)
							
						}

						//close all the tabs, except the active tab

								for(let i=0; i < tabs.length; i++){
									if(tabs[i].url != activeTab.url){
									//console.log(tabs[i].url) 
									//console.log(activeTab.url)
									chrome.tabs.remove(tabs[i].id)
								}
							}
																	
							

				})	
			})
			
	
}
)