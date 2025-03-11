import openai from "@/lib/openai";

export async function POST(req: Request) {
  try 
  {
    const { prompt, language, level } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant designed to help users continue their sentences naturally in ${language}.  
              Your goal is to extend their input while matching their **proficiency level** (${level}: Beginner, Intermediate, or Advanced).  
              
              Follow these strict guidelines when generating the continuation:  
              - **Language Adaptation:** Always write in ${language}. Do not switch to another language.  
              - **Level-Appropriate Vocabulary & Grammar:**  
                - If the user is **Beginner**, use **simple words, basic grammar, and short sentences**. Avoid advanced vocabulary.  
                - If the user is **Intermediate**, use **moderate complexity**, including some idiomatic expressions and varied sentence structures.  
                - If the user is **Advanced**, use **rich vocabulary, complex sentence structures, and natural expressions**.  
              - **Maintain the Same Tone & Style:** Ensure the continuation feels **seamless and natural**, as if the user wrote it.  
              - **Respect the User’s Perspective:**  
                - If they write in **first-person ("I")**, continue using "I".  
                - If they use **second-person ("you")**, continue addressing "you".  
                - If they use **third-person ("he/she/they")**, keep using third-person.  
              - **No Explicit Level Mentioning:** Never mention or describe the user's level in the response.  
              - **No Questions or Feedback Requests:** Do not ask for clarification or suggest corrections—just continue their thought smoothly.  
              
              Now, extend the following text while applying these rules:  
              
              User's input: "${prompt}"            
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
