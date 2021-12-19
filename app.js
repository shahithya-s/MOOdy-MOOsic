//API Control
const APIController = (function() {
    
    const clientId = '8ef6b36a868a48c6aabbb7ad1b2403fa';
    const clientSecret = 'f8fdb8d3890c44f2beda28dac258d9f2';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    //get a list of tracks in the playlist
    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 8;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();

// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        // need method to create a track list group item 
        createTrack(id, name) {
            
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create the song detail
        createTrackDetail(img, title, artist, url) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html = 
            `
            <div style="padding-top: 50px;">
                <p>Song Preview:<p>
            </div>
            <div class="trackImage">
                <img src="${img}" alt="">        
            </div>
            <div style="padding-top: 20px;">
            </div>
            <div class="TrackArtist">
                <label for="Genre" style="font-weight: 600;" >${title}</label>
            </div>
            <div class="TrackArtist">
                <label for="artist" >By ${artist}</label>
            </div> 
            <div style="font-weight: 700;">
                <a href="https://open.spotify.com/track/${url}"><p>Click here to Listen!<p>
            </div>
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },    
        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }
})();

const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get feelings on page load
    const load = async () => {
        //get the token
        const token = await APICtrl.getToken();    
        //store the token onto the page
        UICtrl.storeToken(token);
    }

    //store the mood that someone is feeling and feeling corresponds to genre
    let selection = document.querySelector('select');
    selection.addEventListener('change', async () => {
        
        var feeling = selection.options[selection.selectedIndex].text;

        if (feeling == "Happy"){
            var playlist = "https://api.spotify.com/v1/playlists/5FVsb9bq0PoVrhJvpVJmQu/tracks"; 
        }

        if (feeling == "Chill"){
            var playlist = "https://api.spotify.com/v1/playlists/37i9dQZF1DX4WYpdgoIcn6/tracks"; 
        }

        if (feeling == "Nostalgic"){
            var playlist = "https://api.spotify.com/v1/playlists/7GxSaI37dO6TUUSep5Ca4M/tracks";
        }

        if (feeling == "Loved"){
            var playlist = "https://api.spotify.com/v1/playlists/1WgoVVoPqTwn55435uysZq/tracks";
        }

        if (feeling == "Heartbroken"){
            var playlist = "https://api.spotify.com/v1/playlists/4yXfnhz0BReoVfwwYRtPBm/tracks";
        }

        if (feeling == "Energized"){
            var playlist = "https://api.spotify.com/v1/playlists/37i9dQZF1DWURugcFfOfEH/tracks";
        }

        if (feeling == "Trendy"){
            var playlist = "https://api.spotify.com/v1/playlists/0JFatPoPq82gNcPa4esOzj/tracks";
        }

        if (feeling == "Festive"){
            var playlist = "https://api.spotify.com/v1/playlists/37i9dQZF1DX0Yxoavh5qJV/tracks";
        }

        if (feeling == "Sexy"){
            var playlist = "https://api.spotify.com/v1/playlists/7ebQdxl0t7c8kr2nwFxOaJ/tracks";
        }
        console.log(playlist);

        //get the token that's stored on the page
        const token = UICtrl.getStoredToken().token; 
        
        // create submit button click event listener
        DOMInputs.submit.addEventListener('click', async (e) => {
            // prevent page reset
            e.preventDefault();
            // clear tracks
            UICtrl.resetTracks();
            //get the token
            const token = UICtrl.getStoredToken().token;        
            // get the list of tracks
            const tracks = await APICtrl.getTracks(token, playlist);
            // create a track list item
            tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
        });
    });


    // create song selection click event listener
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const trackEndpoint = e.target.id;
        console.log(trackEndpoint);
        //get the track object
        const track = await APICtrl.getTrack(token, trackEndpoint);
        // load the track details
        UICtrl.createTrackDetail(track.album.images[1].url, track.name, track.artists[0].name, track.id);
        console.log(track);
    });    

    return {
        init() {
            console.log('App is starting...');
            load();
        }
    }

})(UIController, APIController);

APPController.init();