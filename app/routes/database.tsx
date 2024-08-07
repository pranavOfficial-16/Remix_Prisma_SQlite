import { PrismaClient } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";

// Type definition for the loader data
type LoaderData = {
  word: string;
  partOfSpeech: string;
  definition: string;
};

export async function loader({ request }: { request: Request }) {
  const prisma = new PrismaClient();

  const url = new URL(request.url);
  console.log("url:", url);

  const word = url.searchParams.get("word");
  console.log("word:", word);

  const partOfSpeech = url.searchParams.get("partOfSpeech");
  console.log("partOfSpeech:", partOfSpeech);

  const definition = url.searchParams.get("definition");
  console.log("definition:", definition);

  if (!word || !partOfSpeech || !definition) {
    throw new Error("Missing required parameters");
  }

  // Reset the sequence for the Dictionary table
  //await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Dictionary'`;

  // Delete all entries from the dictionary table
  //await prisma.dictionary.deleteMany({});

  // Create word data in the database
  const word_data = await prisma.dictionary.create({
    data: {
      word,
      partsofspeech: partOfSpeech,
      definition,
    },
  });

  // Get word data
  console.log(word_data);

  // Get all words
  console.log(await prisma.dictionary.findMany());

  return { word, partOfSpeech, definition };
}

export default function Database() {
  const { word, partOfSpeech, definition } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Database Page</h1>
      <div>
        <p>
          <strong>Word:</strong> {word}
        </p>
        <p>
          <strong>Part of Speech:</strong> {partOfSpeech}
        </p>
        <p>
          <strong>Definition:</strong> {definition}
        </p>
      </div>
    </div>
  );
}
