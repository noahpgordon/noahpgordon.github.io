﻿$(document).ready(function(){
	var releasePattern1 = /^18[7-9][0-9]-[0-1][0-9]-[0-3][0-9]$/;
	var releasePattern2 = /^19[0-9][0-9]-[0-1][0-9]-[0-3][0-9]$/;
	var releasePattern3 = /^20[0-9][0-9]-[0-1][0-9]-[0-3][0-9]$/;
	var runTimePattern = /^[0-9]{1,5}$/;
	var emptyPattern = /^$/;
	$('#preferences').submit(function(e){
		e.preventDefault();
		$('#releases1').empty();
		$('#releases2').empty();
		$('#runtimes1').empty();
		$('#runtimes2').empty();
		$('#video').empty();
		$('#title').empty();
		$('#poster').empty();
		$('#finalTitle').empty();
		$('#summary').empty();
		$('#releaseDate').empty();
		$('#finalRuntime').empty();
		$('#finalMPAA').empty();
		$('#metascore').empty();
		$('#finalIMDB').empty();
		var releaseFrom = $('#releaseFrom').val();
		var releaseTo = $('#releaseTo').val();
		var runtimeFrom = $('#runtimeFrom').val();
		var runtimeTo = $('#runtimeTo').val();
		var isError = false;
		var releasesWritten = false;
		var runtimesWritten = false;
		if((releasePattern1.test(releaseFrom) == false) && (releasePattern2.test(releaseFrom) == false) && (releasePattern3.test(releaseFrom) == false) && (emptyPattern.test(releaseFrom) == false)){
			$('#releases1').append("Release date must be a valid date in the following format: YYYY-MM-DD.");
			isError = true;
		}
		if((releasePattern1.test(releaseTo) == false) && (releasePattern2.test(releaseTo) == false) && (releasePattern3.test(releaseTo) == false) && (emptyPattern.test(releaseTo) == false)){
			$('#releases2').append("<div>Release date must be a valid date in the following format: YYYY-MM-DD</div>");
			isError = true;
			releasesWritten = true;
		}
		if((parseInt(releaseFrom) > parseInt(releaseTo)) && (emptyPattern.test(releaseTo) == false)){
			if(releasesWritten == false){
				$('#releases2').append("Earliest relase year must be less than or equal to latest release year.");
			}
			else{
				$('#releases2').append("<div>Earliest relase year must be less than or equal to latest release year.</div>");
			}
			isError = true;
		}
		if((runTimePattern.test(runtimeFrom) == false) && (emptyPattern.test(runtimeFrom) == false)){
			$('#runtimes1').append("Any runtime must be a minute value of 1 to 5 digits.");
			isError = true;
		}
		if((runTimePattern.test(runtimeTo) == false) && (emptyPattern.test(runtimeTo) == false)){
			$('#runtimes2').append("<div>Any runtime must be a minute value of 1 to 5 digits.</div>");
			isError = true;
			runtimesWritten = true;
		}
		if((parseInt(runtimeFrom) > parseInt(runtimeTo)) && (emptyPattern.test(runtimeTo) == false)){
			if(runtimesWritten == false){
				$('#runtimes2').append("Shortest runtime must be less than or equal to longest runtime.");
			}
			else{
				$('#runtimes2').append("<div>Shortest runtime must be less than or equal to longest runtime.</div>");
			}
			isError = true;
		}
		if(isError == true){
			return;
		}
		var mpaaRating = $('#mpaa').val();
		var genresArray = $('#genres').val();
		var mpaaChecked = $('#mpaaChecked').attr('checked');
		if(mpaaChecked !== 'checked'){
			mpaaChecked = 'not' ;
		}
		var genres = "";
		if(genresArray !== null){
			for(var i = 0; i < genresArray.length ; i++){
				genres += genresArray[i].toString();
				if(i + 1 < genresArray.length){
		    		genres += ',';
				}
			}
		}
		var url = '';
		if(mpaaRating == ''){
			url += 'https://api.themoviedb.org/3/discover/movie?api_key=ef908a55b025911705c5e78b7f4d23cd&page=1&' + 'with_genres=' + genres + '&primary_release_date.gte=' + releaseFrom + '&primary_release_date.lte=' + releaseTo + '&with_runtime.gte=' + runtimeFrom + '&with_runtime.lte=' + runtimeTo ;
		}
		else if(mpaaChecked == 'checked'){
			url += 'https://api.themoviedb.org/3/discover/movie?api_key=ef908a55b025911705c5e78b7f4d23cd&page=1&' + 'with_genres=' + genres +  '&primary_release_date.gte=' + releaseFrom + '&primary_release_date.lte=' + releaseTo + '&with_runtime.gte=' + runtimeFrom + '&with_runtime.lte=' + runtimeTo + '&certification_country=US' + '&certification.lte=' + mpaaRating ;		}
		else{
			url += 'https://api.themoviedb.org/3/discover/movie?api_key=ef908a55b025911705c5e78b7f4d23cd&page=1&' + 'with_genres=' + genres +  '&primary_release_date.gte=' + releaseFrom + '&primary_release_date.lte=' + releaseTo + '&with_runtime.gte=' + runtimeFrom + '&with_runtime.lte=' + runtimeTo + '&certification_country=US' + '&certification=' + mpaaRating ;
		}
		$.ajax({
		  url: url,
		  type: "GET",
		  dataType: "JSON",
		  success: function(serverResponse){
		    var randomIndex = Math.round(Math.random() * (serverResponse.results.length - 1)) ;
		    var selectedID = serverResponse.results[randomIndex].id ;
		    var movieURL = 'https://api.themoviedb.org/3/movie/' + selectedID ;
		    $.ajax({
		    	url: movieURL,
		    	type: "GET",
		    	dataType: "JSON",
		    	data: {
		    		api_key: 'ef908a55b025911705c5e78b7f4d23cd',
		    		append_to_response: 'videos'
		    	},
		    	success: function(movieResponse){
		    		var imdbID = movieResponse.imdb_id ;
		    		if(movieResponse.videos.results.length > 0){
		    			$('#video').append('<iframe width="420" height="315" src="https://www.youtube.com/embed/' + movieResponse.videos.results[0].key + '"></iframe>');
		    		}
		    		$.ajax({
		    			url: 'https://www.omdbapi.com/?apikey=c3173f05&',
		    			type: "GET",
		    			dataType: "JSON",
		    			data: {
		    				i: imdbID,
		    				plot: 'full',
		    				r: 'json'
		    			},
		    			success: function(omdbResponse){
		    				$('#finalTitle').append(omdbResponse.Title);
		    				$('#finalTitle').removeAttr('hidden');
		    				$('#summary').append(omdbResponse.Plot);
		    				$('#summary').removeAttr('hidden');
							$('#releaseDate').append(omdbResponse.Released);
							$('#releaseDate').removeAttr('hidden');
							$('#finalMPAA').append(omdbResponse.Rated);
							$('#finalMPAA').removeAttr('hidden');
							$('#finalRuntime').append(omdbResponse.Runtime);
							$('#finalRuntime').removeAttr('hidden');
							$('#metascore').append(omdbResponse.Metascore);
							$('#metascore').removeAttr('hidden');
							$('#finalIMDB').append(omdbResponse.imdbRating);
							$('#finalIMDB').removeAttr('hidden');
							$('#attributes').removeAttr('hidden');
							if(omdbResponse.Poster !== "N/A"){
								$('#poster').append('<img src="' + omdbResponse.Poster + '">');
							}
						},
		    			error: function(jqXHR, textStatus, errorThrown){
		    				alert(errorThrown);
		    			}
		    		});
		    	},
		    	error: function(jqXHR, textStatus, errorThrown){
		    		alert(errorThrown);
		    	}
		    });
		  },
		  error: function(jqXHR, textStatus, errorThrown){
		  		alert(errorThrown);
		  }
		});
	});
});
