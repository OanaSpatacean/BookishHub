import axios from "axios";

interface UnsplashImage {
  urls: {
    small_s3: string;
  };
}

interface UnsplashResponse {
  results: UnsplashImage[];
}

export const getUnsplashImage = async (query: string): Promise<string | undefined> => 
{
  try {
    const { data } = await axios.get<UnsplashResponse>(
      `https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${process.env.UNSPLASH_API_KEY}`
    );
    return data.results[0].urls.small_s3;
  } 
  catch (error) 
  {
    console.error("Error fetching image from Unsplash:", error);
    return undefined; 
  }
};
