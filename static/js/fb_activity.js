$('document').ready(function(){
	$('#sidebar_div a img').on({
	    mouseover: function(){
	    	$(this).attr("src",$(this).data('img')+"_blue.png");
	    },
	     mouseout: function(){
	    	 $(this).attr("src",$(this).data('img')+"_gray.png");
	    },
	    click: function(){
	    	$('#sidebar_div a img').each(function(){
	    		$(this).attr("src",$(this).data('img')+"_gray.png");
	    		$(this).on({
	    			mouseover: function(){
				    	$(this).attr("src",$(this).data('img')+"_blue.png");
				    },
				     mouseout: function(){
				    	 $(this).attr("src",$(this).data('img')+"_gray.png");
				    }
	    		});
	    	});
	    	
	        $(this).attr("src",$(this).data('img')+"_blue.png");
	        
	    	$(this).on({
    			mouseover: function(){
    				$(this).attr("src",$(this).data('img')+"_blue.png");
			    },
			     mouseout: function(){
				    $(this).attr("src",$(this).data('img')+"_blue.png");
			    }
    		});
	        
	    }
	});
});



function statusChangeCallback(response) {
	if (response.status === 'connected') {
		FBdashboard(response.authResponse.accessToken);
	} else if (response.status === 'not_authorized') {
		alert("not authorised")
	} else {
		alert("not authorised")
	}
}

function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

window.fbAsyncInit = function() {
	FB.init({
		appId : '1435054130115460',
		cookie : true, // enable cookies to allow the server to access
		// the session
		xfbml : true, // parse social plugins on this page
		version : 'v2.0' // use version 2.0
	});

	// Now that we've initialized the JavaScript SDK, we call
	// FB.getLoginStatus(). This function gets the state of the
	// person visiting this page

	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});

};

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id))
		return;
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function FBdashboard(accessToken) {
	FB.api(
		"me?fields=name,\
			tagged_places, \
			albums.limit(100).fields( \
									count,\
									name,\
									likes.limit(1000),\
									comments.limit(500)),\
			posts.limit(200).fields(\
									description,\
									type,\
									message,\
									likes.limit(1000),\
									comments.limit(1000),\
									with_tags),\
			groups.limit(25).fields(\
									description, \
									unread,\
									name) \
			&access_token="+ accessToken,

					function(response) {
						if (response && !response.error) {
							console.log(response);

							basic_info(response);
							alert("before album")
							album_analytics(response);
							alert("here")
							post_analytics(response);
							alert("after post")
							location_analytics(response);
							
							group_analytics(response);
							
						}
					});
}

function basic_info(response){
	id = response.id
	FB.api(
			id,
			function(response) {
				console.log(response)
				$('#page_head').empty().append(response.name)
				$('#birthday_content').empty().append(response.birthday)
				
				date = new Date(response.work[0].start_date)
				work_company = response.work[0].employer.name
				work_designation = response.work[0].position.name
				
				$.each(response.work, function(index,work){
					work_start_date = new Date(work.start_date)
					if (work_start_date > date){
						date = work_start_date
						work_company = work.employer.name
						work_designation = work.position.name
					} 
				});
				$('#work_content').empty().append(work_designation+"</br>"+work_company)
				
				year = 0
				college =''
				$.each(response.education, function(index,edu){
					if (edu.year){
						if (parseInt(edu.year.name) > parseInt(year)){
							year = parseInt(edu.year.name)
							college = edu.school.name
						}
					}else{
						if (college == ''){
							college = edu.school.name
						}
					}
					
				});
				$('#education_content').empty().append(college);
				
				city_analytics(response.hometown.id, 
								response.hometown.name, 
								response.location.id, 
								response.location.name);
								
			});
			
}


function album_analytics(response) {
	album_render_data = [ [ 'Name', 'Total Comments', 'Total Likes', 'Type',
			'Total Photos', ] ]
	album_render_data_line = [['Name','Total Comments','Total Likes', 'Total Photos']]
	$.each(response.albums.data, function(index, album) {
		if (album.name == 'Cover Photos') {
			get_most_liked_photo(album.id, "cover")
		}

		if (album.name == 'Profile Pictures') {
			get_most_liked_photo(album.id, "profile")
		}

		if (album.likes) {
			if (album.comments) {
				album_render_data.push([ album.name,
						album.comments.data.length, album.likes.data.length,
						'Album', album.count ])
				album_render_data_line.push([album.name, album.comments.data.length, album.likes.data.length, album.count])
			} else {
				album_render_data.push([ album.name, 0,
						album.likes.data.length, 'Album', album.count ])
				album_render_data_line.push([album.name, 0, album.likes.data.length, album.count])
			}
		}
	});

	draw_bubble_chart(album_render_data, "album_bubble", "Album Analytics (Total Photos, Likes & Comments on Album)", "Total Comments", 'Total Likes')
	
	draw_album_line_chart(album_render_data_line, "album_column", "Album Analytics (Total Photos, Likes & Comments on Album)", "Total Likes & Comments", "Total Photos")
	draw_album_table(album_render_data_line, "album_table")
	$('#line_item').removeClass('active')
	$('#table_item').removeClass('active')
}

function get_most_liked_photo(id, type) {
	FB
			.api(
					id+"?fields=photos.limit(1000),\
					likes.limit(1000),\
					comments.limit(1000),\
					created_time",

					function(response) {
						total_likes = 0
						pic_url = ''
						total_comments = 0
						created_on = ''
						$.each(response.photos.data, function(index, photo) {
							if (photo.likes) {
								likes = photo.likes.data.length
							} else {
								likes = 0
							}

							if (likes > total_likes) {
								total_likes = likes
								pic_url = photo.images[2].source
								total_comments = photo.comments.data.length
								created_on = photo.created_time
							}
						});
						if (type == "cover") {
							$('#cover_img').attr('src', pic_url)
							$('#cover_likes').append(total_likes)
							$('#cover_comments').append(total_comments)
							$('#cover_likes').append(created_on)
						} else if (type == "profile") {
							$('#profile_img').attr('src', pic_url)
						}
					});
}

function post_analytics(response) {
	stat = links = photos = videos = 0
	post_render_data = [ [ 'Posts', 'Total Likes', 'Total Comments' ] ]
	likers = []
	commentors = []
	taggers = []

	$.each(response.posts.data, function(index, post) {
		if (post.likes){
			if (post.type) {
				if (post.type == 'status') {
					stat += 1
				} else if (post.type == 'video') {
					videos += 1
				} else if (post.type == 'link') {
					links += 1
				} else {
					photos += 1
				}
			}
		}

		if (post.likes) {
			$.each(post.likes.data, function(index, like) {
				likers.push(like.name)
			});
		}

		if (post.comments) {
			$.each(post.comments.data, function(index, comment) {
				commentors.push(comment.from.name)
			});
		}

		if (post.with_tags) {
			$.each(post.with_tags.data, function(index, tags) {
				taggers.push(tags.name)
			});
		}
		if (post.likes){
			
			likes = post.likes.data.length
			if (post.type == 'status' || post.type == 'photo') {
				if (post.message)
					posts = (post.type).toUpperCase() +": "+post.message
				else
					posts = post.type
			} else {
				if (post.description)
					posts = (post.type).toUpperCase() +": "+post.description
				else
					posts = post.type
			}
			if (post.comments) {
				comments = post.comments.data.length
			} else {
				comments = 0
			}
	
			post_render_data.push([ posts, likes, comments ])
	}

	});
	post_distribution_render_data = [ 
	                                  [ 'Type', 'Percentage' ],
	                                  [ 'Status', stat ], 
	                                  [ 'Links', links ], 
	                                  [ 'Videos', videos ],
	                                  [ 'Photos', photos ] 
	                                 ]
	draw_pie_chart(post_distribution_render_data, 'post_distribution','Posts Categorization')
	draw_line_chart(post_render_data, "recent_posts", "Post Analytics - Likes & Comments on recent Posts", "#Likes", "#Comments")

	toppers(likers,"likers")
	toppers(commentors,"commentors")
	toppers(taggers,"taggers")
}

function toppers(data, type){
	if(type == 'likers'){
		tag1 = "Likes";
		tag2 = "Top 10 Likers";
		div = "top_liker";
		till = 10;
	}else if(type == 'commentors'){
		tag1 = "Comments";
		tag2 = "Top 10 Commentors";
		div = "top_commentor";
		till = 10;
	}else{
		tag1 = "Tags";
		tag2 = "Top 5 Taggers";
		div = "top_tagger";
		till = 5;
	}
	
	
	var counts = {}
	for (var i = 0; i < data.length; i++) {
		var num = data[i]
		counts[num] = counts[num] ? counts[num] + 1 : 1;
	}
	top_data = getSortedKeys(counts)
	top_render_data = [ [ "Name", "Parent", tag1, "Color" ],
	                           	[ tag2, null, 0, 0 ] 
							]
	for (var i = 0; i < till; i++) {
		top_render_data.push([ top_data[i], tag2,
				counts[top_data[i]], counts[top_data[i]] ])
	}
	draw_treemap_chart(top_render_data, div)
}

function location_analytics(response){
	location_render_data = [['City','Place']]
	$.each(response.tagged_places.data, function(index, loc) {
		location_render_data.push([loc.place.location.city, loc.place.name+", "+loc.place.location.city])
	});
	draw_map(location_render_data,"places");
}

function group_analytics(response){
	group_render_data = [['Name','Unread Posts']]
	$.each(response.groups.data, function(index, group) {
		if (group.unread)
			group_render_data.push([group.name, group.unread])
		else
			group_render_data.push([group.name, 0])
	});
	
	draw_column_chart(group_render_data, "groups");
}

function events_analytics(response){
	html=''
	$.each(response.events.data, function(index, event) {
		html +="<div>"+event.rsvp_status+"- "+event.name+" on "+event.start_time+" at "+ event.location+"</div></br>"
	});
	$('#events').empty().append(html)
}

function city_analytics(home_id, home_name, location_id, location_name){
	FB.api(
			home_id,
			function(response) {
				desc = response.description
				talking_count = response.talking_about_count
				$('#home').empty().append("Hometown: "+home_name)
				$('#home_desc').empty().append(desc)
				$('#home_talking_about').empty().append(talking_count+" people are talking about it")
			});
	FB.api(
			location_id,
			function(response) {
				desc = response.description
				talking_count = response.talking_about_count
				$('#loc').empty().append("Current Location "+location_name)
				$('#loc_desc').empty().append(desc)
				$('#loc_talking_about').empty().append(talking_count+" people are talking about it")
			});
	
}

function getSortedKeys(obj) {
	var keys = [];
	for ( var key in obj)
		keys.push(key);
	return keys.sort(function(a, b) {
		return obj[b] - obj[a]
	});
}
