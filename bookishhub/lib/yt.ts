import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";

export async function getVideoTranscript(videoId: string) {
    try 
    {
      let transcript = "";
      let transcriptVector = await YoutubeTranscript.fetchTranscript(videoId, {
                                                                                lang: "en",                                                                                
                                                                              }
                                                                    );

      for(let transcriptText of transcriptVector) 
      {
        transcript = transcript + transcriptText.text + " ";
      }

      return transcript.replaceAll("\n", "");
    } 
    catch (error) 
    {
      return "";
    }
}

export async function findOnYt(ytSearchQuery: string) {
    ytSearchQuery = encodeURIComponent(ytSearchQuery);

    const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${ytSearchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
      );

    if ((!data) || (data.items[0] == undefined)) 
    {
      console.log("Youtube video could not be found!");
      return null;
    }

    return data.items[0].id.videoId;
}
