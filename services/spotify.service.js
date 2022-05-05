import { RestService } from '../services/rest.service';

export class SpotifyService {

  constructor() {
    this.rest = new RestService();
    this.token = null;
    this.login();

  }

  logAuthToken() {
    console.log(this.token);
  }

  login() {

    var authOptions = {
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    this.rest.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      'grant_type': 'client_credentials'
    }), authOptions)
      .then((response) => {
        this.token = response.data.access_token;
      })
      .catch(function (error) {
        console.log("Spotify Login Failed (check .env credentials): " + error);
      });
  }

  // Retrieve a list of artists by name from spotify
  searchArtist(name) {
    var reqParams = {
      headers: {
        'Authorization': 'Bearer  ' + this.token
      },
      params: {
        q: name,
        type: 'artist',

      }
    };
    return this.rest.get('https://api.spotify.com/v1/search', reqParams);
  }

  getArtistAlbums(artistId) {
    var reqParams = {
      headers: {
        'Authorization': 'Bearer  ' + this.token
      }
    };
    return this.rest.get('https://api.spotify.com/v1/artists/' + artistId + '/albums', reqParams);
  }

  getAlbumTracks(albumId) {
    var reqParams = {
      headers: {
        'Authorization': 'Bearer  ' + this.token
      }
    };
    return this.rest.get('https://api.spotify.com/v1/albums/' + albumId + '/tracks', reqParams);
  }


}