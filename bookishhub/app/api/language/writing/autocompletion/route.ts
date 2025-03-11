import openai from "@/lib/openai";

export async function POST(req: Request) {
  try 
  {
    const { prompt } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            You are an AI assistant designed to help users continue their thoughts naturally in a language they are learning. 
            Your task is to analyze the user's input text and automatically assess their proficiency level (Beginner, Intermediate, or Advanced) based on:
            - Sentence structure complexity
            - Vocabulary richness
            - Grammar usage
            - Overall writing quality
    
            Once you've assessed their proficiency, continue their thought naturally in a way that fits their level.
            Do not include the user's level in your response. 
            Maintain the same tone, style, and language as the user's input.
            Additionally, always speak in the same person as the user. 
            If the user uses the third person, you should continue using the third person.
            If the user uses the second person, you should continue using the second person. 
            If the user uses the first person, continue with the first person. 
            Do not change the form of address. 
            Do not ask for feedback or clarification from the user. 
            Just complete their thought at the appropriate level for their writing skills.
          `,
        },
        {
          role: "user",
          content: `Continue this thought naturally: "${prompt}".`
        }
      ]
    })  
    
    const completionText = response.choices[0]?.message?.content?.trim() || "";

    return new Response(completionText, {status: 200, headers: { "Content-Type": "text/plain" }})
  } 
  catch (error) 
  {
    console.error("Autocompletion error:", error);
    return new Response("Autocompletion failed", { status: 500 });
  }
}
