import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gpt-3.5-turbo",
  temperature: number = 1,
  num_tries: number = 5,
  verbose: boolean = false
) {
// if the user input is in a list, we also process the output as a list of json
  const list_input: boolean = Array.isArray(user_prompt);
// if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
// if the output format contains list elements of [ or ], then we add to the prompt to handle lists
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

// start off with no error message
  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output ${
      list_output ? "an array of objects in" : ""
    } the following in JSON format: ${JSON.stringify(output_format)}.`;
    
    // Add explicit instruction to use double quotes
    output_format_prompt += ` Ensure that all keys and string values in the JSON are enclosed in double quotes, following standard JSON syntax.`;

    if (list_output) {
      output_format_prompt += `\nIf an output field is a list, classify the output into the most appropriate element of the list.`;
    }

// if output_format contains dynamic elements, process it accordingly
    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it.`;
    }

// if input is in a list format, ask it to generate json in a list
    if (list_input) {
      output_format_prompt += `\nGenerate an array of JSON objects, one JSON object for each input element.`;
    }

// Use OpenAI to get a response
    const response = await openai.createChatCompletion({
      temperature: temperature,
      model: model,
      messages: [
        {
          role: "system",
          content: system_prompt + output_format_prompt + error_msg,
        },
        { role: "user", content: user_prompt.toString() },
      ],
    });

    let res: string = response.data.choices[0].message?.content ?? "";

    if (verbose) {
      console.log(
        "System prompt:",
        system_prompt + output_format_prompt + error_msg
      );
      console.log("\nUser prompt:", user_prompt);
      console.log("\nGPT response:", res);
    }

// try-catch block to ensure output format is adhered to
    try {
      let output: any = JSON.parse(res);

      if (list_input) {
        if (!Array.isArray(output)) {
          throw new Error("Output format not in an array of JSON objects");
        }
      } else {
        output = [output];
      }

      for (const item of output) {
        for (const key in output_format) {
// unable to ensure accuracy of dynamic output header, so skip it
          if (/<.*?>/.test(key)) {
            continue;
          }

          if (!(key in item)) {
            throw new Error(`Key ${key} missing in JSON output`);
          }

// check that one of the choices given for the list of words is an unknown
          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];
            if (!choices.includes(item[key]) && default_category) {
              item[key] = default_category;
            }
          }
        }

        if (output_value_only) {
          Object.keys(item).forEach((key) => {
            item[key] = Object.values(item[key]);
            if (item[key].length === 1) {
              item[key] = item[key][0];
            }
          });
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
      console.log("An exception occurred:", e);
      console.log("Current invalid json format ", res);
    }
  }

  return [];
}

export async function createPromptForMemoryEnhacementCardImage(name: string) 
{
  try 
  {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an imaginative and resourceful AI designed to craft compelling thumbnail descriptions for my notes. Your responses will be used as prompts for the DALLE API to create thumbnails. Ensure the descriptions are simple, modern, and flat in style.",
        },
        {
          role: "user",
          content: `Create a thumbnail prompt for my memory enhancement card with the name: ${name}`
        }
      ]
    })

    const prompt_of_image = response.data.choices[0].message?.content;
    
    return prompt_of_image as string;
  } 
  catch (error) 
  {
    console.error("Error in createPromptForMemoryEnhacementCardImage:", error);
    throw error;
  }
}

export async function createImageForMemoryEnhacementCard(prompt_of_image: string) 
{
  try 
  {
    const response = await openai.createImage({prompt: prompt_of_image, n: 1, size: "256x256"})

    const image_url = response.data.data[0].url;
    return image_url as string;
  } 
  catch (error) 
  {
    console.error("Error in createImageForMemoryEnhacementCard:", error);
    throw error;
  }
}
