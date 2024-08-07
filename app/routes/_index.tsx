import { json, type ActionFunction, type MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Simple App" },
    {
      name: "description",
      content:
        "A simple application which gets a word from the user, fetches data from an API, and displays the word, part of speech, and definition.",
    },
  ];
};

// Type definitions for the dictionary data
type DictionaryData = {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
    }[];
  }[];
};

// Type definition for form data
type ActionData = {
  success: boolean;
  word?: string;
  dictionary?: DictionaryData[];
};

// Action function to handle form submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userInput = formData.get("userInput") as string;

  if (!userInput) {
    return json<ActionData>({ success: false });
  }

  // Fetch data from the API
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${userInput}`
  );

  const dictionaries: DictionaryData[] = await response.json();

  // Return the data as JSON
  return json<ActionData>({
    success: true,
    word: userInput,
    dictionary: dictionaries,
  });
};

export default function Index() {
  // Get the data from the ActionData type def
  const actionData = useActionData<ActionData>();

  const getQueryString = () => {
    if (actionData?.dictionary && actionData.dictionary.length > 0) {
      const firstEntry = actionData.dictionary[0];
      const word = firstEntry.word;
      const partOfSpeech = firstEntry.meanings[0].partOfSpeech;
      const definition = firstEntry.meanings[0].definitions[0].definition;
      return `word=${encodeURIComponent(
        word
      )}&partOfSpeech=${encodeURIComponent(
        partOfSpeech
      )}&definition=${encodeURIComponent(definition)}`;
    }
    return "";
  };

  return (
    <div>
      <h1>Simple Form</h1>
      <Form method="post">
        <div>
          <label htmlFor="userInput">Enter a word: </label>
          <input type="text" name="userInput" />
          <button type="submit">Submit</button>
        </div>
      </Form>
      {actionData?.success && actionData.word && (
        <div>
          <h2>Results for: {actionData.word}</h2>
          {actionData.dictionary?.map((entry) => (
            <div key={entry.word}>
              <p>
                <strong>Word:</strong> {entry.word}
              </p>
              {entry.meanings.map((meaning, index) => (
                <div key={index}>
                  <p>
                    <strong>Parts of Speech:</strong> {meaning.partOfSpeech}
                  </p>
                  {meaning.definitions.map((def, defIndex) => (
                    <p key={defIndex}>
                      <strong>Definition:</strong> {def.definition}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <Link to={`/database?${getQueryString()}`}>Go to Database</Link>
        </div>
      )}
    </div>
  );
}
