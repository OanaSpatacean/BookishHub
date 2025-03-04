import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try 
  {
    const { prompt } = await req.json();

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that helps users continue their thoughts naturally. 
          You must analyze the provided text and complete it in the same tone, style, and language as the user.
          Maintain consistency in structure, vocabulary, and writing style.
          Always respond in the user's language and at the specified proficiency level. 
          Keep the response concise and natural, ensuring it seamlessly extends the user's input. Do not ask for more feedback from the user. Just continue his words. Do not ask questions.`,
        },
        {
          role: "user",
          content: `Continue this thought naturally in user's language: "${prompt}". Help the user complete his train of thought`
        }
      ]
    })
    
    const completionText = response.data.choices[0]?.message?.content?.trim() || "";

    return new Response(completionText, {status: 200, headers: { "Content-Type": "text/plain" }})
  } 
  catch (error) 
  {
    console.error("Autocompletion error:", error);
    return new Response("Autocompletion failed", { status: 500 });
  }
}
