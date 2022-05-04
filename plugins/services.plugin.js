import { SpotifyService } from '../services/spotify.service';


export default ({ app }, inject) => {
    // Inject $hello(msg) in Vue, context and store.
    const spotifyService = new SpotifyService();

    inject('spotifyService', spotifyService)
  }