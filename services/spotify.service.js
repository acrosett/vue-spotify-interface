import { RestService } from '../services/rest.service';

export class SpotifyService {
    
    constructor () {
        this.rest = new RestService();
        this.token = null;
        this.login();

    }

    logAuthToken() {
        console.log(this.token);
    }
    
    login () {

        var authOptions = {
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        this.rest.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            'grant_type': 'client_credentials'
        }), authOptions )
          .then( (response) => {
            this.token = response.data.access_token;
          })
          .catch(function (error) {
            console.log(error);
            alert("Spotify Login Failed (check .env credentials): " + error);
          });
    }
   

  }