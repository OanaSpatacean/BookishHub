import { strict_output } from "./openai";
import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";

export async function getQueriesAndSolutionsFromTranscript(transcript: string, lessonName: string) {
  type Query = 
  {
    query: string;
    solution: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
  };

  const queries: Query[] = await strict_output(
    "You are an AI used for creating multiple-choice queries and solutions. Each solution should not have a length greater than 20 words",
    new Array(10).fill(
      `Your task is to create six different challenging multiple-choice queries related to ${lessonName}, based on the content provided in the transcript ${transcript}`
    ),
    {
      query: "query",
      solution: "solution with length of 20 words maximum, could also be 'All of the above'",
      choice1: "choice1 with length of 20 words maximum, different than the other choices, different than the other choices",
      choice2: "choice2 with length of 20 words maximum, different than the other choices, different than the other choices",
      choice3: "choice3 with length of 20 words maximum, different than the other choices, different than the other choices",
      choice4: "choice4 with length of 20 words maximum, could also be 'All of the above', different than the other choices"
    }
  );

  return queries;
}

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
